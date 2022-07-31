export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Game",
  "Harem",
  "Historical",
  "Horror",
  "Isekai",
  "Magic",
  "Mecha",
  "Military",
  "Music",
  "Mystery",
  "Parody",
  "Psychological",
  "Romance",
  "School",
  "Sci-Fi",
  "Seinen",
  "Shoujo",
  "Shounen",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Yaoi",
  "Yuri",
] as const;

export type Genre = typeof GENRES[number];

export type GenreCount = {
  [key in Genre]: number;
};

export interface AnilistEntry {
  id: string;
  ani_list_id: string;
  my_anime_list_id: string;
  name: string;
  english_name: string;
  description: string;
  ani_list_score: string;
  my_anime_list_score: string;
  episodes: string;
  episode_duration: string;
  release_date: string;
  tv_rating: string;
  source: string;
  trailer: string;
  rad_date: string;
  handle: string;
  genres: Genre[];
  links: object[];
  loc: number;
}

export interface ListResponse {
  status: number;
  results: AnilistEntry[];
  resultsTotal: number;
  genres: Genre[];
}

export interface URLResponse {
  status: number;
  results: { url: string };
}
