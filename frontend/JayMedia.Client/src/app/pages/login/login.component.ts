import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EncryptionService } from '../../services/encryption.service';
import { GoogleAuthService } from '../../services/google-auth.service';

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
    private http: HttpClient,
    private fb: FormBuilder,
    private encryptionService : EncryptionService,
    private googleAuthService: GoogleAuthService
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(2)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.googleAuthService.loadGoogleAuth();
    this.googleAuthService.renderGoogleSignInButton();
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
        },
        error: (err) => {
          console.log(err);
        }
      })
    } 
    else 
    {
      this.loginForm.markAllAsTouched();
    }
  }

  signInWithGoogle(): void {
    google.accounts.id.prompt();
  }
}
