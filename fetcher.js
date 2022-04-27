const request = require('request');

const POST_URL = "https://www.randomanime.org/api/custom-list/post/";
const GET_URL = "https://www.randomanime.org/api/custom-list/get/";
const MAL_USERNAME = "yaxkin";

const GENRES = {
  "Action": 1,
  "Adventure": 2,
  "Comedy": 3,
  "Drama": 4,
  "Ecchi": 5,
  "Fantasy": 6,
  "Game": 7,
  "Harem": 8,
  "Historical": 9,
  "Horror": 10,
  "Isekai": 11,
  "Magic": 12,
  "Mecha": 13,
  "Military": 14,
  "Music": 15,
  "Mystery": 16,
  "Parody": 17,
  "Psychological": 18,
  "Romance": 19,
  "School": 20,
  "Sci-Fi": 21,
  "Seinen": 22,
  "Shoujo": 23,
  "Shounen": 24,
  "Slice of Life": 25,
  "Sports": 26,
  "Supernatural": 27,
  "Yaoi": 28,
  "Yuri": 29,
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

const getSingleCount = (genre) => {

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
        resolve(genreCount);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = { getSingleCount, getAllCounts };