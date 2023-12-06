import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  // TODO env
  const database = client.db("pexeso-app");
  const collections = await database.listCollections().toArray();
  await client.close();
  return NextResponse.json(collections.map((x) => x.name));
}
