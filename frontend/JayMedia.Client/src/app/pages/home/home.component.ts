import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  baseUrl : string = "http://localhost:5090";

  searchTerm = "";

  userName: string | null = null;

  isLoggedIn! : boolean; // get userdetails incase you need the status boolean

  images: any[] = [];

  displayedImages: any[] = []; 
  
  currentPage: number = 1;

  itemsPerPage: number = 10;

  constructor(
    private http: HttpClient
  ) { }
  
  ngOnInit(): void {
    this.onSearch();

    if (typeof window !== 'undefined' && localStorage) {
      this.userName = localStorage.getItem("userId");
      console.log(this.userName);
    } else {
      console.warn('localStorage is not available.');
    }
  }

  onSearch() {
    console.log("Searching for:", this.searchTerm);

    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    this.http.get<any>(`${this.baseUrl}/api/Search/ImagesSearch?query=${this.searchTerm}`, {headers: headers})
    .subscribe({
      next: (res) => {
        console.log(res);
        this.images = res.results;
        this.updateDisplayedImages();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateDisplayedImages() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedImages = this.images.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.images.length / this.itemsPerPage)) {
      this.currentPage++;
      this.updateDisplayedImages();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedImages();
    }
  }


}
