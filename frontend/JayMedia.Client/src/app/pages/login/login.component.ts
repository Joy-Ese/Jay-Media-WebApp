import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EncryptionService } from '../../services/encryption.service';
import { GoogleAuthService } from '../../services/google-auth.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  baseUrl : string = "http://localhost:5090";

  respMsg : string = "";

  status! : boolean;

  loginForm: FormGroup;

  key : any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private fb: FormBuilder,
    private encryptionService : EncryptionService,
    private googleAuthService: GoogleAuthService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(2)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Safe to use browser APIs here
      this.googleAuthService.initializeGoogleAuth();
    }
    // this.googleAuthService.initializeGoogleAuth();
  }

  onSubmit(loginData: { userName: string, password: string }) {
    if (this.loginForm.valid) {
      console.log("Login form submitted", this.loginForm.value);

      const encryptedData = this.encryptionService.encryptData(loginData);

      const headers = new HttpHeaders({
        "Content-Type": "application/json"
      });

      this.http.post<any>(`${this.baseUrl}/api/Auth/Login`, { data: encryptedData }, {headers: headers})
      .subscribe({
        next: (res) => {
          console.log(res);
          const decryptedResponse = this.encryptionService.decryptData(res);
          console.log('Decrypted Response:', decryptedResponse);
          if (!decryptedResponse.status) {
            this.status = decryptedResponse.status;
            this.respMsg = decryptedResponse.message;
          }
          this.key = localStorage.setItem("loginResp", JSON.stringify(decryptedResponse));
          console.log(decryptedResponse.message);
          localStorage.setItem("token", decryptedResponse.message);

          const headers2 = new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${decryptedResponse.message}`
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
                }, 200);
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
          console.log(err);
        }
      })
    } 
    else 
    {
      this.loginForm.markAllAsTouched();
    }
  }

}
