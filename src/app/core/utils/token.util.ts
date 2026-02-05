import { jwtDecode } from "jwt-decode";
/**
 * Description: Function to validate if the token has expired
 * @date 2026-02-05
 * @author Cornelio Leal
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const expirationDate = decoded.exp * 1000;
    return Date.now() > expirationDate;
  } catch (error) {
    return true;
  }
}