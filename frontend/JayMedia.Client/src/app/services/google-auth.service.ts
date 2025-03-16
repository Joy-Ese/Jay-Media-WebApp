import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  baseUrl : string = "http://localhost:5090";

  private clientId = "1095572228607-4saav0nj252bmlnm7f5mnfabbfo6m1dr.apps.googleusercontent.com";

  constructor(private http: HttpClient) { }

  loadGoogleAuth(): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => this.handleCredentialResponse(response),
    });
  }

  handleCredentialResponse(response: any): void {
    const token = response.credential; // Google ID Token
    console.log('Google ID Token:', token);

    const decodedToken: any = jwtDecode(token);
    console.log("User Info from Google:", decodedToken);

    // Send token to backend for verification and JWT generation
    this.http.post<any>(`${this.baseUrl}/api/auth/google-login`, { token })
    .subscribe({
      next: (res: any) => {
        console.log('JWT from backend:', res.jwt);
        localStorage.setItem('jwtToken', res.jwt); // Store JWT for future requests
      },
      error: (err) => {
        console.error('Error verifying Google token:', err);
      }
    });
  }

  renderGoogleSignInButton(): void {
    google.accounts.id.renderButton(document.getElementById('google-signin-btn'), {
      theme: 'outline',
      size: 'large',
    });
  }

}
