import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule,
    RouterModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  isLoading = true;
  error: string | null = null;

  // Pagination
  totalCount = 0;
  pageNumber = 1;
  pageSize = 20;
  totalPages = 0;

  searchTerm: string = '';
  categoryFilter: string = '';
  filteredProducts: any[] = [];
  selectedCategoryId: string | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

    ngOnInit(): void {
    this.loadCategories();

    // Listen for category route parameter changes
    this.route.params.subscribe(params => {
      if (params['categoryId']) {
        this.selectedCategoryId = params['categoryId'];
        this.categoryFilter = params['categoryId'];
        this.loadProductsByCategory(params['categoryId']);
      } else {
        this.loadProducts();
      }
    });
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.apiService.getProducts().subscribe({
      next: (response) => {
        this.products = response.products || response;
        this.totalCount = response.totalCount || this.products.length;
        this.pageSize = response.pageSize || 20;
        this.pageNumber = response.pageNumber || 1;
        this.filterProducts();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.isLoading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  loadProductsByCategory(categoryId: string): void {
    this.isLoading = true;
    this.apiService.getProductsByCategory(categoryId).subscribe({
      next: (response) => {
        this.products = response.products || response;
        this.totalCount = response.totalCount || this.products.length;
        this.pageSize = response.pageSize || 20;
        this.pageNumber = response.pageNumber || 1;
        this.filterProducts();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products for this category';
        this.isLoading = false;
        console.error('Error loading products by category:', err);
      }
    });
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  onCategoryChange(event: any): void {
    this.categoryFilter = event.value;
    this.filterProducts();
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearchTerm = this.searchTerm
        ? product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesCategory = this.categoryFilter
        ? product.categoryId === this.categoryFilter ||
          product.categoryName === this.categoryFilter
        : true;

      return matchesSearchTerm && matchesCategory;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.categoryFilter = '';
    this.selectedCategoryId = null;
    this.filterProducts();
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x250/667eea/ffffff?text=No+Image';
  }

  addToCart(product: any): void {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product);
  }
}
