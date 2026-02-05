import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isTokenExpired } from '../utils/token.util';

import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return localStorage.getItem("token");
  }
  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, data).pipe(
      tap(res => localStorage.setItem("token", res.token))
    );
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  logout() {
    localStorage.removeItem("token");
  }

  isLoggedIn(): boolean {
    if (!this.token) return false;

    return !isTokenExpired(this.token);
  }
}
