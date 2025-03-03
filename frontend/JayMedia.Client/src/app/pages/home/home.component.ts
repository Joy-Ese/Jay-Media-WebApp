import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchTerm = "";

  onSearch() {
    console.log("Searching for:", this.searchTerm);
    // consume api endpoint and perfom further logic
  }
}
