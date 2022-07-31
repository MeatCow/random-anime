import fetch from "node-fetch";
import {
  Genre,
  GenreCount,
  GENRES,
  ListResponse,
  URLResponse,
} from "../lib/types.js";

const EMPTY_COUNT = {
  Action: 0,
  Adventure: 0,
  Comedy: 0,
  Drama: 0,
  Ecchi: 0,
  Fantasy: 0,
  Game: 0,
  Harem: 0,
  Historical: 0,
  Horror: 0,
  Isekai: 0,
  Magic: 0,
  Mecha: 0,
  Military: 0,
  Music: 0,
  Mystery: 0,
  Parody: 0,
  Psychological: 0,
  Romance: 0,
  School: 0,
  "Sci-Fi": 0,
  Seinen: 0,
  Shoujo: 0,
  Shounen: 0,
  "Slice of Life": 0,
  Sports: 0,
  Supernatural: 0,
  Yaoi: 0,
  Yuri: 0,
};

const POST_URL = "https://www.randomanime.org/api/list/custom";

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
  AL_USERNAME: string,
  genre: Genre
): Promise<GenreCount> => {
  return new Promise((resolve, reject) => {
    const genreCount: GenreCount = { ...EMPTY_COUNT };

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
    const genreCount: GenreCount = { ...EMPTY_COUNT };
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
        ) as GenreCount;
        resolve(sortedGenreCount);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export { getSingleCount, getAllCounts };
