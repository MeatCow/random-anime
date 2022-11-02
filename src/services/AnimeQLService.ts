import AniList, { AnimeUserGenres } from "anilist-node";
const anilist = new AniList();

export const getAllCounts = async (
  username: string
): Promise<AnimeUserGenres[]> => {
  const genres = (await anilist.user.stats(username)).anime.genres;

  console.log(genres);

  return genres;
};

getAllCounts("Yaxkin");
