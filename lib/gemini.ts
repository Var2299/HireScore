// lib/gemini.ts
// This file calls the Gemini API and returns a structured analysis

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with our API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// This is the shape of data we expect back from Gemini
export type AnalysisResult = {
  score: number;           // Match score out of 100
  summary: string;         // One line summary
  matchedSkills: string[]; // Skills that match the job
  missingSkills: string[]; // Skills you need to learn
  prepRoadmap: string[];   // Step by step prep tips
};

export async function analyzeWithGemini(
  jobDescription: string,
  resume: string
): Promise<AnalysisResult> {
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",   // lighter model, less congested
  generationConfig: {
    maxOutputTokens: 800,
  } as any,
});
  // We tell Gemini to return JSON so we can parse it easily
  const prompt = `
You are a technical recruiter. Analyze this resume against the job description.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resume}

Return ONLY a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "score": <number from 0 to 100>,
  "summary": "<one sentence about overall fit>",
  "matchedSkills": ["<skill1>", "<skill2>"],
  "missingSkills": ["<skill1>", "<skill2>"],
  "prepRoadmap": ["<step1>", "<step2>", "<step3>", "<step4>", "<step5>"]
}
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

// Strip markdown fences if Gemini wraps response in ```json ... ```
const cleaned = text
  .replace(/^```json\s*/i, "")  // remove opening ```json
  .replace(/^```\s*/i, "")      // remove opening ``` (no language)
  .replace(/```\s*$/i, "")      // remove closing ```
  .trim();

const parsed: AnalysisResult = JSON.parse(cleaned); // parse the clean JSON
return parsed;
}
