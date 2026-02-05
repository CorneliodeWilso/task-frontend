import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { isTokenExpired } from '../utils/token.util';
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Buscar token
  const token = localStorage.getItem("token");

  // Si NO hay token → Login
  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (isTokenExpired(token)) {

    console.warn("Token expirado. Cerrando sesión...");

    localStorage.removeItem("token");

    router.navigate(['/auth/login']);
    return false;
  }
  // Si hay token → permitir acceso
  return true;
};