import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface DeletedSearchItem {
  searchId: number;
  searchQuery: string;
  category: string;
  timeStamp: Date;
} 

@Component({
  selector: 'app-deleted-searches-dialog',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './deleted-searches-dialog.component.html',
  styleUrl: './deleted-searches-dialog.component.css'
})
export class DeletedSearchesDialogComponent implements OnInit{
  baseUrl : string = "http://localhost:5090";
  
  private toastr = inject(ToastrService);

  dataSource!: MatTableDataSource<any>;

  displayedColumns: string[] = ['searchQuery', 'timeStamp', 'category', 'actions'];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any[],
    public dialogRef: MatDialogRef<DeletedSearchesDialogComponent>
  ) { }

  ngOnInit(): void {
    console.log("opened oooo");
    this.dataSource = new MatTableDataSource(this.data);
  }

  restoreSearch(search: DeletedSearchItem) {
    var token = this.authService.getToken();

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    });

    console.log(search.searchId);
    this.http.post<any>(`${this.baseUrl}/api/Search/RestoreOrDelete?action=R&searchId=${search.searchId}`, null, {headers: headers})
    .subscribe({
      next: (res) => {
        console.log(res);
        if (res.status) {
          this.toastr.success('Search Query successfully restored!', 'Success');
          setTimeout(() => {
            location.reload();;
          }, 3000);
        }else {
          this.toastr.error('Error occured. Unable to perform action!', 'Error');
          setTimeout(() => {
            location.reload();;
          }, 3000);
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
