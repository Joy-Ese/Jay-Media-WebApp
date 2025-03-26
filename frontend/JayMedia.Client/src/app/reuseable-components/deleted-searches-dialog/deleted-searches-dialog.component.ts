import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { CommonModule } from '@angular/common';

interface DeletedSearchItem {
  id: number;
  searchTerm: string;
  date: Date;
  category: string;
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
export class DeletedSearchesDialogComponent {

  displayedColumns: string[] = ['searchTerm', 'date', 'category', 'actions'];

  deletedSearches: DeletedSearchItem[] = [
    { 
      id: 1, 
      searchTerm: 'Old Nature Photos', 
      date: new Date('2024-03-10'), 
      category: 'Images' 
    },
    { 
      id: 2, 
      searchTerm: 'Vintage Music', 
      date: new Date('2024-03-05'), 
      category: 'Audio' 
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<DeletedSearchesDialogComponent>
  ) { }

  restoreSearch(search: DeletedSearchItem): void {
    // Implement search restoration logic
    console.log('Restoring search:', search);
    this.dialogRef.close(search);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
