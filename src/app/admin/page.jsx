"use client";

import React, { useState } from "react";
import CreatePexesoModal from "../../components/create_pexeso_modal";
import { useRouter } from "next/navigation";

const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("No file provided!");
      return;
    }
    try {
      // get from mongo
      const fetchDataFromMongo = await fetch("/api/mongo");
      const { data: dataFromMongo } = await fetchDataFromMongo.json();
      if (dataFromMongo) {
        alert("Data retrieved Mongo successfully!");
      }
      const fetchSignedUrl = await fetch(`/api/aws?key=${file.name}`);
      const { data: signedUrl } = await fetchSignedUrl.json();

      if (signedUrl) {
        alert("Signed url obtained");
      }
    } catch (err) {
      console.log({ err });
      alert("Smt went wrong");
    }
  };

  const handleShowPexesos = async () => {
    router.push("/admin/collections");
  };

  return (
    <>
      <button
        onClick={() => router.push("/")}
        className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2"
      >
        Go back
      </button>
      <div className="dark flex min-h-screen w-full items-center justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 focus:outline-none focus:bg-blue-300 m-2"
        >
          Create pexeso
        </button>
        <CreatePexesoModal
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(!isModalOpen)}
        />
        <button
          onClick={handleShowPexesos}
          className="px-4 py-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 focus:outline-none focus:bg-blue-300 m-2"
        >
          Show existing pexesos
        </button>
      </div>
    </>
  );
};

export default Admin;
