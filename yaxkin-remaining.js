const { getSingleCount, getAllCounts, GENRES } = require('./fetcher');
const express = require('express');

const PORT = 8080;
const app = express();

app.get("/genres/:genre", (req, res) => {
  const genre = req.params.genre.toLowerCase();

  if (!Object.keys(GENRES).includes(genre)) {
    return res.status(404).json("No such genre");
  }

  getSingleCount(genre)
    .then(count => {
      res.status(200).send(count);
    })
    .catch(err => {
      console.log("something went wrong");
      res.status(500).json("Sorry, something went wrong on our end.");
    });
});

app.get("/genres", (req, res) => {
  getAllCounts()
    .then(count => {
      res.status(200).send(count);
    })
    .catch(err => {
      console.log("something went wrong");
      res.status(500).json("Sorry, something went wrong on our end.");
    });
});

app.listen(PORT, () => {
  console.log(`Anime service up and running on ${PORT}`);
});