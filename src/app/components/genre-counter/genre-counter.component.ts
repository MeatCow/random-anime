import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-genre-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './genre-counter.component.html',
})
export class GenreCounterComponent {
  @Input() count = -1;
  @Input() genre = '';
}
