import { defineEventHandler } from 'h3';
import { GenreList } from '../../../../lib/models/types';

export default defineEventHandler((event) => {
  return GenreList.map((genre) => ({
    genre,
    count: Math.floor(Math.random() * 10) + 1,
  }));
});
