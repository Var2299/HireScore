# 🎯 HireScore – AI Resume Analyzer

Paste a job description + your resume → Gemini AI gives you a match score, missing skills, and a prep roadmap.

## How It Works (Simple Flow)

```
User fills form
    ↓
POST /api/analyze
    ↓
Gemini AI reads job description + resume
    ↓
Returns: score, matched skills, missing skills, prep roadmap
    ↓
Saved to MongoDB
    ↓
Displayed on screen
```

## Tech Stack
- **Next.js 15** – React framework (frontend + backend)
- **TypeScript** – Type safety
- **MongoDB** – Stores all scan history
- **Gemini API** – AI analysis

## Preview

### Home Page
<img width="1896" height="1025" alt="image" src="https://github.com/user-attachments/assets/59673d02-e506-4cf1-8425-532bbde4822d" />

---

### History Page
<img width="1917" height="1013" alt="image" src="https://github.com/user-attachments/assets/64f13e2a-75b4-4803-ad8d-e556f542c580" />

---

### Full Analysis
<img width="1897" height="992" alt="image" src="https://github.com/user-attachments/assets/51b81b4f-36f7-44f7-8fc0-7da0185ed717" />
---
<img width="1857" height="512" alt="image" src="https://github.com/user-attachments/assets/b5d65f44-64a4-4fb7-8661-c7d2cd3e8542" />
---

### Scan Structure (MongoDB)
<img width="1371" height="502" alt="image" src="https://github.com/user-attachments/assets/24a3df67-211d-4093-a256-d34647e6c3ec" />

---

## Project Structure

```
hirescore/
├── app/
│   ├── page.tsx              ← Main page (form + results)
│   ├── layout.tsx            ← Navbar + page wrapper
│   ├── globals.css           ← Tailwind base styles
│   ├── history/
│   │   └── page.tsx          ← Past scans from MongoDB
│   └── api/
│       ├── analyze/
│       │   └── route.ts      ← POST: calls Gemini + saves to MongoDB
│       └── history/
│           └── route.ts      ← GET: returns past scans
├── lib/
│   ├── mongodb.ts            ← MongoDB connection (singleton)
│   ├── gemini.ts             ← Gemini API call + prompt
│   └── types.ts              ← Shared TypeScript types
└── .env.example              ← Copy to .env.local and fill in keys
```

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Then fill in:
- `GEMINI_API_KEY` → Get free from https://aistudio.google.com/app/apikey
- `MONGODB_URI` → Get free from https://www.mongodb.com/cloud/atlas

### 3. Run the dev server
```bash
npm run dev
```

Open http://localhost:3000

