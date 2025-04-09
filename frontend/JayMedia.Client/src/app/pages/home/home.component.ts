import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
    private http: HttpClient,
    private authService: AuthService,
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
    var token = this.authService.getToken();

    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    // If filter is clicked 
    if (this.showFilters && this.selectedMediaType) {
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      });


      if (this.selectedMediaType == "image")
      {
        this.http.get<any>(`${this.baseUrl}/api/Search/ImageFiltering?query=${this.searchTerm}&license=${this.selectedLicenseType}&category=${this.imageFilters.imgCategory}&size=${this.imageFilters.imgFiletype}`, {headers: headers})
        .subscribe({
          next: (res) => {
            console.log(res);
            this.images = res.results || [];
            this.audios = []; // Clear audios...only fetching images
            this.currentPage = 1;
            this.updateImageMedia();
            this.displayedMedia = this.displayedImages;
          },
          error: (err) => {
            console.log(err);
          },
        });

      }
      else if (this.selectedMediaType == "audio") {
        this.http.get<any>(`${this.baseUrl}/api/Search/AudioFiltering?query=${this.searchTerm}&license=${this.selectedLicenseType}&category=${this.audioFilters.audCategory}&length=${this.audioFilters.duration}`, {headers: headers})
        .subscribe({
          next: (res) => {
            console.log(res);
            this.audios = res.results || [];
            this.images = []; // Clear images...only fetching audios
            this.currentPage = 1;
            this.updateAudioMedia();
            this.displayedMedia = this.displayedAudios;
          },
          error: (err) => {
            console.log(err);
          },
        });

      }
    }
    else {
      // No filters...fetching both media types
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
  }

  updateImageMedia() {
    // Applying pagination without modifying the image source array
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedImages = this.images.map(item => ({ ...item, type: 'image' })).slice(startIndex, endIndex);
    
    console.log(this.displayedImages);
  }

  updateAudioMedia() {
    // Applying pagination without modifying the audio source array
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedAudios = this.audios.map(item => ({ ...item, type: 'audio' })).slice(startIndex, endIndex);
    
    console.log(this.displayedAudios);
  }

  updateDisplayedMedia() {
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

  nextPage() {
    if (this.showFilters && this.selectedMediaType) {
      if (this.selectedMediaType === "image") {
        if (this.currentPage * this.itemsPerPage < this.images.length) {
          this.currentPage++;
          this.updateImageMedia();
          this.displayedMedia = this.displayedImages;
        }
      }
      else if (this.selectedMediaType === "audio") {
        if (this.currentPage * this.itemsPerPage < this.audios.length) {
          this.currentPage++;
          this.updateAudioMedia();
          this.displayedMedia = this.displayedAudios;
        }
      }
    }
    else {
      // Combined view
      if (this.currentPage * this.itemsPerPage < Math.max(this.images.length, this.audios.length) * 2) {
        this.currentPage++;
        this.updateDisplayedMedia();
      }
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;

      if (this.showFilters && this.selectedMediaType) {
        if (this.selectedMediaType === "image") {
          this.updateImageMedia();
          this.displayedMedia = this.displayedImages;
        }
        else if (this.selectedMediaType === "audio") {
          this.updateAudioMedia();
          this.displayedMedia = this.displayedAudios;
        }
      }
      else {
        this.updateDisplayedMedia();
      }
    }
  }

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
    
    // Important: Turn off filters mode and perform a new search
    this.showFilters = false;
    this.onSearch(); // This will fetch both types of media again
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
