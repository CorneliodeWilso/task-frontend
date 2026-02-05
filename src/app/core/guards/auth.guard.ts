import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { isTokenExpired } from '../utils/token.util';

/**
 * authGuard
 * Description: Guard to validate if the jwt token exists in local storage and has not expired; otherwise, redirect to the login form.
 * @date: 2026-02-05
 * @author: Cornelio Leal
 * @returns true if the user is authenticated; otherwise false
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem("token");

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};