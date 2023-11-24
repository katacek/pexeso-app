"use client";

import React, { useEffect, useState } from "react";
import { S3 } from "aws-sdk";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const Admin = () => {
  const [file, setFile] = useState(null);
  const [upload, setUpload] = useState(null);

  const s3 = new S3({
    region: process.env.region,
    credentials: {
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    },
    signatureVersion: "v4",
  });

  useEffect(() => {
    return upload?.abort();
  }, []);

  const handleFileChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const s3Params = {
      Bucket: "pexeso-bucket",
      Key: file.name,
      Body: file,
      ACL: "public-read",
    };

    try {
      const upload = s3.upload(s3Params).promise();

      /**
       * uploadImgToS3Response returns object
       * Bucket: string
       * ETag:string
       * Key: string
       * Location:url string
       */
      const uploadImgToS3Response = await upload;
      setUpload(uploadImgToS3Response);
      console.log(`File uploaded successfully: ${file.name}`);

      // keep the same structure as later needed for url retrieval from s3
      // Q: Do I need file itself? than, it would not make sense to store it in S3
      const mongoDbData = {
        Key: file.name,
        CodedUrl: uploadImgToS3Response.Location,
      };
      const response = await fetch("/api/savetomongo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: mongoDbData }),
      });
      console.log({ response });
      if (response.ok) {
        alert("Data saved successfully!");
        setInputData("");
      }
    } catch (err) {
      alert(JSON.stringify(err));
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (!upload) return;
    upload.abort();
    progress.set(0);
    setUpload(null);
  };

  // read file from mongo and creating url path
  // I need the s3params again
  //  const s3Params = {
  //     Bucket: "pexeso-bucket",
  //     Key: file.name,  // from mongo
  //     Body: file,
  //     ACL: "public-read",
  //   };
  //   const client = new S3Client({
  //     region: process.env.region,
  //     credentials: {
  //       accessKeyId: process.env.accessKeyId,
  //       secretAccessKey: process.env.secretAccessKey,
  //     },
  //     signatureVersion: "v4",
  //   });
  //   const command = new GetObjectCommand(s3Params);
  //   const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return (
    <div className="dark flex min-h-screen w-full items-center justify-center">
      <form className="flex flex-col gap-4 rounded bg-stone-800 p-10 text-white shadow">
        <input type="file" onChange={handleFileChange} />
        <button
          className="rounded bg-green-500 p-2 shadow"
          onClick={handleUpload}
        >
          Upload
        </button>
        {upload && (
          <>
            <button
              className="rounded bg-red-500 p-2 shadow"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Admin;
