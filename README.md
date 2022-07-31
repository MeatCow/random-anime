# Random Anime

Personal tool.
Used to grab genre counts from [Random-Anime](https://www.randomanime.org/), based on Anilist username.

## Example

Example usage can be seen in the index.ts file.

Usage is as easy as calling the `getAllCounts(alUsername)` or `getSingleCount(alUsername, genre)` functions and awaiting their response.

```ts
import { Genre } from "../lib/types.js";
import { getAllCounts } from "./anime-fetcher.js";
import { updateValues } from "./update-doc.js";

const SEPERATOR = ":";
const USERNAME = "yaxkin";

const data = await getAllCounts(USERNAME);

for (const genre in data) {
  console.log(`${genre}${SEPERATOR}${data[genre as Genre]}`);
}

const isProd = JSON.parse(process.argv[2]);
updateValues(data, isProd);
```

## Features

- Promise based API

- If you'd rather have an express server to feed you JSON data, you can run the fetch-server.js file instead (WIP).

- The update-doc.ts file exports functions used to update a google sheets document. Somewhat static since I don't ever expect anyone else to use this (Updates the 2nd row and expect a format to the document)
