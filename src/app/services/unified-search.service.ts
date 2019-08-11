import { Injectable } from '@angular/core';
import { UnifiedSearch } from '../interfaces/unified-search';
import { GitSearchService } from './git-search.service';
import { GitCodeSearchService } from './git-code-search.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationExtras } from '@angular/router';
import { GitSearch } from '../interfaces/git-search';
import { GitCodeSearch } from '../interfaces/git-code-search';

@Injectable({
  providedIn: 'root'
})
export class UnifiedSearchService {

  constructor(private searchService: GitSearchService, private codeSearchService: GitCodeSearchService) { }

  unifiedSearch(query: string, page: number, searchQueryParams:NavigationExtras): Observable<UnifiedSearch> {
    let searchString = this.buildSearchString(query, page, searchQueryParams);

    let join = forkJoin(this.searchService.gitSearch(searchString), this.codeSearchService.codeSearch(query, page, searchQueryParams))
    .pipe(map((result: [GitSearch, GitCodeSearch]) => {
      return {
        'repositories': result[0],
        'code': result[1]
      };
    }));
    return join;
  }

  buildSearchString(query: string, page: number, params: NavigationExtras): string {
    let searchString = '?q=' + query;
  
    if (params) {
      if (params.queryParams['language'] && params.queryParams['language'] !== '') {
        searchString += '+language:' +  params.queryParams['language'];
      }
      if (params.queryParams['user'] && params.queryParams['user'] !== '') {
        searchString += '+user:' +  params.queryParams['user'];
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
    }

    if (page) {
      searchString += '&page=' + page;
    }

    return searchString;
  }
}
