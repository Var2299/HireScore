# 🎯 HireScore – AI Resume Analyzer

Paste a job description + your resume → Gemini AI gives you a match score, missing skills, and a prep roadmap.

## Tech Stack
- **Next.js 15** – React framework (frontend + backend)
- **TypeScript** – Type safety
- **MongoDB** – Stores all scan history
- **Gemini API** – AI analysis

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

## How to Explain in Interview

**"What does this project do?"**
> It analyzes your resume against a job description using Gemini AI and gives you a match score, identifies skill gaps, and generates a personalized prep roadmap.

**"What's the architecture?"**
> It's a Next.js full-stack app. The frontend is a React client component with useState. The backend is a Next.js API Route that calls the Gemini API and saves results to MongoDB Atlas.

**"Why MongoDB?"**
> To persist scan history so users can track their improvement over time across sessions.

**"How does the AI part work?"**
> I send a structured prompt to Gemini 1.5 Flash with the job description and resume, and ask it to return a JSON object with score, matched skills, missing skills, and prep steps. Then I parse that JSON and display it.
