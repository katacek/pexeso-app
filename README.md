Pexeso app in Next.js (with App Router + Tailwind to try it), using AWS S3 and MongoDB along the way.
Vercel [here](https://pexeso-app.vercel.app/).

// TODO: errors handling (img to large, .., no name entered), edge case testing (1player), todos, visual 

### Admin page

- [x] upload images to s3 + access images from s3
- [ ] crop images during uplaod
- [x] upload images to MongoDB
- [x] uplaod images under defined collection for various game
- [x] retrieve game images from MongoDb
- [x] delete game collection in MongoDB
- [x] change game collection name

### Game

- [x] create pexeso grid layout with hidden / visible images onClick
- [x] players part: set number of players, count points (if correct, same user play again)
- [x] play itself: player choose game image set, number of players, their names, number of images to play with -> after game, show result
