import { defineEventHandler, sendError, createError, H3Event } from 'h3';
import { Genre, GenreList } from '../../../../lib/models/types';
import { createListRequest } from '../../../../lib/helpers/fetch';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  const username = event.context.params?.['name'];

  if (!username) return badResponse(event);

  return await Promise.all(
    GenreList.map(async (genre) => ({
      genre,
      count: await getSingleCount(genre, username),
    }))
  );
});

const getSingleCount = (genre: Genre, username: string) =>
  axios.request(createListRequest(genre, username));

const badResponse = (e: H3Event) =>
  sendError(
    e,
    createError({ statusCode: 400, statusMessage: 'Invalid name' }),
    false
  );
