import { Component, OnInit } from '@angular/core'
import { GitSearchService } from './git-search.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private GitSearchService: GitSearchService) { }
  
  ngOnInit() { }

  title = 'GitHub Browser';
}