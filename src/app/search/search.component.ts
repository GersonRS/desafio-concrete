import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { GithubApiV3Service } from './../services/github-api-v3.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Observable, Subject, empty } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  user$: Observable<any>;
  repositories$: Observable<[]>;

  error$ = new Subject<boolean>();

  userName: string;

  constructor(
    private route: ActivatedRoute,
    private githubApi: GithubApiV3Service,
    private router: Router,
    private location: Location
  ) { }

  ngOnDestroy() {
    this.error$.complete();
  }

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => params['user']),
        tap(user => this.userName = user),
        switchMap(user => this.githubApi.getData(user)),
        catchError(this.handleError())
      )
      .subscribe(response => this.setData(response));
  }

  newSearch() {
    this.user$ = null;
    this.repositories$ = null;
    this.error$.next(false);
    this.githubApi.getData(this.userName)
      .pipe(
        catchError(this.handleError())
      )
      .subscribe(response => this.setData(response));
    this.location.replaceState(`search/${this.userName}`);
  }

  private setData(response) {
    response[0]['count_stars'] = 0;
    response[1].forEach((obj: any) => response[0]['count_stars'] += obj.stargazers_count);
    this.repositories$ = of(response[1].sort(function (a: any, b: any) { return b.stargazers_count - a.stargazers_count }));
    this.user$ = of(response[0]);
  }

  private handleError() {
    return (error: any): Observable<any> => {
      this.error$.next(true);
      return of(this.error$);
    };
  }

}
