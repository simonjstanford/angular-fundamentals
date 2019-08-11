import { Injectable, Inject } from '@angular/core';
import { GitSearch } from '../interfaces/git-search';
import { HttpClient } from '@angular/common/http';
import { GitUsers } from '../interfaces/git-users';
import { NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GitSearchService {
  search: Observable<GitSearch>;
  cachedValue: string;

  constructor(private http: HttpClient) { }

  gitSearch = (query: string): Observable<GitSearch> => {
    let fullString = 'https://api.github.com/search/repositories' + query
    this.search = this.http.get<GitSearch>(fullString).pipe(publishReplay(1), refCount());
    this.cachedValue = query;
    return this.search;
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
