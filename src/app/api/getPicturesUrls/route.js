import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(req) {
  //get keys from collection from mongodb
  const { searchParams } = new URL(req.url);
  const collectionName = searchParams.get("collectionName");
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  // TODO env
  const database = client.db("pexeso-app");
  const collection = database.collection(collectionName);
  const keys = await collection.find({}).toArray();

  //get for all the keys their signedurl
  const s3 = await new S3Client({
    region: process.env.region,
    credentials: {
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    },
    signatureVersion: "v4",
  });

  const signedUrls = [];
  for (const key of keys) {
    const response = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: "pexeso-bucket", Key: key.data }),
      { expiresIn: 60000 }
    );
    signedUrls.push(response);
  }

  await client.close();
  return NextResponse.json({ data: signedUrls });
}
