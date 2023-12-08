"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { handleLoadItems } from "../helpers";

const Collections = () => {
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);

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

  return (
    <>
      <button
        onClick={() => router.push("/admin")}
        className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2"
      >
        Go back
      </button>
      <p className="m-2">Click on the collections below to see the items</p>
      <div>
        {collections ? (
          [...collections].map((collection, index) => (
            <button
              key={index}
              className="inline-block rounded border-2 border-info px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-info transition duration-150 ease-in-out hover:border-info-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-info-600 focus:border-info-600 focus:text-info-600 focus:outline-none focus:ring-0 active:border-info-700 active:text-info-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10 m-2"
              onClick={async () => {
                const data = await handleLoadItems(collection);
                setItems(data);
              }}
            >
              {collection}
            </button>
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
