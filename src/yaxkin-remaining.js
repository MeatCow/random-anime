import * as fetcher from "./anime-fetcher.js";

const SEPERATOR = ":";
const USERNAME = "yaxkin";

fetcher.getAllCounts(USERNAME).then((data) => {
  for (const anime in data) {
    console.log(`${anime}${SEPERATOR}${data[anime]}`);
  }
});
