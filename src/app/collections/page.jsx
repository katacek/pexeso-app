"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Collections = () => {
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);

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
    // TODO: check notes how to do it other way
    fetchCollections().catch(console.error);
  }, []);

  const handleSeeItems = async (collection) => {
    try {
      const fetchCollectionItems = await fetch(
        `/api/getPicturesUrls?collectionName=${collection}`
      );
      const { data } = await fetchCollectionItems.json();
      setItems(data);
    } catch (err) {
      console.log({ err });
      alert("Smt went wrong in getting pexeso pictures");
      return;
    }
  };

  console.log({ items });

  return (
    <>
      <button
        onClick={() => router.push("/admin")}
        className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2"
      >
        Go back
      </button>
      <ul className="list-disc m-2">
        {collections ? (
          [...collections].map((collection, index) => (
            <li key={index}>
              <p>Name: {collection}</p>
              <button
                onClick={() => {
                  handleSeeItems(collection);
                }}
              >
                See items
              </button>
            </li>
          ))
        ) : (
          <p> No collections exist, try to create one first</p>
        )}
      </ul>
        <div className="grid grid-cols-3 gap-1">
          {items.map((item, index) => {
              return (<div key={index}>
                <img alt="" src={item} />
              </div>);
            })}
        </div>
    </>
  );
};

export default Collections;
