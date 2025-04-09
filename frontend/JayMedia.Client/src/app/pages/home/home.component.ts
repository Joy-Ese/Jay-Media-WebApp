import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  private toastr = inject(ToastrService);

  searchTerm = "";

  userName: string | null | undefined = undefined;

  mediaType = "";

  images: any[] = [];

  audios: any[] = [];

  displayedImages: any[] = []; 
  displayedAudios: any[] = []; 
  displayedMedia: any[] = [];
  
  currentPage: number = 1;

  itemsPerPage: number = 5;

  // New filter properties
  showFilters: boolean = false;
  selectedMediaType: string = '';
  selectedLicenseType: string = '';
  selectedSortBy: string = 'relevance';
  hasActiveFilters: boolean = false;

  // Media-specific filter objects
  imageFilters = {
    imgFiletype: '',
    imgCategory: '',
  };
  
  audioFilters = {
    duration: '',
    audCategory: '',
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

  showToast() {
    // this.toastr.success('Operation successful!', 'Success');
    this.toastr.error('Please login to access filter feature!', 'Error');
    // Other types: error(), warning(), info()
  }

  onSearch() {
    console.log("Searching for:", this.searchTerm);

    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    this.http.get<any>(`${this.baseUrl}/api/Search/SearchMedia?query=${this.searchTerm}&username=${this.userName}`, {headers: headers})
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

  updateDisplayedMedia() {
    // Apply filters and pagination
    //   let filteredImages = this.applyFilters(this.images);

    // Interleave images and audios
    const combinedResults = [];
    const maxLength = Math.max(this.images.length, this.audios.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i < this.images.length) {
        combinedResults.push({ ...this.images[i], type: 'image' });
      }
      if (i < this.audios.length) {
        combinedResults.push({ ...this.audios[i], type: 'audio' });
      }
    }
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedMedia = combinedResults.slice(startIndex, endIndex);
    
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
      if (this.imageFilters.imgFiletype) {
        // Example: result = result.filter(item => item.imgFiletype === this.imageFilters.imgFiletype);
      }
      if (this.imageFilters.imgCategory) {
        // Example: result = result.filter(item => item.imgCategory === this.imageFilters.imgCategory);
      }
    } else if (this.selectedMediaType === 'audio') {
      // Apply audio filters
      if (this.audioFilters.duration) {
        // Filter by duration
      }
      if (this.audioFilters.audCategory) {
        // Filter by category
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
        default:
          // Default to relevance (no sorting or custom relevance algorithm)
          break;
      }
    }
    
    return result;
  }

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
    if (!this.userName || this.userName === 'undefined' || this.userName === '') {
      this.showToast();
    } else {
      this.showFilters = !this.showFilters; // Only toggle if user is logged in
    }
  }

  clearAllFilters(): void {
    // Reset all filter values
    this.selectedMediaType = '';
    this.selectedLicenseType = '';
    this.selectedSortBy = '';
    
    // Reset media-specific filters
    this.imageFilters = {
      imgFiletype: '',
      imgCategory: '',
    };
    
    this.audioFilters = {
      duration: '',
      audCategory: '',
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
        imgFiletype: '',
        imgCategory: '',
      };
    } else if (this.selectedMediaType === 'audio') {
      this.audioFilters = {
        duration: '',
        audCategory: '',
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
        this.audioFilters = { duration: '', audCategory: '' };
        break;
      case 'licenseType':
        this.selectedLicenseType = '';
        break;
      case 'sortBy':
        this.selectedSortBy = 'relevance';
        break;
      // Image filter cases
      case 'imgFiletype':
        this.imageFilters.imgFiletype = '';
        break;
      case 'imgCategory':
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
        this.imageFilters.imgFiletype || 
        this.imageFilters.imgCategory
      )) ||
      // Audio filters
      (this.selectedMediaType === 'audio' && (
        this.audioFilters.duration || 
        this.audioFilters.audCategory
      )) 
    );
  }





}
