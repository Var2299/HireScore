// lib/mongodb.ts
// Simple MongoDB connection using a cached client
// We cache the client so we don't create a new connection on every API call

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

// Cache the MongoDB client across hot reloads in development
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Please add MONGODB_URI to your .env.local file");
}

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so we don't reconnect on every reload
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, just create a new client
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
