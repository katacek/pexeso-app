import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// export async function GET (request){
//     const greeting = "Hello World!!"
//     const json = {
//         greeting
//     };

//     return NextResponse.json(json);
// }

export async function POST(req) {
  const res = await req.json();
  const { data } = res;
  console.log({ res });
  console.log({ data });

  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const database = client.db("pexeso-app");
  const collection = database.collection("test-game");
  const response = await collection.insertOne({ data });
  return NextResponse.json(response);
}
