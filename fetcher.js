const request = require('request');

const POST_URL = "https://www.randomanime.org/api/custom-list/post/";
const GET_URL = "https://www.randomanime.org/api/custom-list/get/";
const MAL_USERNAME = "yaxkin";

const GENRES = {
  "action": 1,
  "adventure": 2,
  "comedy": 3,
  "drama": 4,
  "ecchi": 5,
  "fantasy": 6,
  "game": 7,
  "harem": 8,
  "historical": 9,
  "horror": 10,
  "isekai": 11,
  "magic": 12,
  "mecha": 13,
  "military": 14,
  "music": 15,
  "mystery": 16,
  "parody": 17,
  "psychological": 18,
  "romance": 19,
  "school": 20,
  "sci-Fi": 21,
  "seinen": 22,
  "shoujo": 23,
  "shounen": 24,
  "slice of Life": 25,
  "sports": 26,
  "supernatural": 27,
  "yaoi": 28,
  "yuri": 29,
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
        "includedGenres": { 0: GENRES[genre] },
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
 * Performs a network fetch for a single genre
 * @param {String} genre lowercase string, like isekai
 * @returns an object like { isekai: 349 }
 */
const getSingleCount = (genre) => {
  return new Promise((resolve, reject) => {
    const genreCount = {};

    getLists(genre)
      .then(getCount)
      .then((body) => {
        genreCount[genre] = body.result.list_ids.split(",").length;
        resolve(genreCount);
      })
      .catch((err) => {
        console.log("Something bad happened!\n", err);
        reject(err);
      });
  });
};

/**
 * Performs a network fetch against the random anime list website.
 * @returns A promise that will contain an object of genres with their count of animes
 */
const getAllCounts = () => {
  return new Promise((resolve, reject) => {

    const genreCount = {};
    const promises = [];

    for (const genre in GENRES) {
      promises.push(
        getLists(genre)
          .then(getCount)
          .then((body) => {
            genreCount[genre] = body.result.list_ids.split(",").length;
          })
          .catch((err) => {
            console.log("Something bad happened!\n", err);
          })
      );
    }

    Promise.all(promises)
      .then(() => {
        console.log(genreCount);
        resolve(Object.fromEntries(Object.entries(genreCount).sort()));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = { getSingleCount, getAllCounts, GENRES };