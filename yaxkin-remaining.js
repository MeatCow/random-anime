import * as fetcher from './anime-fetcher.js'

fetcher.getAllCounts("yaxkin")
  .then(data => {
    for (const anime in data) {
      console.log(`${anime}:${data[anime]}`);
    }
  });