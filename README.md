<div align="center">

# 🎯 Attention Arc

### Turning study material into a personalized learning journey

*material → understanding → diagnosis → human help → reinforcement*

[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Gemini API](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)

</div>

---

## 💡 What is this?

**Attention Arc** is a learning app for students aged **7–16** that treats struggling not as a failing grade, but as a *specific, fixable, well-understood gap.*

A student uploads a chapter or their notes. The app breaks it into core concepts, explains each one in age-appropriate language, and checks understanding with a short quiz — but instead of just scoring it, every answer is mapped to a concept. The app builds a **learning map**, traces weak spots back to their **root cause**, and even flags likely **misconceptions** behind wrong answers.

The differentiator: instead of throwing more content at a struggling student, Attention Arc connects them with a **verified peer or tutor** who specifically understands that gap — a controlled, monitored human handoff, not an open chat. Afterward, a short **remedial quiz** confirms the gap has actually closed.

---

## 🔄 The Learning Loop

```
📄 Upload material
        ↓
🧠 AI extracts concepts + age-appropriate explanations
        ↓
📝 Short quiz (tagged per concept)
        ↓
🗺️  Learning map — mastered / improving / weak
        ↓
🔍 Root gap traced + misconception detected
        ↓
🤝 Matched with a peer/tutor who's mastered that gap
        ↓
✅ Remedial quiz confirms the gap has closed
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | React |
| **Backend** | Node.js + Express |
| **Database** | MongoDB (Mongoose) |
| **AI** | Google Gemini API (`gemini-2.0-flash`) |
| **File handling** | Multer (upload) + pdf-parse (text extraction) |

---

## 📁 Project Structure

```
Attention Arc/
├── frontend/                 # React app
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
```

---

## 🚀 Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env      # add your MONGO_URI + GEMINI_API_KEY
npm run seed               # loads sample peer/tutor profiles
npm run dev                 # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Reference

| Method | Endpoint | What it does |
|---|---|---|
| `POST` | `/api/materials/upload` | PDF → concepts + age-appropriate explanations |
| `POST` | `/api/quiz/generate` | Generate quiz questions (initial or targeted remedial) |
| `POST` | `/api/quiz/analyze` | Score answers → learning map + weak concepts |
| `POST` | `/api/gap` | Trace a weak concept back to its root prerequisite gap |
| `POST` | `/api/misconception` | Classify a wrong answer as a *possible* misconception |
| `POST` | `/api/match` | Find a peer/tutor who's mastered the gap concept |

---

## 🔐 Environment Variables

See `backend/.env.example` for the required keys:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

---

## 👥 Team

| Role | Name |
|---|---|
| Backend | Erine Anna Binu |
| Frontend | Aleena Benny |

---

<div align="center">

*Built for a hackathon — turning "you got a bad grade" into "here's exactly what you're missing, and here's who can help."*

</div>