const mongoose = require('mongoose');
 
const peerProfileSchema = new mongoose.Schema({
  name: String,
  age: Number,
  role: { type: String, default: 'peer' }, // 'peer' | 'tutor'
  subjects: [String],
  masteredConcepts: [String],
});
 
module.exports = mongoose.model('PeerProfile', peerProfileSchema);
 