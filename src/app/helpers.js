export const handleLoadItems = async (collection) => {
  try {
    const fetchCollectionItems = await fetch(
      `/api/getPicturesUrls?collectionName=${collection}`
    );
    const { data } = await fetchCollectionItems.json();
    return data;
  } catch (err) {
    console.log({ err });
    alert("Smt went wrong in getting pexeso pictures");
    return;
  }
};

export function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
