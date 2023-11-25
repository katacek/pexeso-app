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

  const key = res.get('Key');
  const body = res.get('Body');
  const str = body.toString('base64');
  const buffer = Buffer.from(str,'base64');

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