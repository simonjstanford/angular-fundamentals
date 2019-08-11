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

  codeSearch(query: string, page: number, searchQueryParams:NavigationExtras): Observable<GitCodeSearch> {
    if (!this.search) {
      let searchString = this.buildSearchString(query, page, searchQueryParams);
      let fullString = 'https://api.github.com/search/code' + searchString
      this.search = this.http.get<GitCodeSearch>(fullString).pipe(publishReplay(1), refCount());
      this.cachedValue = query;
    }
    else if (this.cachedValue !== query) {
      this.search = null;
      this.codeSearch(query, page, searchQueryParams);
    }
    return this.search;
  }

  //searching source code can only be performed on a single user, repository or organisation without authentication
  //so if no user has been defined then we're using user 'angular'
  buildSearchString(query: string, page: number, params: NavigationExtras): string {
    let searchString = '?q=' + query;
  
    if (params) {
      if (params.queryParams['language'] && params.queryParams['language'] !== '') {
        searchString += '+language:' +  params.queryParams['language'];
      }
      if (params.queryParams['user'] && params.queryParams['user'] !== '') {
        searchString += '+user:' +  params.queryParams['user'];
      } else {
        searchString += '+user:angular';
      }
      if (params.queryParams['size'] && params.queryParams['size'] !== '') {
        searchString += '+size:' +  params.queryParams['size'];
      }
      if (params.queryParams['stars'] && params.queryParams['stars'] !== '') {
        searchString += '+stars:' +  params.queryParams['stars'];
      }
      if (params.queryParams['topic'] && params.queryParams['topic'] !== '') {
        searchString += '+topic:' +  params.queryParams['topic'];
      }   
    } else {
      searchString += '+user:angular';
    }

    if (page) {
      searchString += '&page=' + page;
    }

    return searchString;
  }
}
