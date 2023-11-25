import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// TODO: try to put it in one route

export async function GET(req) {
    const client = new S3Client({
      region: process.env.region,
      credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
      },
      signatureVersion: "v4",
    });
  
    const {searchParams} = new URL(req.url);
    const key = searchParams.get('key');

    const s3ParamsGetUrl = {
        Bucket: "pexeso-bucket",
        Key: key, // from mongo
      };
  
    const command = new GetObjectCommand(s3ParamsGetUrl);
    const response = await getSignedUrl(client, command, { expiresIn: 60000 });
    // todo: this is string and returns 
    console.log({response})
    return NextResponse.json(response);
  }