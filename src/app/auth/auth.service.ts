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
          this.setAuthTimer(expirationDuration);
          this.makeAuth = true;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expirationDuration * 1000);
          this.saveAuthData(token, expirationDate)
          this.router.navigate(['']);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.authData;
    if (!authInformation) return;
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.makeAuth = true;
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  logout() {
    this.makeAuth = false;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/signin']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(
      () => this.logout(),
      duration * 1000
    );
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);    
    localStorage.setItem('expiration', expirationDate.toISOString());    
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
  
  private get authData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) return;
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }
}
