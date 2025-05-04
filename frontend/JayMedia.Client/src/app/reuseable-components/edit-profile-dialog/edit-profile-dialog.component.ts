import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrl: './edit-profile-dialog.component.css'
})
export class EditProfileDialogComponent implements OnInit{
  baseUrl : string = "http://localhost:5090";

  private toastr = inject(ToastrService);

  profileForm: FormGroup;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  {
    this.profileForm = this.fb.group({
      firstname: ["", [Validators.required, Validators.minLength(2)]],
      lastname: ["", [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.profileForm.patchValue({
      firstname: this.data.firstName,
      lastname: this.data.lastName
    });
  }

  onSave(profileData: { [key: string]: any }) {
    var token = this.authService.getToken();

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    });

    this.http.post<any>(`${this.baseUrl}/api/User/EditUserDetails`, profileData, {headers: headers})
    .subscribe({
      next: (res) => {
        console.log(res);
        if (res.status) {
          this.toastr.success(`${res.message}`, 'Success');
          setTimeout(() => {
            this.dialogRef.close(true); // tells parent component "something changed"
          }, 1500);
        }else {
          this.toastr.error('Error occured. Unable to perform action!', 'Error');
          setTimeout(() => {
            location.reload();
          }, 1500);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
