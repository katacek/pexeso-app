import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = client.db("pexeso-app");
const collection = database.collection("test-game");

export async function GET() {
  try {
    const testGameDataCollection = await collection.find({}).toArray();
    return NextResponse.json({ data: testGameDataCollection });
  } catch (err) {
    console.error(err);
    return NextResponse.json(err);
  }
}

export async function POST(req) {
  const res = await req.json();
  const { data } = res;

  await client.connect();
  const response = await collection.insertOne({ data });
  return NextResponse.json(response);
}
