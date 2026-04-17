// lib/types.ts
// Shared types used across the app

export type Scan = {
  _id?: string;
  jobTitle: string;          // Short label user gives (e.g. "Zepto SDE Intern")
  jobDescription: string;
  resume: string;
  score: number;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  prepRoadmap: string[];
  createdAt: Date;
};
