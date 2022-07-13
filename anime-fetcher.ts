import fetch from "node-fetch";

const POST_URL = "https://www.randomanime.org/api/list/custom";

const GENRES = [
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

type Genre = typeof GENRES[number];

interface AnilistEntry {
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

interface ListResponse {
  status: number;
  results: AnilistEntry[];
  resultsTotal: number;
  genres: Genre[];
}

interface URLResponse {
  status: number;
  results: { url: string };
}

type GenreCount = {
  [key in Genre]?: number;
};

/**
 * Return the randomanime.org url for a randomized list.
 * To be used as listId for the getCount function
 * @param genre Anime genre
 * @param AL_USERNAME Anilist username for which we generate urls
 * @returns A Promise to the url value
 */
const getLists = (genre: Genre, AL_USERNAME: string): Promise<string> => {
  return fetch(POST_URL, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language":
        "en-US,en;q=0.9,fr;q=0.8,zh-TW;q=0.7,zh-CN;q=0.6,zh;q=0.5",
      authorization:
        "e95975fe462564212f9e3a269790564599f31bf4d85e7c1e8075cb46c14321f0",
      "content-type":
        "multipart/form-data; boundary=----WebKitFormBoundaryFfjOcu3D9Et37yRL",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      Referer: "https://www.randomanime.org/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `------WebKitFormBoundaryFfjOcu3D9Et37yRL\r\nContent-Disposition: form-data; name=\"base\"\r\n\r\nexternal\r\n------WebKitFormBoundaryFfjOcu3D9Et37yRL\r\nContent-Disposition: form-data; name=\"included[]\"\r\n\r\n${genre}\r\n------WebKitFormBoundaryFfjOcu3D9Et37yRL\r\nContent-Disposition: form-data; name=\"external[site]\"\r\n\r\nAniList\r\n------WebKitFormBoundaryFfjOcu3D9Et37yRL\r\nContent-Disposition: form-data; name=\"external[list]\"\r\n\r\n\r\n------WebKitFormBoundaryFfjOcu3D9Et37yRL\r\nContent-Disposition: form-data; name=\"external[onlyMyAnime]\"\r\n\r\nfalse\r\n------WebKitFormBoundaryFfjOcu3D9Et37yRL\r\nContent-Disposition: form-data; name=\"external[username]\"\r\n\r\n${AL_USERNAME}\r\n------WebKitFormBoundaryFfjOcu3D9Et37yRL--\r\n`,
    method: "POST",
  })
    .then((data) => data.json() as Promise<URLResponse>)
    .then((res: URLResponse) => {
      return res.results.url;
    });
};

const getCount = (listId: string): Promise<ListResponse> => {
  return fetch(
    `https://www.randomanime.org/api/list/custom?id=${listId}&page=1`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language":
          "en-US,en;q=0.9,fr;q=0.8,zh-TW;q=0.7,zh-CN;q=0.6,zh;q=0.5",
        authorization:
          "e95975fe462564212f9e3a269790564599f31bf4d85e7c1e8075cb46c14321f0",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        Referer:
          "https://www.randomanime.org/custom-list/?l=987bc2&view=single&lang=any",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  ).then((data) => data.json() as Promise<ListResponse>);
};

/**
 * Performs a network fetch for a single genre
 * @param {String} genre lowercase string, like isekai
 * @returns an object like { isekai: 349 }
 */
const getSingleCount = (
  genre: Genre,
  AL_USERNAME: string
): Promise<GenreCount> => {
  return new Promise((resolve, reject) => {
    const genreCount: GenreCount = {};

    getLists(genre, AL_USERNAME)
      .then(getCount)
      .then((body: ListResponse) => {
        genreCount[genre] = body.resultsTotal;
        resolve(genreCount);
      })
      .catch((err) => {
        console.error("Something bad happened!\n", err);
        reject(err);
      });
  });
};

/**
 * Performs a network fetch against the random anime list website.
 * @returns A promise that will contain an object of genres with their count of animes
 */
const getAllCounts = (AL_USERNAME: string): Promise<GenreCount> => {
  return new Promise((resolve, reject) => {
    const genreCount: GenreCount = {};
    const promises: Promise<void>[] = [];

    for (const genre of GENRES) {
      promises.push(
        getLists(genre, AL_USERNAME)
          .then(getCount)
          .then((body) => {
            genreCount[genre] = body.resultsTotal;
          })
          .catch((err) => {
            console.error("Something bad happened!\n", err);
          })
      );
    }

    Promise.all(promises)
      .then(() => {
        const sortedGenreCount: GenreCount = Object.fromEntries(
          Object.entries(genreCount).sort()
        );
        resolve(sortedGenreCount);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export { getSingleCount, getAllCounts, GENRES, Genre };
