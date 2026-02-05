import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isTokenExpired } from '../utils/token.util';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../features/auth/models/login.interface';
import { ResponseModel } from '../models/ResponseModel';

/**
 * AuthService
 * Description: Handles authentication-related operations.
 * @date: 2026-02-05
 * @author: Cornelio Leal
 * @service
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Description: Authenticates the user using credentials and retrieves a JWT token.
   * If the credentials are valid, the JWT token is stored in local storage. 
   * @param request Object containing user login credentials like email and password
   * @returns Observable with the authentication response
   * @method
   */
  login(request: LoginRequest) :Observable<ResponseModel> {
  return this.http
    .post<ResponseModel>(`${this.apiUrl}/auth/login`, request)
    .pipe(
      tap(response => {
        const token = response?.data?.token;
        if (token) {
          localStorage.setItem('token', token);
        }
      })
    );
}

/**
   * Description: Method to register an user
   * @param request Object containing user information like email and password
   * @returns Observable with the register response, if the register is done, then save the jwt token in the local storage
   * @method
   */
  register(request: LoginRequest):Observable<ResponseModel> {
    return this.http
    .post<ResponseModel>(`${this.apiUrl}/auth/register`, request)
    .pipe(
      tap(response => {
        const token = response?.data?.token;
        if (token) {
          localStorage.setItem('token', token);
        }
      })
    );
  }


  /**
   * Description: Method responsible to remove jwt token from local storage
   * @method
   */
  logout() {
    localStorage.removeItem("token");
  }

   /**
   * Description: Method responsible to validate if the user is logged in
   * @returns this method returns true if he token has no expired and false if the token is expired
   * @method
   */
  isLoggedIn(): boolean {
    if (!this.token) return false;
    return !isTokenExpired(this.token);
  }
}
