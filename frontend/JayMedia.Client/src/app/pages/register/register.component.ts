import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  baseUrl : string = "http://localhost:5090";

  respMsg : string = "";

  status! : boolean;

  registerForm: FormGroup;

  constructor(
    @Inject(DOCUMENT) private domDocument: Document,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      firstname: ["", [Validators.required, Validators.minLength(2)]],
      lastname: ["", [Validators.required, Validators.minLength(2)]],
      username: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
      termsAgreed: [false, Validators.requiredTrue]
    }, {
      validators: this.checkIfPasswordMatches
    });
  }

  ngOnInit() {}

  checkIfPasswordMatches(form: FormGroup) {
    const password = form.get("password")?.value;
    const confirmPassword = form.get("confirmPassword")?.value;

    if (password !== confirmPassword) {
      form.get("confirmPassword")?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return { passwordMismatch: false };
  }

  // onSubmit() {
  //   console.log("🚀 Form submitted");
  //   if (this.registerForm.valid) {
  //     console.log("Register form submitted", this.registerForm.value);

  //     const headers = new HttpHeaders({
  //       "Content-Type": "application/json"
  //     });

  //     this.http.post<any>(`${this.baseUrl}/api/Auth/Register`, this.registerForm.value, {headers: headers})
  //     .subscribe({
  //       next: (res) => {
  //         console.log(res);
  //         this.respMsg = res.message;
  //         this.status = res.status;

  //         if (this.status) {
  //           setTimeout(() => {this.domDocument.location.replace("/login")}, 3000);
  //         }
  //       },
  //       error: (err) => {
  //         console.error(err);
  //       }
  //     });
  //   } else {
  //     this.registerForm.markAllAsTouched();
  //   }
  // }

  onSubmit() { 
    console.log("🚀 Form submitted");

    if (this.registerForm.valid) {
      console.log("✅ Form is valid", this.registerForm.value);

      const headers = new HttpHeaders({
        "Content-Type": "application/json"
      });

      this.http.post<any>(`${this.baseUrl}/api/Auth/Register`, this.registerForm.value, { headers })
      .subscribe({
        next: (res) => {
          console.log("✅ Response:", res);
          this.respMsg = res.message;
          this.status = res.status;

          if (this.status) {
            setTimeout(() => {
              this.domDocument.location.replace("/login");
            }, 3000);
          }
        },
        error: (err) => {
          console.error("❌ Error:", err);
        }
      });
    } else {
      console.log("❌ Form is invalid");
      this.registerForm.markAllAsTouched();
    }
  }


}
