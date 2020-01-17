import { catchError, tap, take } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { environment } from './../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GithubApiV3Service {

  private readonly API_URL = `${environment.urlApiV3}/users`

  constructor(private http: HttpClient) { }

  getData(user: string){
    return forkJoin([this.getUser(user), this.getRepositories(user)]);
  }

  getUser(user: string){
    return this.http.get(`${this.API_URL}/${user}`)
      .pipe(
        take(1)
      );
  }

  getRepositories(user: string){
    return this.http.get(`${this.API_URL}/${user}/repos`)
      .pipe(
        take(1)
      );
  }
}
