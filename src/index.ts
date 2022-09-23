import { Genre } from "./lib/types.js";
import { getAllCounts } from "./services/AnimeService.js";
import { updateValues } from "./util/update-doc.js";

const SEPERATOR = ":";
const USERNAME = "yaxkin";

const data = await getAllCounts(USERNAME);

for (const genre in data) {
  console.log(`${genre}${SEPERATOR}${data[genre as Genre]}`);
}

const isProd = JSON.parse(process.argv[2]);
updateValues(data, isProd);
