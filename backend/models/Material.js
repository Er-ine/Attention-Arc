const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: String,
    studentName: String,
    age: Number,
    // Flexible shape — matches whatever Gemini/the frontend expects
    // ({ id, label, explanation: {young, teen}, simplerExplanation: {young, teen} })
    concepts: [mongoose.Schema.Types.Mixed],
    rawTextSnippet: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);
