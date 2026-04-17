// app/api/history/route.ts
// Returns all past scans from MongoDB (latest first)

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hirescore");
    const collection = db.collection("scans");

    // Fetch last 20 scans, newest first, only the fields we need for the list
    const scans = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .project({ jobTitle: 1, score: 1, summary: 1, createdAt: 1 })
      .toArray();

    return NextResponse.json(scans);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
