import { MongoClient } from "mongodb";
import { S3 } from "aws-sdk";
import { NextResponse } from "next/server";

export async function POST(req) {
  const s3 = new S3({
    region: process.env.region,
    credentials: {
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    },
    signatureVersion: "v4",
  });

  const res = await req.formData();

  const key = res.get("key");
  const file = res.get("body");

  const buffer = Buffer.from(await file.arrayBuffer());

  const s3Params = {
    Bucket: process.env.AWS_BUCKET,
    ContentType: "image/jpeg",
    ACL: "public-read",
    Key: key,
    Body: buffer,
  };

  const response = await s3.upload(s3Params).promise();
  const collectionName = res.get("collectionName");
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const database = client.db(process.env.MONGO_DB_NAME);
  const collection = database.collection(collectionName);
  if (!collection) await database.createCollection(collectionName);
  const responseMongo = await collection.insertOne({ data: key });
  await client.close();

  return NextResponse.json(response);
}
