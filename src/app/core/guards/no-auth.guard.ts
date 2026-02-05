import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { isTokenExpired } from '../utils/token.util';

export const noAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem("token");

  // Si YA está logueado → mandarlo a tasks
  if (token && !isTokenExpired(token)) {
    router.navigate(['/tasks']);
    return false;
  }

  return true;
};