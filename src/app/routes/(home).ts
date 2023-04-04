import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GenreCounterComponent } from '../components/genre-counter/genre-counter.component';
import { AnimeService } from '../services/anime.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './index.html',
  imports: [CommonModule, GenreCounterComponent],
})
export default class HomeComponent {
  animes$ = this.animeService.getGenres('yaxkin');

  constructor(private animeService: AnimeService) {}
}
