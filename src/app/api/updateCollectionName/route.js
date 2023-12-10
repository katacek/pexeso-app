import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// const client = new MongoClient(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

export async function PUT(req) {
  const data = await req.json();
  console.log({ data });
  const currentCollectionName = data.currentCollectionName;
  const newCollectionName = data.newCollectionName;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const database = client.db(process.env.MONGO_DB_NAME);

  await database.collection(currentCollectionName).rename(newCollectionName);

  // TODO: probably smt different?
  return NextResponse.json({ data: "ok" });
}
