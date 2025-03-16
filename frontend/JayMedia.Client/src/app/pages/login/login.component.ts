import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(2)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  onSubmit(loginData: { userName: string, password: string }) {
    if (this.loginForm.valid) {
      console.log("Login form submitted", this.loginForm.value);

      const headers = new HttpHeaders({
        "Content-Type": "application/json"
      });

      this.http.post<any>(`${this.baseUrl}/api/Auth/Login`, loginData, {headers: headers})
      .subscribe({
        next: (res) => {
          console.log(res);
          this.key = localStorage.setItem("loginResp", JSON.stringify(res));
          localStorage.setItem("token", res.message);
        },
        error: (err) => {
          console.log(err);
          this.respMsg = err.error.message;
          this.status = err.error.status;
          console.log(this.respMsg);
        }
      })

    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
