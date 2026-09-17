const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    studentName: String,
    age: Number,
    learningMap: { type: Map, of: String }, // conceptId -> 'mastered' | 'improving' | 'weak'
    weakConcepts: [String],
    rootGap: String,
    misconceptionTag: String,
    mode: { type: String, default: 'initial' }, // 'initial' | 'remedial'
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);