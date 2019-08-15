import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GitCodeSearch } from '../interfaces/git-code-search';

@Component({
  selector: 'app-code-display',
  templateUrl: './code-display.component.html',
  styleUrls: ['./code-display.component.css']
})
export class CodeDisplayComponent implements OnInit {
  @Input() searchResults: GitCodeSearch;
  @Input() favorites: Array<number>;
  @Output() updateFavorites = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  addFavorite(item: { repository: { id: string; }; }) {
    return this.updateFavorites.emit(item.repository.id);
  }

  checkFavorite(item: { repository: { id: number; }; }) {
    return this.favorites.indexOf(item.repository.id) > -1;
  }
}
