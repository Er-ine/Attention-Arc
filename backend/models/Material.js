const mongoose = require('mongoose');

const conceptSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    simpleExplanation: String,
  },
  { _id: false }
);

const materialSchema = new mongoose.Schema(
  {
    title: String,
    studentName: String,
    age: Number,
    concepts: [conceptSchema],
    rawTextSnippet: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);