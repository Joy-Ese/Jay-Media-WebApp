import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  userName: string | null = null;

  isLoggedIn! : boolean; // get userdetails incase you need the status boolean

  isMenuCollapsed = true;

  constructor(public authService: AuthService) { }
  
  ngOnInit(): void {
    // this.userName = localStorage.getItem("userId");
    // console.log(this.userName);

    if (typeof window !== 'undefined' && localStorage) {
      this.userName = localStorage.getItem("userId");
      console.log(this.userName);
    } else {
      console.warn('localStorage is not available.');
    }
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  logout() {
    this.authService.logoutUser();
  }
}
