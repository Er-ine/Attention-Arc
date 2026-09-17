require('dotenv').config();
const mongoose = require('mongoose');
const PeerProfile = require('../models/PeerProfile');

const peers = [
  { name: 'Aarav', age: 13, role: 'peer', subjects: ['math'], masteredConcepts: ['commonDenominator', 'equivalentFractions'] },
  { name: 'Diya', age: 12, role: 'peer', subjects: ['math'], masteredConcepts: ['fractionAddition', 'commonDenominator'] },
  { name: 'Kabir', age: 14, role: 'tutor', subjects: ['math'], masteredConcepts: ['wordProblems', 'fractionAddition', 'commonDenominator', 'equivalentFractions'] },
  { name: 'Meera', age: 11, role: 'peer', subjects: ['math'], masteredConcepts: ['equivalentFractions'] },
  { name: 'Rohan', age: 15, role: 'tutor', subjects: ['math', 'science'], masteredConcepts: ['fractionAddition', 'wordProblems'] },
  { name: 'Ananya', age: 13, role: 'peer', subjects: ['science'], masteredConcepts: ['photosynthesis', 'cellStructure'] },
  { name: 'Ishaan', age: 10, role: 'peer', subjects: ['math'], masteredConcepts: ['commonDenominator'] },
  { name: 'Sara', age: 16, role: 'tutor', subjects: ['math'], masteredConcepts: ['equivalentFractions', 'commonDenominator', 'fractionAddition', 'wordProblems'] },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await PeerProfile.deleteMany({});
  await PeerProfile.insertMany(peers);
  console.log(`Seeded ${peers.length} peer profiles`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});