// app/api/history/[id]/route.ts
// Returns one full scan from MongoDB by its ID

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("hirescore");

    const scan = await db
      .collection("scans")
      .findOne({ _id: new ObjectId(params.id) });

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    return NextResponse.json({ ...scan, _id: scan._id.toString() });
  } catch (error) {
    console.error("Error fetching scan:", error);
    return NextResponse.json({ error: "Failed to fetch scan" }, { status: 500 });
  }
}
