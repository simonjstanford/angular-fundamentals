import { Injectable } from '@angular/core';
import { GitSearch } from './git-search';
import { HttpClient } from '@angular/common/http';
import { GitUsers } from './git-users';
import { NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';

@Injectable({
  providedIn: 'root'
})
export class GitSearchService {
  search: Observable<GitSearch>;
  cachedValue: string;

  constructor(private http: HttpClient) { }

  gitSearch = (query: string, page: number, searchQueryParams:NavigationExtras): Observable<GitSearch> => {
    let searchString: string = this.buildSearchString(query, page, searchQueryParams);
    let fullString = 'https://api.github.com/search/repositories' + searchString
    this.search = this.http.get<GitSearch>(fullString).publishReplay(1).refCount();
    this.cachedValue = query;
    return this.search;
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
  
  
  gitSearchUsers = (query: string): Promise<GitUsers> => {
    const promise = new Promise<GitUsers>((resolve, reject) => {
      this.http.get('https://api.github.com/search/users?q=' + query)
      .toPromise()
      .then((repsonse) => {
        resolve(repsonse as GitUsers);
      }, (error) => {
        reject(error);
      });
    });
    return promise;
  }
}
