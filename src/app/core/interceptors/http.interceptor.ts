import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Auth HTTP Interceptor
 *
 * Description: Functional HTTP interceptor responsible for inyect the JWT token to all
 * HTTP requests. If a token exists it is added to the Authorization header for each request*
 * @date 2026-02-05
 * @author Cornelio Leal
 */
export const HttpInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const token = auth.token;

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};