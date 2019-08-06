import { Component, OnInit } from '@angular/core';
import { GitSearchService } from '../git-search.service';
import { GitSearch } from '../git-search';
import { GitUsers } from '../git-users';
import { ActivatedRoute, ParamMap, Router, NavigationExtras, Params } from '@angular/router';
import { AdvancedSearchModel } from '../advanced-search-model'
import { FormControl, FormGroup, Validators } from '@angular/forms'

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
  form: FormGroup;
  formControls = {};

  constructor(private gitSearchService: GitSearchService,
              private route: ActivatedRoute,
              private router: Router) {
    this.modelKeys.forEach((key) => {
      let validators = [];
      if (key == 'q') {
        validators.push(Validators.required);
      }
      if (key == 'stars') {
        validators.push(Validators.maxLength(4));
      }
      validators.push(this.noSpecialChars);
      this.formControls[key] = new FormControl(this.model[key], validators); 
    });
    this.form = new FormGroup(this.formControls);
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
    this.gitSearchService.gitSearch(this.searchQuery, this.searchPage, this.searchQueryParams).then((response) => {
      this.searchResults = response;
    }, (error) => {
      alert('Error: ' + error.statusText);
    });
  }

  private gitUserSearch(query: string) {
    this.gitSearchService.gitSearchUsers(query).then((response) => {
      this.userSearchResults = response;
    }, (error) => {
      alert('Error: ' + error.statusText);
    });
  }

  public newQuery() {
    this.searchPage = 1;
    this.searchQuery = '';

    if (this.form.value['q']) {
      this.searchQuery = this.form.value['q'];
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

    if (this.form.value['language'] && this.form.value['language'] !== '') {
      this.searchQueryParams.queryParams['language'] = this.form.value['language'];
    }
    if (this.form.value['user'] && this.form.value['user'] !== '') {
      this.searchQueryParams.queryParams['user'] = this.form.value['user'];
    }
    if (this.form.value['size']) {
      this.searchQueryParams.queryParams['size'] = this.form.value['size'];
    }
    if (this.form.value['stars']) {
      this.searchQueryParams.queryParams['stars'] = this.form.value['stars'];
    }
    if (this.form.value['topic'] && this.form.value['topic'] !== '') {
      this.searchQueryParams.queryParams['topic'] = this.form.value['topic'];
    }
  }

  private noSpecialChars(c: FormControl) {
    let regex = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
    return regex.test(c.value) ? { validateEmail: { valid:false } } : null
  }
}