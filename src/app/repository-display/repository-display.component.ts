import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GitSearch } from '../interfaces/git-search';

@Component({
  selector: 'app-repository-display',
  templateUrl: './repository-display.component.html',
  styleUrls: ['./repository-display.component.css']
})
export class RepositoryDisplayComponent implements OnInit {
  @Input() searchResults: GitSearch;
  @Input() favorites: Array<number>;
  @Output() updateFavorites = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  addFavorite(item: { id: string; }) {
    return this.updateFavorites.emit(item.id);
  }

  checkFavorite(item: { id: number; }) {
    return this.favorites.indexOf(item.id) > -1;
  }
}
