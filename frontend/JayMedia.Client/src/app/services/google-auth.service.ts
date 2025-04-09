import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  baseUrl : string = "http://localhost:5090";

  respMsg : string = "";

  status! : boolean;

  key : any;

  private clientId = "1095572228607-4saav0nj252bmlnm7f5mnfabbfo6m1dr.apps.googleusercontent.com";

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  initializeGoogleAuth(): void {
    this.loadGoogleAuth().then(() => {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: any) => this.handleCredentialResponse(response),
      });

      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large' }
      );
    }).catch(err => console.error('Google API failed to load', err));
  }

  loadGoogleAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        // Wehen on the server, resolve with a dummy value or reject
        resolve();
        return;
      }

      const checkGoogleLoaded = () => {
        if (window.hasOwnProperty('google') && google.accounts) {
          resolve();
        } else {
          setTimeout(checkGoogleLoaded, 100);
        }
      };
      checkGoogleLoaded();
    });
  }

  handleCredentialResponse(response: any): void {
    const token = response.credential; // Google ID Token
    console.log('Google ID Token:', token);

    const decodedToken: any = jwtDecode(token);
    console.log("User Info from Google:", decodedToken);

    // Send token to backend for verification and JWT generation
    this.http.post<any>(`${this.baseUrl}/api/auth/Google-Login`, { idToken: token })
    .subscribe({
      next: (res: any) => {
        console.log(res);
        this.key = localStorage.setItem("loginResp", JSON.stringify(res));
        localStorage.setItem("token", res.message);

        const headers2 = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${res.message}`
        });

        this.http.get<any>(`${this.baseUrl}/api/User/GetUserDetails`, {headers: headers2})
          .subscribe({
            next: (res) => {
              localStorage.setItem("userDetails", JSON.stringify(res));
              localStorage.setItem("userId", res.username);
              if (this.authService.isAuthenticated()) {
                setTimeout(() => {
                  this.router.navigate(['/home']).then(() => {
                    location.reload();
                  });
                }, 1000);
              }
              this.router.navigate(['/login']);
            },
            error: (err) => {
              console.log(err);
            }
          });
      },
      error: (err) => {
        this.status = err.error.status;
        this.respMsg = err.error.message;
        console.error('Error verifying Google token:', err);
      }
    });
  }

}
