const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

/**
 * Sends a prompt to Gemini and parses the response as JSON.
 * Strips markdown code fences if present.
 */
async function generateJSON(prompt) {
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini JSON parse failed. Raw output:', text);
    throw new Error('Gemini did not return valid JSON');
  }
}

module.exports = { generateJSON };