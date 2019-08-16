import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GitSearchService } from './services/git-search.service';
import { GitCodeSearchService } from './services/git-code-search.service';
import { GitSearchComponent } from './git-search/git-search.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule, Routes, Router } from '@angular/router';
import { NoSpecialCharsDirective } from './directives/no-special-chars.directive';
import { RepositoryDisplayComponent } from './repository-display/repository-display.component';
import { CodeDisplayComponent } from './code-display/code-display.component';
import { FadeDirective } from './directives/fade.directive';
import { FavoriteTextPipe } from './pipes/favorite-text.pipe';

const appRoutes: Routes = [
  { path: '',
    component: HomePageComponent
  },
  { path: 'search',
    redirectTo: '/search/angular/1',
    pathMatch: 'full'
  },
  { path: 'search/:query/:page',
    component: GitSearchComponent,
    data: { title: 'Git Search' }
  },
  { path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    GitSearchComponent,
    HomePageComponent,
    NotFoundComponent,
    NoSpecialCharsDirective,
    RepositoryDisplayComponent,
    CodeDisplayComponent,
    FadeDirective,
    FavoriteTextPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [GitSearchService, GitCodeSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
