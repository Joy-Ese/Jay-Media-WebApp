import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { DeletedSearchesDialogComponent } from '../../reuseable-components/deleted-searches-dialog/deleted-searches-dialog.component';
import { EditProfileDialogComponent } from '../../reuseable-components/edit-profile-dialog/edit-profile-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

interface SearchItem {
  searchId: number;
  searchQuery: string;
  category: string;
  timeStamp: Date;
}

@Component({
  selector: 'app-manage-search',
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
  templateUrl: './manage-search.component.html',
  styleUrl: './manage-search.component.css'
})
export class ManageSearchComponent implements OnInit{
  baseUrl : string = "http://localhost:5090";

  private toastr = inject(ToastrService);

  deletedSearchItems: any[] = [];

  searchItems: any[] = [];

  displayedColumns: string[] = ['searchQuery', 'timeStamp', 'category', 'actions'];

  userDeets!: string | null;
  objUserDeets: any[] = [];

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      this.getUserDetails();
      this.userDeets = localStorage.getItem("userDetails");

      this.objUserDeets = this.userDeets ? JSON.parse(this.userDeets) : { firstname: "", lastname: "" };

      this.getActiveSearches();
      this.getInActiveSearches();
    }
  }

  getUserDetails() {
    var token = this.authService.getToken();

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    });

    this.http.get<any>(`${this.baseUrl}/api/User/GetUserDetails`, {headers: headers})
    .subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem("userDetails", JSON.stringify(res));
        localStorage.setItem("userId", res.username);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getActiveSearches() {
    var token = this.authService.getToken();

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    });

    this.http.get<any>(`${this.baseUrl}/api/Search/GetActiveSearches`, {headers: headers})
    .subscribe({
      next: (res) => {
        this.searchItems = res || [];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getInActiveSearches() {
    var token = this.authService.getToken();

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    });

    this.http.get<any>(`${this.baseUrl}/api/Search/GetInActiveSearches`, {headers: headers})
    .subscribe({
      next: (res) => {
        this.deletedSearchItems = res || [];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '500px',
      data: this.objUserDeets // You can pass user data here
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Profile updated:', result);
      }
    });
  }

  deleteSearch(search: SearchItem) {
    var token = this.authService.getToken();

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    });

    console.log(search.searchId);
    this.http.post<any>(`${this.baseUrl}/api/Search/RestoreOrDelete?action=D&searchId=${search.searchId}`, null, {headers: headers})
    .subscribe({
      next: (res) => {
        console.log(res);
        if (res.status) {
          this.toastr.success('Search Query successfully deleted!', 'Success');
          setTimeout(() => {
            location.reload();;
          }, 1500);
        }else {
          this.toastr.error('Error occured. Unable to perform action!', 'Error');
          setTimeout(() => {
            location.reload();;
          }, 1500);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openDeletedSearchesDialog(): void {
    const dialogRef = this.dialog.open(DeletedSearchesDialogComponent, {
      width: '1000px',
      data: this.deletedSearchItems
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Restored search:', result);
        // Implement search restoration logic
      }
    });
  }

}
