import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { log } from 'node:console';

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

  mediaType = "";

  images: any[] = [];

  audios: any[] = [];

  displayedImages: any[] = []; 
  displayedAudios: any[] = []; 
  displayedMedia: any[] = [];
  
  currentPage: number = 1;

  itemsPerPage: number = 10;

  // New filter properties
  showFilters: boolean = false;
  selectedMediaType: string = '';
  selectedLicenseType: string = '';
  selectedSortBy: string = 'relevance';
  hasActiveFilters: boolean = false;

  // Media-specific filter objects
  imageFilters = {
    filetype: '',
    imgCategory: '',
  };
  
  audioFilters = {
    duration: '',
    audCategory: '',
    filetype: '',
    // filetype: false
  };
  

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

    this.http.get<any>(`${this.baseUrl}/api/Search/SearchMedia?query=${this.searchTerm}`, {headers: headers})
    .subscribe({
      next: (res) => {
        console.log(res);
        this.images = res.imageResult?.results || [];
        this.audios = res.audioResult?.results || [];
        this.currentPage = 1;
        this.updateDisplayedMedia();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // updateDisplayedMedia() {
  //   // Apply filters and pagination
  //   let filteredImages = this.applyFilters(this.images);

  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   this.displayedImages = this.images.slice(startIndex, endIndex);
  // }
  updateDisplayedMedia() {
    // Apply filters and pagination
    let filteredImages = this.applyFilters(this.images);


    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    this.displayedMedia = this.images.slice(startIndex, endIndex);
    this.displayedMedia = this.audios.slice(startIndex, endIndex);
    console.log(this.displayedMedia);
  }

  applyFilters(data: any[]): any[] {
    // This is a placeholder function - implement actual filtering logic based on your data structure
    let result = [...data];
    
    if (this.selectedMediaType) {
      // Filter by media type logic
      // Example: result = result.filter(item => item.type === this.selectedMediaType);
    }
    
    if (this.selectedLicenseType) {
      // Filter by license type logic
      // Example: result = result.filter(item => item.license === this.selectedLicenseType);
    }
    
    // Apply media-specific filters
    if (this.selectedMediaType === 'image') {
      if (this.imageFilters.filetype) {
        // Example: result = result.filter(item => item.filetype === this.imageFilters.filetype);
      }
      if (this.imageFilters.imgCategory) {
        // Example: result = result.filter(item => item.imageType === this.imageFilters.imgCategory);
      }
    } else if (this.selectedMediaType === 'audio') {
      // Apply audio filters
      if (this.audioFilters.duration) {
        // Filter by duration
      }
      if (this.audioFilters.audCategory) {
        // Filter by category
      }
      if (this.audioFilters.filetype) {
        // Filter by filetype attribute
      }
    }
    
    // Apply sorting
    if (this.selectedSortBy) {
      // Example sorting logic
      switch (this.selectedSortBy) {
        case 'newest':
          // Sort by newest
          // result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          break;
        case 'oldest':
          // Sort by oldest
          // result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          break;
        case 'popular':
          // Sort by popularity
          // result.sort((a, b) => b.downloads - a.downloads);
          break;
        default:
          // Default to relevance (no sorting or custom relevance algorithm)
          break;
      }
    }
    
    return result;
  }

  // nextPage() {
  //   if (this.currentPage < Math.ceil(this.images.length / this.itemsPerPage)) {
  //     this.currentPage++;
  //     this.updateDisplayedMedia();
  //   }
  // }

  // prevPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     this.updateDisplayedMedia();
  //   }
  // }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < Math.max(this.images.length, this.audios.length)) {
      this.currentPage++;
      this.updateDisplayedMedia();
    }
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedMedia();
    }
  }


  // New filter methods
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  clearAllFilters(): void {
    // Reset all filter values
    this.selectedMediaType = '';
    this.selectedLicenseType = '';
    this.selectedSortBy = 'relevance';
    
    // Reset media-specific filters
    this.imageFilters = {
      filetype: '',
      imgCategory: '',
    };
    
    this.audioFilters = {
      duration: '',
      audCategory: '',
      filetype: ''
    };
    
    // Update filter status
    this.updateFilterStatus();
    
    // Apply the filters (which now have been cleared)
    this.currentPage = 1;
    this.updateDisplayedMedia();
  }
  
  onMediaTypeChange(): void {
    // Reset the specific media type filters when media type changes
    if (this.selectedMediaType === 'image') {
      this.imageFilters = {
        filetype: '',
        imgCategory: '',
      };
    } else if (this.selectedMediaType === 'audio') {
      this.audioFilters = {
        duration: '',
        audCategory: '',
        filetype: ''
      };
    }
    
    // Update filter status and apply filters
    this.updateFilterStatus();
    this.currentPage = 1;
    this.updateDisplayedMedia();
  }
  
  removeFilter(filterName: string): void {
    // Remove specific filter
    switch (filterName) {
      case 'mediaType':
        this.selectedMediaType = '';
        // Reset all specific filters
        this.audioFilters = { duration: '', audCategory: '', filetype: '' };
        break;
      case 'licenseType':
        this.selectedLicenseType = '';
        break;
      case 'sortBy':
        this.selectedSortBy = 'relevance';
        break;
      // Image filter cases
      case 'filetype':
        this.imageFilters.filetype = '';
        break;
      case 'imageType':
        this.imageFilters.imgCategory = '';
        break;
      // Audio filter cases
      case 'duration':
        if (this.selectedMediaType === 'audio') {
          this.audioFilters.duration = '';
        } 
        break;
      case 'audioCategory':
        this.audioFilters.audCategory = '';
        break;
      case 'filetype':
        this.audioFilters.filetype = '';
        break;
    }
    
    // Update filter status and apply filters
    this.updateFilterStatus();
    this.currentPage = 1;
    this.updateDisplayedMedia();
  }

  updateFilterStatus(): void {
    // Check if any filters are active
    this.hasActiveFilters = !!(
      this.selectedMediaType || 
      this.selectedLicenseType || 
      this.selectedSortBy !== 'relevance' ||
      // Image filters
      (this.selectedMediaType === 'image' && (
        this.imageFilters.filetype || 
        this.imageFilters.imgCategory
      )) ||
      // Audio filters
      (this.selectedMediaType === 'audio' && (
        this.audioFilters.duration || 
        this.audioFilters.audCategory || 
        this.audioFilters.filetype
      )) 
    );
  }





}
