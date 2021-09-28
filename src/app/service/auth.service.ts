import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { KeycloakService } from "keycloak-angular";
import { tap } from "rxjs/internal/operators/tap";
import { Student } from "../modeles/student";
import { Token } from "../modeles/token";
import { Tokens } from "../modeles/tokens";
import { ConfigService } from "./config.service";
import { UserService } from "./user.service";

@Injectable()
export class AuthService {

    private readonly JWT_TOKEN = 'JWT_TOKEN';
    private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
    private readonly STUDENT_INFO = 'STUDENT_INFO';

    private loggedUser: string;

    private headers = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    });

    constructor(private http: HttpClient, 
                private config: ConfigService,
                private userService: UserService, 
                private router: Router,
                private keycloakService: KeycloakService) {
    }

    authenticate(credentials, callback) {

        const headers = new HttpHeaders(credentials ? {
            authorization : 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        } : {});

        this.http.get('user', {headers: headers}).subscribe(
            response => {
                return callback && callback();
            },
            error => {
            }
        );

    }

    

    login(user) {
        const loginHeaders = new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        });
        const body = `username=${user.username}&password=${user.password}`;

        return this.http.post<Token>(this.config.login_url, body, {headers: loginHeaders})
        
        .subscribe(
            value => {
                this.doLoginUser(user.username, new Tokens(value.access_token, null));
                this.userService.getMyInfo().subscribe(
                    value => {
                      this.storeStudentInfo(value);
                      this.router.navigate(['/home']);
                    }
                );
            },
            error => {
                console.log('login failed')
            }
        );
      }
    
      logout() {
        return this.http.post(this.config.logout_url, {})
          .subscribe(() => {
            this.doLogoutUser();
          });
      }
    
      isLoggedIn() {
        return !!this.getJwtToken();
      }

      changePassowrd(passwordChanger) {
        return this.http.post(this.config.change_password_url, passwordChanger);
      }

      refreshToken() {
        return this.http.post<any>(this.config.refresh_token_url, {
          'refreshToken': this.getRefreshToken()
        }).pipe(tap((tokens: Tokens) => {
          this.storeJwtToken(tokens.jwt);
        }));
      }

      getJwtToken() {
        return localStorage.getItem(this.JWT_TOKEN);
      }
    
      private doLoginUser(username: string, tokens: Tokens) {
        this.loggedUser = username;
        this.storeTokens(tokens);
      }
    
      private doLogoutUser() {
        this.loggedUser = null;
        this.removeUserInfo();
        this.removeTokens();
        location.reload();
      }
    
      private getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN);
      }
    
      private storeJwtToken(jwt: string) {
        localStorage.setItem(this.JWT_TOKEN, jwt);
      }
    
      storeStudentInfo(student: Student){
          localStorage.setItem(this.STUDENT_INFO, JSON.stringify(student));
      }
      getStudentInfo(): Student{
          let studentString = localStorage.getItem(this.STUDENT_INFO);
          let student: Student = JSON.parse(studentString);
          this.keycloakService.getUsername()
          return student;
      }

      private storeTokens(tokens: Tokens) {
        localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
        localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
      }
    
      private removeTokens() {
        localStorage.removeItem(this.JWT_TOKEN);
        localStorage.removeItem(this.REFRESH_TOKEN);
      }

      private removeUserInfo(){
          localStorage.removeItem(this.STUDENT_INFO);
      }
    }