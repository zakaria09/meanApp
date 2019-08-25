import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:3000/api/user';
  private token;
  
  get getToken() { return this.token; }
  
  constructor(
    private http: HttpClient
    ) { }

    
  createUser(name: string, email: string, password: string) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password
    };
    this.http.post(`${this.url}/signup`, authData)
    .subscribe(result => console.log(result))
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password
    };
    this.http.post<{token: string}>(`${this.url}/signin`, authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
      });
  }
}
