import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  searchTerm = "";

  userName: string | null = null;

  isLoggedIn! : boolean; // get userdetails incase you need the status boolean

  constructor() { }
  
  ngOnInit(): void {
    this.userName = localStorage.getItem("userId");
    console.log(this.userName);
  }

  onSearch() {
    console.log("Searching for:", this.searchTerm);
    // consume api endpoint and perfom further logic
  }
}
