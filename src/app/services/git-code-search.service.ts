import { Injectable } from '@angular/core';
import { GitCodeSearch } from '../interfaces/git-code-search';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators'
import { NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GitCodeSearchService {
  cachedValue: string;
  search: Observable<GitCodeSearch>

  constructor(private http: HttpClient) { }

  //searching source code can only be performed on a single user, repository or organisation without authentication
  //so we're only conducting a code search if a user has been defined
  codeSearch(query: string): Observable<GitCodeSearch> {
    if (query.indexOf('user') > -1) {
      if (!this.search) {
        let fullString = 'https://api.github.com/search/code' + query
        this.search = this.http.get<GitCodeSearch>(fullString).pipe(publishReplay(1), refCount());
        this.cachedValue = query;
      }
      else if (this.cachedValue !== query) {
        this.search = null;
        this.codeSearch(query);
      }
    }
    else {
      this.search = new Observable<GitCodeSearch>();
    }

    return this.search;
  }
}
