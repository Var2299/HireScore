// app/api/analyze/route.ts
// This is the only API endpoint in the app.
// It receives the job description + resume, calls Gemini, saves to MongoDB, returns the result.

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { analyzeWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    // Step 1: Get data from the request body
    const { jobTitle, jobDescription, resume } = await req.json();

    // Basic validation
    if (!jobTitle || !jobDescription || !resume) {
      return NextResponse.json(
        { error: "Please fill all fields" },
        { status: 400 }
      );
    }

    // Step 2: Call Gemini API to analyze the resume
    const analysis = await analyzeWithGemini(jobDescription, resume);

    // Step 3: Save everything to MongoDB
    const client = await clientPromise;
    const db = client.db("hirescore");             // database name
    const collection = db.collection("scans");      // collection name

    const scanToSave = {
      jobTitle,
      jobDescription,
      resume,
      ...analysis,           // score, summary, matchedSkills, missingSkills, prepRoadmap
      createdAt: new Date(),
    };

    const insertResult = await collection.insertOne(scanToSave);

    // Step 4: Return the result to the frontend
    return NextResponse.json({
      _id: insertResult.insertedId.toString(),
      ...scanToSave,
    });

  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { error: "Something went wrong. Check your API keys and try again." },
      { status: 500 }
    );
  }
}
