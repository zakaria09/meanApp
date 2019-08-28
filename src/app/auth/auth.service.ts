import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:3000/api/user';
  private token;
  private isAuthenticated = new Subject<boolean>();
  private isAuth = false;
  private tokenTimer: any;

  private set makeAuth(value: boolean) {
    this.isAuth = value;
    this.isAuthenticated.next(value);
  }

  get authState() {
    if(this.getToken) {this.makeAuth = true;}
    return this.isAuthenticated.asObservable();
  }
  get getToken() { return localStorage.getItem('token'); }
  get authStatus() { return this.isAuth; }

  constructor(
    private http: HttpClient,
    private router: Router
    ) { }


  createUser(name: string, email: string, password: string) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password
    };
    this.http.post(`${this.url}/signup`, authData)
      .subscribe(result => console.log(result));
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password
    };
    this.http.post<{token: string, expiresIn: number}>(`${this.url}/signin`, authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expirationDuration = response.expiresIn;
          this.tokenTimer = setTimeout(
            () => this.logout(),
            expirationDuration * 1000
          );
          this.makeAuth = true;
          this.router.navigate(['']);
        }
        localStorage.setItem('token', this.token);
      });
  }

  logout() {
    this.token = localStorage.removeItem('token');
    this.makeAuth = false;
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/signin']);
  }
}
