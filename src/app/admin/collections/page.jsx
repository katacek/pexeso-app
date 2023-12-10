"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { handleLoadItems } from "../../helpers";
import { Dialog } from "@headlessui/react";

const Collections = () => {
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [currentCollectionName, setCurrentCollectionName] = useState("");

  // TODO: use react query for the loading state
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const fetchCollections = await fetch("/api/getCollections");
        const collections = await fetchCollections.json();
        setCollections(collections);
      } catch (err) {
        console.log({ err });
        alert("Smt went wrong in fetching collections");
      }
    };
    fetchCollections().catch(console.error);
  }, []);

  const handleRenameCollection = async (collection) => {
    setCurrentCollectionName(collection);
    setModalOpen(true);
  };

  // TODO move to components
  function RenameCollectionModal() {
    return (
      <Dialog
        open={isModalOpen}
        onClose={() => setModalOpen(!isModalOpen)}
        className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
      >
        <Dialog.Panel className="bg-blue-500 text-white border rounded-md w-full max-w-md p-4">
          <Dialog.Title className="text-xl font-bold mb-2">
            Enter new collection name
          </Dialog.Title>
          <div>
            <input
              type="text"
              placeholder="My awesome game collection"
              value={newCollectionName}
              onChange={(e) => {
                setNewCollectionName(e.target.value);
              }}
              className="w-full p-2 rounded-md mb-4 bg-blue-100 text-blue-800 border border-blue-300"
            ></input>
          </div>
          <div>
            <button
              onClick={() => {
                renameCollection();
                setModalOpen(!isModalOpen);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md mr-2 hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
              That&apos;s it, rename!
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    );
  }

  const renameCollection = async () => {
    const collectionRenaming = {
      currentCollectionName,
      newCollectionName,
    };
    try {
      const updateCollectionName = await fetch("/api/updateCollectionName", {
        method: "PUT",
        body: JSON.stringify(collectionRenaming),
        headers: {
          "content-type": "application/json",
        },
      });
      const updated = await updateCollectionName.json();
      console.log({ updated });
      // update collections name, todo: do it better
      const fetchCollections = await fetch("/api/getCollections");
      const collections = await fetchCollections.json();
      setCollections(collections);
    } catch (err) {
      console.log({ err });
      alert("Smt went wrong in renaming collections");
    }
  };

  const handleRemoveCollection = async (collection) => {
    // TODO: modal to ask if really remove
    try {
      const removeCollectionName = await fetch("/api/deleteCollection", {
        method: "DELETE",
        body: JSON.stringify({ collection }),
        headers: {
          "content-type": "application/json",
        },
      });
      const removed = await removeCollectionName.json();
      console.log({ removed });
      // update collections name, todo: do it better
      const fetchCollections = await fetch("/api/getCollections");
      const collections = await fetchCollections.json();
      setCollections(collections);
      alert("Collection deleted");
    } catch (err) {
      console.log({ err });
      alert("Smt went wrong in removing collections");
    }
  };

  return (
    <>
      <button
        onClick={() => router.push("/admin")}
        className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2"
      >
        Go back
      </button>
      <RenameCollectionModal isModalOpen={isModalOpen} />
      <p className="m-2">Click on the collections below to see the items</p>
      <div>
        {collections ? (
          [...collections].map((collection, index) => (
            <div key={index}>
              <button
                className="inline-block rounded border-2 border-info px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-info transition duration-150 ease-in-out hover:border-info-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-info-600 focus:border-info-600 focus:text-info-600 focus:outline-none focus:ring-0 active:border-info-700 active:text-info-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10 m-2"
                onClick={async () => {
                  const data = await handleLoadItems(collection);
                  setItems(data);
                }}
              >
                {collection}
              </button>
              <button onClick={() => handleRenameCollection(collection)}>
                <Image
                  src="/edit-svgrepo-com.svg"
                  alt="Edit"
                  width={20}
                  height={20}
                  className="ml-2"
                />
              </button>
              <button onClick={() => handleRemoveCollection(collection)}>
                <Image
                  src="/trash-9-16.ico"
                  alt="Delete"
                  width={20}
                  height={20}
                  className="ml-2"
                />
              </button>
            </div>
          ))
        ) : (
          <p> No collections exist, try to create one first</p>
        )}
      </div>
      <div className="grid grid-cols-3 gap-1 m-2">
        {items.map((item, index) => {
          return (
            <div key={index}>
              <Image alt="" src={item} width={500} height={500} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Collections;
