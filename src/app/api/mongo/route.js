import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = client.db("pexeso-app");
const collection = database.collection("test-game");

export async function GET (req, response){
  try {
    const testGameDataCollection = await collection.find({}).toArray();
    console.log({testGameDataCollection})
    Response.json(testGameDataCollection);

  } catch(err) {
    Response.json(err);
    console.error(err);
  }
}

export async function POST(req) {
  const res = await req.json();
  const { data } = res;

  await client.connect();
  const response = await collection.insertOne({ data });
  return NextResponse.json(response);
}
