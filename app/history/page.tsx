// app/history/page.tsx
// Shows all past scans. Each card is now a clickable link to the full result.

import Link from "next/link";

type HistoryScan = {
  _id: string;
  jobTitle: string;
  score: number;
  summary: string;
  createdAt: string;
};

async function getHistory(): Promise<HistoryScan[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/history`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function getScoreBadgeColor(score: number) {
  if (score >= 70) return "bg-green-900 text-green-300";
  if (score >= 40) return "bg-yellow-900 text-yellow-300";
  return "bg-red-900 text-red-300";
}

export default async function HistoryPage() {
  const scans = await getHistory();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Scan History</h1>
      <p className="text-gray-400 mb-8">
        Click any scan to view the full AI analysis.
      </p>

      {scans.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg">No scans yet.</p>
          <Link href="/" className="text-blue-400 hover:underline mt-2 inline-block">
            Analyze your first resume →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {scans.map((scan) => (
            <Link
              key={scan._id}
              href={`/history/${scan._id}`}
              className="block bg-gray-900 border border-gray-800 hover:border-gray-600 hover:bg-gray-800 rounded-xl p-5 transition group"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: job title + summary + date */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-white truncate group-hover:text-blue-400 transition">
                    {scan.jobTitle}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 truncate">{scan.summary}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(scan.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Right: score badge + arrow */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-4 py-2 rounded-lg font-bold text-lg ${getScoreBadgeColor(scan.score)}`}>
                    {scan.score}/100
                  </span>
                  <span className="text-gray-600 group-hover:text-gray-400 transition text-lg">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block transition font-medium"
        >
          + New Analysis
        </Link>
      </div>
    </div>
  );
}
