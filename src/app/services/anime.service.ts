import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Genre, GenreResponse } from 'src/lib/models/types';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  constructor(private client: HttpClient) {}

  getGenres = (name = '') =>
    this.client.get<GenreResponse[]>(`${this.base()}/api/v1/anime/${name}`);

  private base = () => window.location.protocol + '//' + window.location.host;
}
