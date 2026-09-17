ttention Arc

A learning app for students aged 7–16 that turns any study material into a personalized learning loop: material → understanding → diagnosis → human help → reinforcement.

How it works
Student uploads a chapter/notes (PDF)
AI breaks it into core concepts and explains them at an age-appropriate level
A short quiz checks understanding, tagged concept-by-concept
The app builds a learning map (mastered / improving / weak) and traces weak spots back to their root gap
Wrong answers are checked for a likely misconception
If a misconception is found, the student is connected with a verified peer/tutor who has mastered that concept
A short remedial quiz (built from the misconception) confirms the gap has closed
Tech stack
Frontend: React
Backend: Node.js, Express
Database: MongoDB (Mongoose)
AI: Google Gemini API (gemini-2.0-flash)
File handling: Multer (upload), pdf-parse (text extraction)
Project structure
Attention Arc/
├── frontend/          # React app
└── backend/
    ├── server.js
    ├── routes/
    │   └── api.js
    ├── models/
    │   ├── Material.js
    │   ├── Result.js
    │   └── PeerProfile.js
    ├── services/
    │   └── geminiService.js
    ├── seed/
    │   └── seedPeers.js
    └── uploads/
Setup
Backend
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and GEMINI_API_KEY
npm run seed            # loads sample peer/tutor profiles
npm run dev

Runs on http://localhost:5000.

Frontend
cd frontend
npm install
npm run dev
API endpoints
Method	Endpoint	Purpose
POST	/api/materials/upload	PDF → concepts + age-appropriate explanations
POST	/api/quiz/generate	Generate quiz questions from concepts (or a targeted remedial quiz)
POST	/api/quiz/analyze	Score answers → learning map + weak concepts
POST	/api/gap	Trace a weak concept back to its root prerequisite gap
POST	/api/misconception	Classify a wrong answer as a possible misconception
POST	/api/match	Find a peer/tutor who has mastered the gap concept
Environment variables

See backend/.env.example for the required keys (MONGO_URI, GEMINI_API_KEY).

Team
Backend: Erine Anna Binu
Frontend: Aleena Benny
