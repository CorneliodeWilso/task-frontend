import { TestBed } from '@angular/core/testing';
import {  HttpClientTestingModule,  HttpTestingController} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../features/auth/models/login.interface';
import { ResponseModel } from '../models/ResponseModel';


jest.mock('../utils/token.util', () => ({
  isTokenExpired: jest.fn(),
}));

import { isTokenExpired } from '../utils/token.util';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });


  test('login and save the token in localStorage', () => {
    const request: LoginRequest = {
      email: 'test@test.com',
      password: '123456',
    };

    const mockResponse: ResponseModel = {
      code: 200,
      data: {
        token: 'token123',
      },
      message: 'Login success',
    };

    service.login(request).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('token123');
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush(mockResponse);
  });

  test('not store token if response incomming with no token', () => {
    const request: LoginRequest = {
      email: 'test@gmail.com',
      password: '12345678',
    };

    const mockResponse: ResponseModel = {
      code: 200,
      data: {},
      message: 'Login success',
    };

    service.login(request).subscribe(() => {
      expect(localStorage.getItem('token')).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/login`);
    req.flush(mockResponse);
  });

  test('register success and save the token in localStorage', () => {
    const request: LoginRequest = {
      email: 'ricardo@gmail.com',
      password: '12345678',
    };

    const mockResponse: ResponseModel = {
      code: 200,
      data: {
        token: 'tokentest',
      },
      message: 'Register success',
    };

    service.register(request).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('tokentest');
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush(mockResponse);
  });



  test('remove the token from localStorage when the user logout', () => {
    localStorage.setItem('token', 'token123');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
  });


  test('return token from localStorage', () => {
    localStorage.setItem('token', 'token123');

    expect(service.token).toBe('token123');
  });

  test('return null if token does not exist', () => {
    expect(service.token).toBeNull();
  });


  test('return false if no token exists', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  test('return false if token is expired', () => {
    localStorage.setItem('token', 'token123');
    (isTokenExpired as jest.Mock).mockReturnValue(true);

    expect(service.isLoggedIn()).toBe(false);
  });

  test('return true if token exists and is not expired', () => {
    localStorage.setItem('token', 'token123');
    (isTokenExpired as jest.Mock).mockReturnValue(false);

    expect(service.isLoggedIn()).toBe(true);
  });
});