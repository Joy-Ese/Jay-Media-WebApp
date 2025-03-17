import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Check if user is logged in
  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if token exists
  }

  getToken(): string | null {
    return localStorage.getItem("token"); // Retrieve token from localStorage
  }

  // Save token after login
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Remove token on user logout
  logout(): void {
    localStorage.removeItem("token");
  }

  logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("loginResp");
    localStorage.removeItem("userDetails");
    var userId = localStorage.getItem("userId");
    localStorage.clear();
    // this.router.navigate(['/login']);
    // setTimeout(() => {
    //   window.location.reload();
    // }, 300);
  }


}
