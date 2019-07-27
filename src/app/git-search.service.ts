import { Injectable } from '@angular/core';
import { GitSearch } from './git-search'
import { HttpClient } from '@angular/common/http'
import { GitUsers } from './git-users';

@Injectable({
  providedIn: 'root'
})
export class GitSearchService {
  cachedSearchValues: Array<{
    [query: string]: GitSearch
  }> =[];

  cachedUserValues: Array<{
    [query: string]: GitUsers
  }> =[];

  constructor(private http: HttpClient) { }

  gitSearch = (query: string) : Promise<GitSearch> => {
    let promise = new Promise<GitSearch>((resolve, reject) => {
      if (this.cachedSearchValues[query]) {
        resolve(this.cachedSearchValues[query]);
      }
      else {
        this.http.get('https://api.github.com/search/repositories?q=' + query)
        .toPromise()
        .then((response) => {
          resolve(response as GitSearch);
        }, (error) => {
          reject(error);
        });
      }   
    })
    return promise
  }

  gitSearchUsers = (query: string) : Promise<GitUsers> => {
    let promise = new Promise<GitUsers>((resolve, reject) => {     
      if (this.cachedUserValues[query]) {
        resolve(this.cachedUserValues[query])
      }
      else {
        this.http.get('https://api.github.com/search/users?q=' + query)
        .toPromise()
        .then((repsonse) => {
          resolve(repsonse as GitUsers);
        }, (error) => {
          reject(error);
        });
      }
    });
    return promise;
  }
}
