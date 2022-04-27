const request = require('request');

const POST_URL = "https://www.randomanime.org/api/custom-list/post/";
const GET_URL = "https://www.randomanime.org/api/custom-list/get/";
const MAL_USERNAME = "yaxkin";

const GENRES = {
  1: "Action",
  2: "Adventure",
  3: "Comedy",
  4: "Drama",
  5: "Ecchi",
  6: "Fantasy",
  7: "Game",
  8: "Harem",
  9: "Historical",
  10: "Horror",
  11: "Isekai",
  12: "Magic",
  13: "Mecha",
  14: "Military",
  15: "Music",
  16: "Mystery",
  17: "Parody",
  18: "Psychological",
  19: "Romance",
  20: "School",
  21: "Sci-Fi",
  22: "Seinen",
  23: "Shoujo",
  24: "Shounen",
  25: "Slice of Life",
  26: "Sports",
  27: "Supernatural",
  28: "Yaoi",
  29: "Yuri",
};

/**
 * Id of the genre to look up, ie. 7 for "Game"
 * @param {Number} genre
 */
const getLists = (genre) => {
  return new Promise((resolve, reject) => {
    let data = {
      "listInfo": {
        "base": "al-mal",
        "includedGenres": { 0: genre },
        "excludedGenres": {},
        "alMal": "al",
        "alMalUsername": MAL_USERNAME,
        "alMalList": "",
        "alMalHideShow": "false"
      },
      "lang": "any"
    };

    request.post(
      {
        url: POST_URL,
        body: data,
        json: true
      },
      (err, res, body) => {
        if (err) {
          return reject(err);
        }
        body["genre"] = GENRES[genre];
        resolve(body);
      });
  });
};

const getCount = (listInfo) => {
  return new Promise((resolve, reject) => {
    const data = {
      "page": 1,
      "listUrl": listInfo.result.url,
      "listIds": listInfo.result.ids
    };

    request.post(
      {
        url: GET_URL,
        body: data,
        json: true
      },
      (err, res, body) => {
        if (err) {
          return reject(err);
        }
        return resolve(body);
      });
  });
};

/**
 * Performs a network fetch against the random anime list website.
 * @returns A promise that will contain an object of genres with their count of animes
 */
const getCounts = () => {
  return new Promise((resolve, reject) => {

    const genreCount = {};
    const promises = [];

    for (const id in GENRES) {
      promises.push(
        getLists(id)
          .then(getCount)
          .then((body) => {
            genreCount[GENRES[id]] = body.result.list_ids.split(",").length;
          })
          .catch((err) => {
            console.log("Something bad happened!\n", err);
          })
      );
    }

    Promise.all(promises)
      .then(() => {
        console.log(genreCount);
        resolve(genreCount);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = { getCounts };