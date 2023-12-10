import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const database = client.db(process.env.MONGO_DB_NAME);
  const collections = await database.listCollections().toArray();
  await client.close();
  return NextResponse.json(collections.map((x) => x.name));
}
