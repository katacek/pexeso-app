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

  const client = new S3Client({
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
    if (!file) {
        alert("Error while saving data AWS S3 bucket!");
        return;
    }

    try {
      let formData = new FormData();
      formData.append("Key", file.name);
      formData.append("Body", file);

      console.log({ file });
      const uploadToS3 = await fetch("/api/awsPost", {
        method: "POST",
        body: formData,
      });

      if (uploadToS3.ok) {
        setUpload(true);
        alert("Data saved to AWS S3 bucket successfully!");
        console.log(`File uploaded successfully: ${file.name}`);
      } else {
        alert("Error while saving data AWS S3 bucket!");
        return;
      }

      const mongoDbData = {
        Key: file.name,
        CodedUrl: uploadToS3.Location,
      };
      const uploadToMongo = await fetch("/api/mongo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: mongoDbData }),
      });
      if (uploadToMongo.ok) {
        alert("Data saved to Mongo successfully!");
      } else {
        alert("Error while saving data Mongo");
        return;
      }

      // TODO: get from mongo
      const getSignedUrl = await fetch(`/api/awsGet?key=${file.name}`);
      const signedUrl = getSignedUrl.body

      if (getSignedUrl.ok) {
        // todo: this is readable stream, not url string
        console.log({signedUrl});
        alert("Signed url obtained");
      } else {
        alert("Error while getting signed url");
        return;
      }

    } catch (err) {
        console.log({err});
        alert("Smt went wrong");
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
