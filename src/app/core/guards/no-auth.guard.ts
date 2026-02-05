import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { isTokenExpired } from '../utils/token.util';


/**
 * noAuthGuard
 * Description: Guard to send the user to manage tasks is this has logged in
 * @date 2026-02-05
 * @author Cornelio Leal
 * @returns true if the user is  not authenticated, and if is autenticated the user is redirect to manage tasks
 */
export const noAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem("token");

  if (token && !isTokenExpired(token)) {
    router.navigate(['/tasks']);
    return false;
  }

  return true;
};