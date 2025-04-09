import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  // Check if user is logged in
  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if token exists
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem("token");
    }
    return null; // Retrieve token from localStorage
  }

  // Save token after login
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("loginResp");
    localStorage.removeItem("userDetails");
    localStorage.clear();
    this.router.navigate(['/login']);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }


}
