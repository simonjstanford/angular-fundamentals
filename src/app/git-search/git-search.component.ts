import { Component, OnInit } from '@angular/core';
import { GitSearchService } from '../git-search.service';
import { GitSearch } from '../git-search';
import { GitUsers } from '../git-users';
import { ActivatedRoute, ParamMap, Router, NavigationExtras, Params } from '@angular/router';
import { AdvancedSearchModel } from '../advanced-search-model'

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

  constructor(private gitSearchService: GitSearchService,
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

    this.route.queryParams.subscribe((params: Params) => {
      this.searchQueryParams['language'] = params['language'];
      this.searchQueryParams['user'] = params['user'];
      this.searchQueryParams['size'] = params['size'];
      this.searchQueryParams['stars'] = params['stars'];
      this.searchQueryParams['topic'] = params['topic'];
      this.gitSearch();
    });

    //this is added so we can search for the same info twice
    this.route.queryParamMap.subscribe((params) => {
      this.gitSearch();
    });
  }

  gitSearch = () => {
    this.gitSearchService.gitSearch(this.searchQuery, this.searchPage, this.searchQueryParams).then((response) => {
      this.searchResults = response;
    }, (error) => {
      alert('Error: ' + error.statusText);
    });
  }

  gitUserSearch = (query: string) => {
    this.gitSearchService.gitSearchUsers(query).then((response) => {
      this.userSearchResults = response;
    }, (error) => {
      alert('Error: ' + error.statusText);
    });
  }

  newQuery = () => {
    this.searchPage = 1;
    this.searchQuery = '';

    if (this.model.q) {
      this.searchQuery = this.model.q;
    }

    this.searchQueryParams = { 
      queryParams: { 
        'language': this.model.language,
        'user': this.model.user,
        'size': this.model.size,
        'stars': this.model.stars,
        'topic': this.model.topic
      } 
    };

    this.sendQuery();
  }

  nextPage = () => {
    this.searchPage++;
    this.sendQuery();
  }

  previousPage = () => {
    this.searchPage--;
    this.sendQuery();
  }

  sendQuery = () => {
    this.searchResults = null;
    this.router.navigate(['/search/' + this.searchQuery + '/' + this.searchPage], this.searchQueryParams );
  }
}