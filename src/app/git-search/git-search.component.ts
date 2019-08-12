import { Component, OnInit } from '@angular/core';
import { GitSearchService } from '../services/git-search.service';
import { GitSearch } from '../interfaces/git-search';
import { GitUsers } from '../interfaces/git-users';
import { ActivatedRoute, ParamMap, Router, NavigationExtras, Params } from '@angular/router';
import { AdvancedSearchModel } from '../models/advanced-search-model'
import { UnifiedSearchService } from '../services/unified-search.service';
import { UnifiedSearch } from '../interfaces/unified-search';

@Component({
  selector: 'app-git-search',
  templateUrl: './git-search.component.html',
  styleUrls: ['./git-search.component.css']
})
export class GitSearchComponent implements OnInit {
  searchResults: GitSearch;
  searchQuery: string;
  userSearchResults: GitUsers;
  title: string;
  displayQuery: string;
  searchPage: number;
  searchQueryParams:NavigationExtras;

  constructor(private unifiedSearchService: UnifiedSearchService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  model = new AdvancedSearchModel('','','',null,null,'');
  modelKeys = Object.keys(this.model);

  ngOnInit() {
    this.route.data.subscribe((result) => {
      this.title = result.title;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.searchQuery = params.get('query');
      this.displayQuery = this.searchQuery;
      this.model.q = this.searchQuery;
      this.searchPage = parseInt(params.get('page'), 10);
      this.gitSearch();
    });

    //this is added so we can search for the same info twice
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.searchQueryParams = {
         queryParams: 
         { 
           "language": params.get('language'),
           "user": params.get('user'),
           "size": params.get('size'),
           "stars": params.get('stars'),
           "topic": params.get('topic'),
        }
      };
      this.gitSearch();
    });
  }

  private gitSearch() {
    //clear the previous search results
    this.searchResults = null;

    //carry out the search
    this.unifiedSearchService.unifiedSearch(this.searchQuery, this.searchPage, this.searchQueryParams).subscribe((response: UnifiedSearch) => {
      this.searchResults = response.repositories;
      console.log(response.code);
    }, (error) => {
      alert('Error: ' + error.statusText);
    });
  }

  public newQuery() {
    this.searchPage = 1;
    this.searchQuery = '';

    if (this.model.q) {
      this.searchQuery = this.model.q;
    }

    this.createSearchQueryParams();
    this.sendQuery();
  }

  public nextPage() {
    this.searchPage++;
    this.sendQuery();
  }

  public previousPage() {
    this.searchPage--;
    this.sendQuery();
  }

  private sendQuery() {
    this.router.navigate(['/search/' + this.searchQuery + '/' + this.searchPage], this.searchQueryParams );
  }

  private createSearchQueryParams() {
    this.searchQueryParams = {
      queryParams: {}
    };

    if (this.model.language && this.model.language !== '') {
      this.searchQueryParams.queryParams['language'] = this.model.language;
    }
    if (this.model.user && this.model.user !== '') {
      this.searchQueryParams.queryParams['user'] = this.model.user;
    }
    if (this.model.size) {
      this.searchQueryParams.queryParams['size'] = this.model.size;
    }
    if (this.model.stars) {
      this.searchQueryParams.queryParams['stars'] = this.model.stars;
    }
    if (this.model.topic && this.model.topic !== '') {
      this.searchQueryParams.queryParams['topic'] = this.model.topic;
    }
  }
}