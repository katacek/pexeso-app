"use client";

import React, { useEffect, useState } from "react";

const Admin = () => {
  const [file, setFile] = useState(null);
  const [upload, setUpload] = useState(null);


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
        alert("No file provided!");
        return;
    }
    setUpload(true);

    try {
      let formData = new FormData();
      formData.append("Key", file.name);
      formData.append("Body", file);

      console.log({ file });
      const uploadToS3 = await fetch("/api/aws", {
        method: "POST",
        body: formData,
      });

      if (uploadToS3.ok) {
        alert("Data saved to AWS S3 bucket successfully!");
        console.log(`File uploaded successfully: ${file.name}`);
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
      } 

      // get from mongo
      const fetchDataFromMongo = await fetch("/api/mongo");
      const { data: dataFromMongo } = await fetchDataFromMongo.json();
      console.log({dataFromMongo});
      if (dataFromMongo) {
        alert("Data retrieved Mongo successfully!");
      } 
      const fetchSignedUrl = await fetch(`/api/aws?key=${file.name}`);
      const { data: signedUrl} = await fetchSignedUrl.json();

      if (signedUrl) {
        console.log({signedUrl});
        alert("Signed url obtained");
      } 

      setUpload(null);

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
