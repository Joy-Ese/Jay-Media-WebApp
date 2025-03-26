import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { DeletedSearchesDialogComponent } from '../../reuseable-components/deleted-searches-dialog/deleted-searches-dialog.component';
import { EditProfileDialogComponent } from '../../reuseable-components/edit-profile-dialog/edit-profile-dialog.component';

interface SearchItem {
  id: number;
  searchTerm: string;
  date: Date;
  category: string;
  resultsCount: number;
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

  searchItems: SearchItem[] = [
    { 
      id: 1, 
      searchTerm: 'Nature Landscapes', 
      date: new Date('2024-03-15'), 
      category: 'Images', 
      resultsCount: 250 
    },
    { 
      id: 2, 
      searchTerm: 'Electronic Music', 
      date: new Date('2024-03-20'), 
      category: 'Audio', 
      resultsCount: 150 
    },
    { 
      id: 3, 
      searchTerm: 'Technology Animations', 
      date: new Date('2024-03-25'), 
      category: 'Video', 
      resultsCount: 75 
    }
  ];

  displayedColumns: string[] = ['searchTerm', 'date', 'category', 'resultsCount', 'actions'];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void { }

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '500px',
      data: {} // You can pass user data here
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Profile updated:', result);
        // Implement profile update logic
      }
    });
  }

  editSearch(search: SearchItem): void {
    // Implement edit search logic
    console.log('Editing search:', search);
  }

  deleteSearch(search: SearchItem): void {
    // Implement delete search logic
    this.searchItems = this.searchItems.filter(item => item.id !== search.id);
    console.log('Deleted search:', search);
  }

  openDeletedSearchesDialog(): void {
    const dialogRef = this.dialog.open(DeletedSearchesDialogComponent, {
      width: '600px',
      data: {} // You can pass deleted searches data here
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Restored search:', result);
        // Implement search restoration logic
      }
    });
  }

}
