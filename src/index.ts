import { Genre } from "../lib/types.js";
import { getAllCounts } from "./anime-fetcher.js";
import { updateValues } from "./update-doc.js";

const SEPERATOR = ":";
const USERNAME = "yaxkin";

const data = await getAllCounts(USERNAME);

for (const genre in data) {
  console.log(`${genre}${SEPERATOR}${data[genre as Genre]}`);
}

try {
  const isProd = JSON.parse(process.argv[2]);
  updateValues(data, isProd);
} catch (e) {
  console.error(e);
}