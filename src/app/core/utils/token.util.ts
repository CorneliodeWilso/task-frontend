import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token: string): boolean {

  try {
    const decoded: any = jwtDecode(token);

    // exp viene en segundos
    const expirationDate = decoded.exp * 1000;

    // Si la fecha ya pasó → expiró
    return Date.now() > expirationDate;

  } catch (error) {
    // Token corrupto o inválido
    return true;
  }
}