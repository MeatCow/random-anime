import fetch from 'node-fetch';
import {
  Genre,
  GenreCount,
  GENRES,
  HttpMethod,
  ListResponse,
  URLResponse,
} from '../lib/types.js';
import { EMPTY_COUNT } from '../lib/EMPTY_COUNT';

const POST_URL = 'https://www.randomanime.org/api/list/custom';
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(() => resolve(), ms));

/**
 * Return the randomanime.org url for a randomized list.
 * To be used as listId for the getCount function
 * @param genre Anime genre
 * @param AL_USERNAME Anilist username for which we generate urls
 * @returns A Promise to the url value
 */
const getLists = (genre: Genre, AL_USERNAME: string): Promise<string> => {
  return apiFetch(
    POST_URL,
    'POST',
    `------WebKitFormBoundaryFfjOcu3D9Et37yRL\r\nContent-Disposition: form-data; name=\"base\"\r\n\r\nexternal\r\n------WebKitFormBoundaryFfjOcu3D9Et37yRL\r\nContent-Disposition: form-data; name=\"included[]\"\r\n\r\n${genre}\r\n------WebKitFormBoundaryFfjOcu3D9Et37yRL\r\nContent-Disposition: form-data; name=\"external[site]\"\r\n\r\nAniList\r\n------WebKitFormBoundaryFfjOcu3D9Et37yRL\r\nContent-Disposition: form-data; name=\"external[list]\"\r\n\r\n\r\n------WebKitFormBoundaryFfjOcu3D9Et37yRL\r\nContent-Disposition: form-data; name=\"external[onlyMyAnime]\"\r\n\r\nfalse\r\n------WebKitFormBoundaryFfjOcu3D9Et37yRL\r\nContent-Disposition: form-data; name=\"external[username]\"\r\n\r\n${AL_USERNAME}\r\n------WebKitFormBoundaryFfjOcu3D9Et37yRL--\r\n`
  )
    .then((data) => data.json() as Promise<URLResponse>)
    .then((res: URLResponse) => {
      return res.results.url;
    });
};

const getCount = async (listId: string): Promise<ListResponse> => {
  const response = await apiFetch(
    `https://www.randomanime.org/api/list/custom?id=${listId}&page=1`,
    'GET',
    null
  );
  return response.json() as Promise<ListResponse>;
};

/**
 * Performs a network fetch for a single genre
 * @param {String} genre lowercase string, like isekai
 * @returns an object like { isekai: 349 }
 */
export const getSingleCount = async (
  genre: Genre,
  AL_USERNAME: string
): Promise<GenreCount> => {
  const genreCount: GenreCount = { ...EMPTY_COUNT };

  await getLists(genre, AL_USERNAME)
    .then(getCount)
    .then((body: ListResponse) => {
      genreCount[genre] = body.resultsTotal;
    });

  return genreCount;
};

/**
 * Performs a network fetch against the random anime list website.
 * @returns A promise that will contain an object of genres with their count of animes
 */
export const getAllCounts = async (
  AL_USERNAME: string
): Promise<GenreCount> => {
  const genreCount = { ...EMPTY_COUNT };
  const requests: Promise<GenreCount>[] = [];

  for (const genre of GENRES) {
    requests.push(getSingleCount(genre, AL_USERNAME));
  }

  const results = await Promise.allSettled(requests).then(() => {
    return Object.fromEntries(Object.entries(genreCount).sort()) as GenreCount;
  });

  return results;
};

const apiFetch = (
  url: string,
  method: HttpMethod,
  body: string | null,
  retries = 3,
  retryDelay = 1000
): Promise<ListResponse> => {
  return new Promise((resolve, reject) => {
    const wrapper = (n: number) => {
      fetch(url, {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language':
            'en-US,en;q=0.9,fr;q=0.8,zh-TW;q=0.7,zh-CN;q=0.6,zh;q=0.5',
          authorization:
            'e95975fe462564212f9e3a269790564599f31bf4d85e7c1e8075cb46c14321f0',
          'sec-ch-ua':
            '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          Referer:
            'https://www.randomanime.org/custom-list/?l=987bc2&view=single&lang=any',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body,
        method,
      })
        .then((res) => resolve(res))
        .catch(async (err) => {
          if (n < retries) {
            console.error(`Retrying...${n}/${retries}`);
            await delay(retryDelay);
            wrapper(n + 1);
          } else {
            reject(err);
          }
        });
    };

    wrapper(1);
  });
};
