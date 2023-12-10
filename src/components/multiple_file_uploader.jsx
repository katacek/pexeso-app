import React, { useState } from "react";
import { useRouter } from "next/navigation";

const MultipleFileUploader = () => {
  const [files, setFiles] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [status, setStatus] = useState("initial");
  const router = useRouter();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setStatus("initial");
      setFiles(e.target.files);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files) {
      alert("No file provided!");
      return;
    }
    if (files) {
      setStatus("uploading");

      try {
        for (const file of files) {
          const formData = new FormData();
          formData.append("body", file);
          formData.append("key", file.name);
          formData.append("collectionName", collectionName);
          await fetch("api/imageUpload", {
            method: "POST",
            body: formData,
          });
        }
        setStatus("success");
        router.push("/admin/collections");
      } catch (error) {
        console.error("Error occurred during image upload:", error);
        setStatus("fail");
      }
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="text"
        placeholder="Collection Name"
        className="w-full p-2 rounded-md mb-4 bg-blue-100 text-blue-800 border border-blue-300"
        onChange={(e) => setCollectionName(e.target.value)}
      />
      <div className="input-group">
        <label htmlFor="file" className="sr-only">
          Choose files
        </label>
        <input id="file" type="file" multiple onChange={handleFileChange} />
      </div>
      {files &&
        [...files].map((file, index) => (
          <section key={file.name}>
            <ul>
              <li className="m-2">Name: {file.name}</li>
            </ul>
          </section>
        ))}

      {files && (
        <button className="submit px-4 py-2 bg-blue-600 text-white rounded-md mr-2 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 m-2">
          Upload {files.length > 1 ? "files" : "a file"}
        </button>
      )}

      <Result status={status} />
    </form>
  );
};

const Result = ({ status }) => {
  if (status === "success") {
    return <p>✅ Uploaded successfully!</p>;
  } else if (status === "fail") {
    return <p>❌ Upload failed!</p>;
  } else if (status === "uploading") {
    return <p>⏳ Uploading started...</p>;
  } else {
    return null;
  }
};

export default MultipleFileUploader;
