import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import {HttpClient} from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { Student } from '../modeles/student';

@Injectable()
export class UserService {

  currentUser:Student;
  private _isAdmin = new BehaviorSubject<boolean>(false);
  isAdmin = this._isAdmin.asObservable();
  private _isUser = new BehaviorSubject<boolean>(false);
  isUser = this._isUser.asObservable();

  constructor(
    private apiService: ApiService,
    private config: ConfigService,
    private httpClient: HttpClient,
  ) { }

  initUser() {
    const promise = this.apiService.get(this.config.refresh_token_url).toPromise()
    .then(res => {
      if (res.access_token !== null) {
        return this.getMyInfo().toPromise()
        .then(user => {
          this.currentUser = user;
          /*if (JSON.stringify(this.currentUser.authorities).search('ROLE_ADMIN') !== -1) {
            this._isAdmin.next(true);
          } else {
            this._isUser.next(true);
          }*/
        });
      }
    })
    .catch(() => null);
    return promise;
  }

  resetCredentials() {
    return this.apiService.get(this.config.reset_credentials_url);
  }

  getMyInfo() {
    return this.apiService.get(this.config.whoami_url).pipe(map(user => this.currentUser = user));
  }

  getAll() {
    return this.apiService.get(this.config.student_url);
  }

  getUserById(userId: number): Observable<object>{
    return this.httpClient.get(this.config.student_url + '/' + userId);
  }
}
