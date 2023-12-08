import { S3 } from "aws-sdk";
import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3({
  region: process.env.region,
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
  signatureVersion: "v4",
});

const client = new S3Client({
  region: process.env.region,
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
  signatureVersion: "v4",
});

export async function POST(req) {
  const res = await req.formData();

  const key = res.get("Key");
  const file = res.get("Body");

  const buffer = Buffer.from(await file.arrayBuffer());

  const s3Params = {
    Bucket: "pexeso-bucket",
    ContentType: "image/jpeg",
    ACL: "public-read",
    Key: key,
    Body: buffer,
  };

  const upload = s3.upload(s3Params).promise();

  /**
   * uploadImgToS3Response
   * @returns {{string: string}} Bucket, ETag, Key, Location
   */
  const response = await upload;
  return NextResponse.json(response);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  const s3ParamsGetUrl = {
    Bucket: "pexeso-bucket",
    Key: key, // from mongo
  };

  const command = new GetObjectCommand(s3ParamsGetUrl);
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 60000 });
  return NextResponse.json({ data: signedUrl });
}
