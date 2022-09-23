import { Genre, GENRES } from "../lib/types.js";

export function isGenre(value: any): value is Genre {
  return Object.values(GENRES).includes(value);
}
