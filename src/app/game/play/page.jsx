"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { handleLoadItems, shuffle } from "../../helpers";
import { Dialog } from "@headlessui/react";

const Play = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [enhancedCardsArray, setEnhancedCardsArray] = useState([]);
  const [players, setPlayers] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // TODO: use react query to have info about loading state
  useEffect(() => {
    const fetchCollectionItems = async () => {
      try {
        // CARDS
        const collection = searchParams.get("collection");
        const collectionCards = await handleLoadItems(collection);
        // duplicate each items to get pairs for the game
        const duplicatedCards = collectionCards?.flatMap((i) => [i, i]);
        const shuffledCards = shuffle(duplicatedCards);
        const enhancedCardsArrayToBe = [];
        shuffledCards?.map((card, index) => {
          const enhancedItem = {
            isVisible: false,
            isPicked: false,
            url: card,
            position: index,
          };
          enhancedCardsArrayToBe.push(enhancedItem);
        });
        setEnhancedCardsArray(enhancedCardsArrayToBe);

        // PLAYERS
        const playersCount = parseInt(searchParams.get("playersCount"));
        const playersToBe = [];
        for (let i = 0; i < playersCount; i++) {
          const player = {
            score: 0,
            isPlaying: false,
            turnedCardsNumber: 0,
            position: i,
          };
          playersToBe.push(player);
        }
        playersToBe[0].isPlaying = true;
        setPlayers(playersToBe);
      } catch (err) {
        console.log({ err });
        alert("Smt went wrong in fetching collection items");
      }
    };
    // TODO: fetch only for fetch and the rest of the fcn out of it
    fetchCollectionItems();
  }, [searchParams]);

  const handleCardClick = (position) => {
    // CARD
    // Make a copy of the card state
    const copy = [...enhancedCardsArray];

    // Find the index of the card with that index
    const index = copy.findIndex((card) => {
      return card.position === position;
    });

    // If that card exists update the state
    if (index >= 0) {
      copy[index].isVisible = !copy[index].isVisible;
      copy[index].isPicked = !copy[index].isPicked;
      setEnhancedCardsArray(copy);
    }

    const isGameOver = !copy.some((card) => card.isVisible === false);
    setGameOver(isGameOver);

    // PLAYER
    // get player
    const currentPlayer = players.find((player) => player.isPlaying);
    // increase turned cards
    currentPlayer.turnedCardsNumber++;
    // turn another cards
    if (currentPlayer.turnedCardsNumber === 1) return;
    // compare visible cards
    if (currentPlayer.turnedCardsNumber === 2) {
      const pickedCards = enhancedCardsArray.filter(
        (card) => card.isPicked === true
      );
      // if url is the same, add point, let player play
      if (pickedCards[0].url === pickedCards[1].url) {
        const copyPlayers = [...players];
        copyPlayers[currentPlayer.position].score++;
        // reset for counting
        copyPlayers[currentPlayer.position].turnedCardsNumber = 0;
        setPlayers(copyPlayers);
        // let the cards be visible but not picked
        const copyCards = [...enhancedCardsArray];
        copyCards[pickedCards[0].position].isVisible = true;
        copyCards[pickedCards[0].position].isPicked = false;
        copyCards[pickedCards[1].position].isVisible = true;
        copyCards[pickedCards[1].position].isPicked = false;
        setEnhancedCardsArray(copy);
        // if not, set that he is not playing, other player is playing
      } else {
        // give some time to players to see the cards
        // TODO maybe without timeout and let people click? not sure what is better UX
        const copyPlayers = [...players];
        const nextPlayerIndex =
          currentPlayer.position + 1 < copyPlayers.length
            ? currentPlayer.position + 1
            : 0;
        setTimeout(() => {
          copyPlayers[currentPlayer.position].turnedCardsNumber = 0;
          copyPlayers[currentPlayer.position].isPlaying = false;
          copyPlayers[nextPlayerIndex].isPlaying = true;
          setPlayers(copyPlayers);
        }, 3000);
        // set the cards not visible
        const copyCards = [...enhancedCardsArray];
        setTimeout(() => {
          copyCards[pickedCards[0].position].isVisible = false;
          copyCards[pickedCards[0].position].isPicked = false;
          copyCards[pickedCards[1].position].isVisible = false;
          copyCards[pickedCards[1].position].isPicked = false;
          setEnhancedCardsArray(copy);
        }, 3000);
      }
    }
  };

  // TODO move to components
  function WinnerModal() {
    // const scores = players.map(player => {
    //     return player.score;
    //   });
    //   const max = Math.max(...scores);
    //   // TODO finish winners modal
    //   const winnerPlayers = players.filter(player => player.score === max);
    return (
      <Dialog
        open={gameOver}
        onClose={() => setModalOpen(!gameOver)}
        className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
      >
        <Dialog.Panel className="bg-blue-500 text-white border rounded-md w-full max-w-md p-4">
          <Dialog.Title className="text-xl font-bold mb-2">
            Congratulations! 🎉
          </Dialog.Title>
          <Dialog.Description>
            And the winner is ... the one with the highest score :-P
          </Dialog.Description>
        </Dialog.Panel>
      </Dialog>
    );
  }

  return (
    <>
      <button
        onClick={() => router.push("/game")}
        className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2"
      >
        Go back
      </button>
      <WinnerModal isModalOpen={gameOver} />
      <div className="grid grid-cols-3 gap-4">
        <div className="grid grid-cols-3 col-span-2 gap-1 m-2 auto-rows-fr auto-cols-fr">
          {enhancedCardsArray ? (
            enhancedCardsArray.map((card, index) => {
              return card.isVisible ? (
                <div key={index}>
                  <Image
                    alt=""
                    src={card.url}
                    className="rounded-lg"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }} // optional
                    onClick={() => handleCardClick(index)}
                  />
                </div>
              ) : (
                <div
                  key={index}
                  className="h-48 bg-teal-500 rounded-lg"
                  onClick={() => handleCardClick(index)}
                />
              );
            })
          ) : (
            <p>Failed to load pexeso 😔 </p>
          )}
        </div>
        <div className="m-2">
          {players &&
            players.map((player, index) => {
              return player.isPlaying ? (
                <p key={index} className="text-sky-400/100">
                  Player number {player.position + 1}: score {player.score}
                </p>
              ) : (
                <p key={index} className="text-sky-400/50">
                  Player number {player.position + 1}: score {player.score}
                </p>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Play;
