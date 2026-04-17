"use client";
// app/page.tsx
// Main page - contains the form and shows results after analysis.
// "use client" because we use useState and onClick (browser-only features).

import { useState } from "react";
import type { Scan } from "@/lib/types";

export default function HomePage() {
  // Form fields
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // The result returned from our API
  const [result, setResult] = useState<Scan | null>(null);

  // Called when user clicks "Analyze"
  async function handleAnalyze() {
    // Reset previous state
    setError("");
    setResult(null);
    setLoading(true);

    try {
      // Call our Next.js API route
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription, resume }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Determine score color
  function getScoreColor(score: number) {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  }

  return (
    <div>
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-2">Resume Analyzer</h1>
      <p className="text-gray-400 mb-8">
        Paste a job description and your resume. Gemini AI will score your fit and tell you exactly what to improve.
      </p>

      {/* ── FORM ── */}
      <div className="space-y-5">

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Job Title / Label
          </label>
          <input
            type="text"
            placeholder="e.g. Zepto SDE Intern, Razorpay Frontend Role"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Job Description
          </label>
          <textarea
            rows={7}
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {/* Resume */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Your Resume (paste as plain text)
          </label>
          <textarea
            rows={10}
            placeholder="Paste your resume content here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Submit button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !jobTitle || !jobDescription || !resume}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? "⏳ Analyzing with Gemini AI..." : "🚀 Analyze My Resume"}
        </button>
      </div>

      {/* ── RESULTS ── */}
      {result && (
        <div className="mt-10 space-y-6">

          <h2 className="text-2xl font-bold border-b border-gray-800 pb-3">
            Results for: <span className="text-blue-400">{result.jobTitle}</span>
          </h2>

          {/* Score card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Match Score</p>
            <p className={`text-7xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}
            </p>
            <p className="text-gray-400 text-sm mt-1">out of 100</p>
            <p className="text-gray-300 mt-4 text-sm">{result.summary}</p>
          </div>

          {/* Two column: matched + missing skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Matched Skills */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-green-400 mb-3">✅ Matched Skills</h3>
              <ul className="space-y-2">
                {result.matchedSkills.map((skill, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Skills */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-red-400 mb-3">❌ Missing Skills</h3>
              <ul className="space-y-2">
                {result.missingSkills.map((skill, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Prep Roadmap */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-blue-400 mb-4">🗺️ Your Prep Roadmap</h3>
            <ol className="space-y-3">
              {result.prepRoadmap.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-300">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Saved confirmation */}
          <p className="text-center text-xs text-gray-600">
            ✓ This scan has been saved to your history
          </p>

        </div>
      )}
    </div>
  );
}
