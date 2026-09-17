const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');

const Material = require('../models/Material');
const Result = require('../models/Result');
const PeerProfile = require('../models/PeerProfile');
const { generateJSON } = require('../services/geminiService');

const router = express.Router();

const upload = multer({ dest: path.join(__dirname, '../uploads') });

// ---------------------------------------------------------------
// Hardcoded prerequisite map — used for #4 root-gap tracing.
// No AI call needed here, it's just a lookup.
// ---------------------------------------------------------------
const prerequisites = {
  fractionAddition: ['commonDenominator'],
  commonDenominator: ['equivalentFractions'],
  wordProblems: ['fractionAddition'],
  equivalentFractions: [],
};

function traceRootGap(weakConceptId) {
  let current = weakConceptId;
  const visited = new Set();

  while (prerequisites[current] && prerequisites[current].length > 0) {
    if (visited.has(current)) break; // safety against cycles
    visited.add(current);
    current = prerequisites[current][0];
  }
  return current;
}

// =================================================================
// 1. POST /api/materials/upload
// form-data: file (PDF), studentName, age (number)
//
// Response shape matches the frontend's mockConcepts.js exactly, so
// TutoringChat can consume it with zero adapter code:
// { title, materialId, concepts: [{ id, label, explanation: {young, teen}, simplerExplanation: {young, teen} }] }
// =================================================================
router.post('/materials/upload', upload.single('file'), async (req, res) => {
  try {
    const { studentName, age } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fs = require('fs');
    const fileBuffer = fs.readFileSync(req.file.path);
    const parsed = await pdfParse(fileBuffer);
    const extractedText = parsed.text.slice(0, 12000); // guard against huge PDFs

    const prompt = `You are helping build a study app for students aged 7-16, named ${studentName} (currently ${age} years old).
Read the study material below and break it into its core concepts (3-5 concepts max).

For EACH concept, give:
- a "young" explanation (for a 7-11 year old): simple, uses an everyday analogy, 1-2 short sentences
- a "teen" explanation (for a 12-16 year old): a bit more precise/technical, 1-2 sentences
- a "young" simpler explanation: an even more basic fallback if the first one didn't click
- a "teen" simpler explanation: same, but for the older age band

Study material:
"""
${extractedText}
"""

Return ONLY valid JSON in this exact shape, nothing else:
{
  "title": "short title for this material",
  "concepts": [
    {
      "id": "camelCaseId",
      "label": "Concept Title",
      "explanation": { "young": "...", "teen": "..." },
      "simplerExplanation": { "young": "...", "teen": "..." }
    }
  ]
}`;

    const aiResult = await generateJSON(prompt);

    const material = await Material.create({
      title: aiResult.title,
      studentName,
      age,
      concepts: aiResult.concepts,
      rawTextSnippet: extractedText.slice(0, 500),
    });

    res.json({ materialId: material._id, title: material.title, concepts: material.concepts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload processing failed', details: err.message });
  }
});

// =================================================================
// 2. POST /api/quiz/generate
// Normal mode body: { concepts: [{id, label, explanation, simplerExplanation}], age }
// Remedial mode body: { mode: 'remedial', targetConceptId, targetConceptLabel, misconceptionTag, age }
//
// Response shape matches mockQuizQuestions.js exactly, so QuizStep.jsx
// can consume it with zero adapter code:
// { questions: [{ id, conceptId, prompt, options: [{ id, text, correct, misconceptionTag? }] }] }
// =================================================================
router.post('/quiz/generate', async (req, res) => {
  try {
    const { mode, concepts, age, targetConceptId, targetConceptLabel, misconceptionTag } = req.body;

    let prompt;

    if (mode === 'remedial') {
      prompt = `Create 3 short multiple-choice questions for a ${age}-year-old to check if they still have this specific misconception:
Concept: ${targetConceptLabel} (id: ${targetConceptId})
Misconception: ${misconceptionTag}

Every question should be designed so that a student with this exact misconception would pick a specific wrong option. Tag that wrong option with "misconceptionTag": "${misconceptionTag}". Each question needs 3 options total, exactly one marked "correct": true.

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": "r1",
      "conceptId": "${targetConceptId}",
      "prompt": "...",
      "options": [
        { "id": "a", "text": "...", "correct": true },
        { "id": "b", "text": "...", "correct": false, "misconceptionTag": "${misconceptionTag}" },
        { "id": "c", "text": "...", "correct": false }
      ]
    }
  ]
}`;
    } else {
      prompt = `Create a short quiz (1 question per concept) for a ${age}-year-old, based on these concepts:
${JSON.stringify(concepts, null, 2)}

Each question needs 3 options, exactly one marked "correct": true. If a wrong option represents a common, specific misconception (not just "wrong"), tag it with a short snake_case "misconceptionTag" — otherwise omit that field.

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "conceptId": "matching concept id from the list above",
      "prompt": "...",
      "options": [
        { "id": "a", "text": "...", "correct": false, "misconceptionTag": "optional_tag" },
        { "id": "b", "text": "...", "correct": true },
        { "id": "c", "text": "...", "correct": false }
      ]
    }
  ]
}`;
    }

    const aiResult = await generateJSON(prompt);
    res.json(aiResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Quiz generation failed', details: err.message });
  }
});

// =================================================================
// 3. POST /api/quiz/analyze
// body: { answers, studentName, age }
// answers is exactly what QuizStep.jsx already builds per question:
// [{ questionId, conceptId, correct, misconceptionTag }]
// =================================================================
router.post('/quiz/analyze', async (req, res) => {
  try {
    const { answers, studentName, age } = req.body;

    const conceptStats = {}; // conceptId -> { correct, total }
    const misconceptions = [];

    answers.forEach((a) => {
      if (!conceptStats[a.conceptId]) conceptStats[a.conceptId] = { correct: 0, total: 0 };
      conceptStats[a.conceptId].total += 1;
      if (a.correct) conceptStats[a.conceptId].correct += 1;
      else if (a.misconceptionTag) {
        misconceptions.push({ conceptId: a.conceptId, misconceptionTag: a.misconceptionTag });
      }
    });

    const learningMap = {};
    Object.entries(conceptStats).forEach(([conceptId, stat]) => {
      const pct = stat.correct / stat.total;
      if (pct === 1) learningMap[conceptId] = 'mastered';
      else if (pct >= 0.5) learningMap[conceptId] = 'improving';
      else learningMap[conceptId] = 'weak';
    });

    const weakConcepts = Object.keys(learningMap).filter((id) => learningMap[id] === 'weak');

    await Result.create({ studentName, age, learningMap, weakConcepts, mode: 'initial' });

    res.json({ learningMap, weakConcepts, misconceptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Quiz analysis failed', details: err.message });
  }
});

// =================================================================
// 4. POST /api/gap
// body: { weakConceptId }
// =================================================================
router.post('/gap', (req, res) => {
  const { weakConceptId } = req.body;
  if (!weakConceptId) return res.status(400).json({ error: 'weakConceptId is required' });

  const rootGap = traceRootGap(weakConceptId);
  res.json({ weakConcept: weakConceptId, rootGap });
});

// =================================================================
// 5. POST /api/misconception
// body: { question, correctAnswer, studentAnswer, concept }
// =================================================================
router.post('/misconception', async (req, res) => {
  try {
    const { question, correctAnswer, studentAnswer, concept } = req.body;

    const prompt = `A student answered a question incorrectly.
Question: ${question}
Correct answer: ${correctAnswer}
Student's answer: ${studentAnswer}
Concept: ${concept}

Decide if this wrong answer suggests a specific, identifiable misconception (a consistent wrong mental model), or if it's just a random mistake.
Return ONLY valid JSON:
{
  "hasMisconception": true or false,
  "misconceptionTag": "short_snake_case_tag or null",
  "explanation": "one sentence, framed as a possible misconception, not a diagnosis"
}`;

    const aiResult = await generateJSON(prompt);
    res.json(aiResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Misconception detection failed', details: err.message });
  }
});

// =================================================================
// 6. POST /api/match
// body: { subject, gapConcept, age }
// =================================================================
router.post('/match', async (req, res) => {
  try {
    const { subject, gapConcept, age } = req.body;

    const matches = await PeerProfile.find({
      subjects: subject,
      masteredConcepts: gapConcept,
      age: { $gte: age - 2, $lte: age + 2 },
    }).limit(5);

    res.json({ matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Matching failed', details: err.message });
  }
});

module.exports = router;
