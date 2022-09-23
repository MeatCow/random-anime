import { getSingleCount, getAllCounts } from "./services/AnimeService";
import { GENRES } from "./lib/types";
import express, { Request, Response } from "express";
import { isGenre } from "./util/helpers";

const PORT = 8080;
const AL_USERNAME = "yaxkin";
const app = express();

app.get("/genres/:genre", async (req: Request, res: Response) => {
  const genre = req.params.genre.toLowerCase();

  if (!isGenre(genre)) {
    return res.status(404).send("No such genre");
  }

  try {
    const count = await getSingleCount(genre, AL_USERNAME);
    return res.status(200).send(count);
  } catch (e) {
    return res.status(500).send("Sorry, something went wrong on our end.");
  }
});

app.get("/genres", async (req: Request, res: Response) => {
  try {
    const counts = await getAllCounts(AL_USERNAME);
    res.status(200).send(counts);
  } catch (e) {
    res.status(500).send("Sorry, something went wrong on our end.");
  }
});

app.all("*", (req: Request, res: Response) =>
  res.status(404).json({
    message: "You seem lost. You can only perform gets on the following genres",
    GENRES,
  })
);

app.listen(PORT);
