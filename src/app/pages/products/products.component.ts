import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  allProducts: any[] = []; // Store all products for filtering
  categories: any[] = [];
  isLoading = true;
  error: string | null = null;
  
  // Search and Filter
  searchControl = new FormControl('');
  selectedCategory = new FormControl('');
  selectedCategories: string[] = [];
  
  // Pagination
  totalCount = 0;
  pageNumber = 1;
  pageSize = 20;
  totalPages = 0;

  // Search debounce
  private searchSubject = new Subject<string>();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.setupSearchListener();
    this.loadCategories();
    this.loadProducts();
  }

  private setupSearchListener() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.applyFilters();
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.apiService.getProducts().subscribe({
      next: (response) => {
        console.log('Products response:', response);
        this.allProducts = response.products || response;
        this.totalCount = this.allProducts.length;
        this.pageNumber = 1;
        this.pageSize = 20;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        
        // If categories are still empty, try to extract from products
        if (this.categories.length === 0 && this.allProducts.length > 0) {
          const uniqueCategories = [...new Set(this.allProducts.map(p => p.categoryName).filter(Boolean))];
          this.categories = uniqueCategories;
          console.log('Extracted categories from products in loadProducts:', this.categories);
        }
        
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.error = 'Failed to load products';
        this.isLoading = false;
      }
    });
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        console.log('Categories response:', response);
        this.categories = response || [];
        
        // If no categories from API, try to extract from products
        if (this.categories.length === 0 && this.allProducts.length > 0) {
          const uniqueCategories = [...new Set(this.allProducts.map(p => p.categoryName).filter(Boolean))];
          this.categories = uniqueCategories;
          console.log('Extracted categories from products:', this.categories);
        }
        
        // Fallback categories if still empty
        if (this.categories.length === 0) {
          this.categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
          console.log('Using fallback categories:', this.categories);
        }
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        // Fallback categories on error
        this.categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
        console.log('Using fallback categories due to error:', this.categories);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  // Search and Filter Methods
  onSearchChange() {
    this.searchSubject.next(this.searchControl.value || '');
  }

  onCategoryChange() {
    this.applyFilters();
  }

  toggleCategory(category: string) {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.applyFilters();
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.selectedCategories = [];
    this.selectedCategory.setValue('');
    this.applyFilters();
  }

  private applyFilters() {
    let filteredProducts = [...this.allProducts];

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase().trim();
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (this.selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        this.selectedCategories.includes(product.categoryName)
      );
    }

    this.products = filteredProducts;
    this.totalCount = this.products.length;
    this.pageNumber = 1;
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
  }

  private updatePagination() {
    // This method is called when pagination changes
    // The actual pagination is handled by the getter
  }

  get paginatedProducts() {
    const startIndex = (this.pageNumber - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.products.slice(startIndex, endIndex);
  }

  // Make Math available in template
  Math = Math;

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x250/667eea/ffffff?text=No+Image';
  }
}