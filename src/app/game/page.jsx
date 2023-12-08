"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";

const Game = () => {
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [collectionToPlay, setCollectionToPlay] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);

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
    fetchCollections();
  }, []);

  // TODO move to components
  function PlayPexesoModal() {
    return (
      <Dialog
        open={isModalOpen}
        onClose={() => setModalOpen(!isModalOpen)}
        className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
      >
        <Dialog.Panel className="bg-blue-500 text-white border rounded-md w-full max-w-md p-4">
          <Dialog.Title className="text-xl font-bold mb-2">
            Enter number of players
          </Dialog.Title>
          <div>
            <input
              type="text"
              placeholder="2"
              onChange={(e) => {
                setNumberOfPlayers(e.target.value);
              }}
              className="w-full p-2 rounded-md mb-4 bg-blue-100 text-blue-800 border border-blue-300"
            ></input>
          </div>
          <div>
            <button
              onClick={() => {
                startGame();
                setModalOpen(!isModalOpen);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md mr-2 hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
              Let&apos;s play!
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    );
  }

  const handlePlayGame = async (collection) => {
    setCollectionToPlay(collection);
    // ask for number of players
    setModalOpen(true);
  };

  const startGame = () => {
    const gameParams = {
      collection: collectionToPlay,
      playersCount: numberOfPlayers || 2,
    };
    const queryString = new URLSearchParams(gameParams).toString();
    router.push(`/game/play?${queryString}`);
  };

  return (
    <>
      <button
        onClick={() => router.push("/")}
        className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2"
      >
        Go back
      </button>
      <p className="m-2">Click on the collections below to start game</p>
      <div>
        {collections ? (
          [...collections].map((collection, index) => (
            <button
              key={index}
              className="inline-block rounded border-2 border-info px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-info transition duration-150 ease-in-out hover:border-info-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-info-600 focus:border-info-600 focus:text-info-600 focus:outline-none focus:ring-0 active:border-info-700 active:text-info-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10 m-2"
              onClick={() => handlePlayGame(collection)}
            >
              {collection}
            </button>
          ))
        ) : (
          <p> No collections exist, ask admin to create one first</p>
        )}
      </div>
      <PlayPexesoModal isModalOpen={isModalOpen} />
    </>
  );
};

export default Game;
