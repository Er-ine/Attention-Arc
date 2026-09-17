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
// form-data: file (PDF), studentName, age
// =================================================================
router.post('/materials/upload', upload.single('file'), async (req, res) => {
  try {
    const { studentName, age } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fs = require('fs');
    const fileBuffer = fs.readFileSync(req.file.path);
    const parsed = await pdfParse(fileBuffer);
    const extractedText = parsed.text.slice(0, 12000); // guard against huge PDFs

    const prompt = `You are helping build a study app for a ${age}-year-old student named ${studentName}.
Read the study material below and break it into its core concepts.
For each concept, give a short, age-appropriate simple explanation (2-3 sentences, no jargon beyond what a ${age}-year-old would understand).

Study material:
"""
${extractedText}
"""

Return ONLY valid JSON in this exact shape, nothing else:
{
  "title": "short title for this material",
  "concepts": [
    { "id": "camelCaseId", "title": "Concept Title", "simpleExplanation": "..." }
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
// Normal mode body: { concepts: [{id, title, simpleExplanation}], age }
// Remedial mode body: { mode: 'remedial', targetConceptId, targetConceptTitle, misconceptionTag, age }
// =================================================================
router.post('/quiz/generate', async (req, res) => {
  try {
    const { mode, concepts, age, targetConceptId, targetConceptTitle, misconceptionTag } = req.body;

    let prompt;

    if (mode === 'remedial') {
      prompt = `Create 3 short multiple-choice questions for a ${age}-year-old to check if they still have this specific misconception:
Concept: ${targetConceptTitle} (id: ${targetConceptId})
Misconception: ${misconceptionTag}

Every question should be designed so that a student with this exact misconception would pick a specific wrong option.

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answerIndex": 0,
      "conceptId": "${targetConceptId}",
      "misconceptionTag": "${misconceptionTag}"
    }
  ]
}`;
    } else {
      prompt = `Create a short quiz (1 question per concept) for a ${age}-year-old, based on these concepts:
${JSON.stringify(concepts, null, 2)}

Each question must have 4 options, one correct answer, and be tagged with the conceptId it tests.

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answerIndex": 0,
      "conceptId": "matching concept id"
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
// body: { questions: [...as returned by generate...], answers: { [questionId]: selectedIndex }, studentName, age }
// =================================================================
router.post('/quiz/analyze', async (req, res) => {
  try {
    const { questions, answers, studentName, age } = req.body;

    const conceptStats = {}; // conceptId -> { correct, total }
    const wrongAnswers = [];

    questions.forEach((q) => {
      const selected = answers[q.id];
      const isCorrect = selected === q.answerIndex;

      if (!conceptStats[q.conceptId]) conceptStats[q.conceptId] = { correct: 0, total: 0 };
      conceptStats[q.conceptId].total += 1;
      if (isCorrect) conceptStats[q.conceptId].correct += 1;

      if (!isCorrect) {
        wrongAnswers.push({
          questionId: q.id,
          question: q.question,
          concept: q.conceptId,
          correctAnswer: q.options[q.answerIndex],
          studentAnswer: q.options[selected] ?? 'No answer',
        });
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

    res.json({ learningMap, weakConcepts, wrongAnswers });
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