import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// const client = new MongoClient(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

export async function DELETE(req) {
  const data = await req.json();
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const database = client.db(process.env.MONGO_DB_NAME);

  await database.collection(data.collection).drop();

  // TODO: probably smt different?
  return NextResponse.json({ data: "ok" });
}
