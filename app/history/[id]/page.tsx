// app/history/[id]/page.tsx
// Shows the full AI analysis for a past scan.
// Opened when user clicks any item in the history list.

import Link from "next/link";
import type { Scan } from "@/lib/types";

// Fetch one scan from our API using the ID from the URL
async function getScan(id: string): Promise<Scan | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/history/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function getScoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

function getScoreBg(score: number) {
  if (score >= 70) return "border-green-800 bg-green-950";
  if (score >= 40) return "border-yellow-800 bg-yellow-950";
  return "border-red-800 bg-red-950";
}

export default async function ScanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const scan = await getScan(params.id);

  // If scan not found, show error state
  if (!scan) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">❌</p>
        <p className="text-lg text-gray-400">Scan not found.</p>
        <Link href="/history" className="text-blue-400 hover:underline mt-2 inline-block">
          ← Back to History
        </Link>
      </div>
    );
  }

  return (
    <div>

      {/* Back button */}
      <Link
        href="/history"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-6"
      >
        ← Back to History
      </Link>

      {/* Header */}
      <h1 className="text-3xl font-bold mb-1">{scan.jobTitle}</h1>
      <p className="text-gray-500 text-sm mb-8">
        Analyzed on{" "}
        {new Date(scan.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      {/* Score card */}
      <div className={`border rounded-xl p-6 text-center mb-6 ${getScoreBg(scan.score)}`}>
        <p className="text-gray-400 text-sm mb-2">Match Score</p>
        <p className={`text-7xl font-bold ${getScoreColor(scan.score)}`}>
          {scan.score}
        </p>
        <p className="text-gray-400 text-sm mt-1">out of 100</p>
        <p className="text-gray-300 mt-4 text-sm">{scan.summary}</p>
      </div>

      {/* Matched + Missing Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold text-green-400 mb-3">✅ Matched Skills</h3>
          <ul className="space-y-2">
            {scan.matchedSkills.map((skill, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold text-red-400 mb-3">❌ Missing Skills</h3>
          <ul className="space-y-2">
            {scan.missingSkills.map((skill, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                {skill}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Prep Roadmap */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-blue-400 mb-4">🗺️ Prep Roadmap</h3>
        <ol className="space-y-3">
          {scan.prepRoadmap.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-300">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Job Description + Resume toggle — collapsed by default */}
      <details className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-400 hover:text-white transition">
          📄 View Original Job Description
        </summary>
        <p className="mt-4 text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">
          {scan.jobDescription}
        </p>
      </details>

      <details className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <summary className="cursor-pointer text-sm font-medium text-gray-400 hover:text-white transition">
          📋 View Submitted Resume
        </summary>
        <p className="mt-4 text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">
          {scan.resume}
        </p>
      </details>

    </div>
  );
}
