# Random Anime

Personal tool used to grab anime genre counts from random-anime.org based on Anilist username.

## Example

An example implementation/usage can be seen in the yaxkin-remaining.js file.

Usage is as easy as calling the `getAllCounts(alUsername)` or `getCounts(alUsername)` functions and chaining promises.

```js
import * as fetcher from './anime-fetcher.js'

fetcher.getAllCounts("yaxkin")
  .then(data => {
    for (const genre in data) {
      console.log(`${genre}:${data[genre]}`);
    }
  });
```

## Features

- Promise based API

- If you'd rather have an express server to feed you JSON data, you can run the fetch-server.js file instead.

- The update-doc.js is a WIP for updating a google spreadsheet with the data received from either of these sources.