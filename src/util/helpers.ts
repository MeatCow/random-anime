import { Genre, GENRES } from "../lib/types";

export function isGenre(value: string): value is Genre {
  return Object.keys(GENRES).includes(value);
}
