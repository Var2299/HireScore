// app/layout.tsx
// Root layout - wraps every page. Contains the navbar.

import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireScore – AI Resume Analyzer",
  description: "Match your resume against any job description using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">

        {/* Navbar */}
        <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-400">
            🎯 HireScore
          </Link>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition">
              Analyze
            </Link>
            <Link href="/history" className="hover:text-white transition">
              History
            </Link>
          </div>
        </nav>

        {/* Page content */}
        <main className="max-w-4xl mx-auto px-6 py-10">
          {children}
        </main>

      </body>
    </html>
  );
}
