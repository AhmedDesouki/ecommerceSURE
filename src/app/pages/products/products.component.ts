import { Component, OnInit } from '@angular/core';  
import { CommonModule } from '@angular/common';  
import { MatCardModule } from '@angular/material/card';  
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  
import { MatSelectModule } from '@angular/material/select';  
import { MatFormFieldModule } from '@angular/material/form-field';  
import { MatButtonModule } from '@angular/material/button';  
import { MatSnackBar } from '@angular/material/snack-bar';  
import { ApiService } from '../../services/api.service';  
import { CartService } from '../../services/cart.service';  
import { AuthService } from '../../services/auth.service';  
import { FormControl, ReactiveFormsModule } from '@angular/forms';  
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';  
  
@Component({  
  selector: 'app-products',  
  standalone: true,  
  imports: [  
    CommonModule,  
    MatCardModule,  
    MatProgressSpinnerModule,  
    MatSelectModule,  
    MatFormFieldModule,  
    MatButtonModule ,
    ReactiveFormsModule  
  ],  
  templateUrl: './products.component.html',  
  styleUrls: ['./products.component.css']  
})  
export class ProductsComponent implements OnInit {  
  products: any[] = [];  
  categories: any[] = [];  
  selectedCategoryId: number | null = null;  
  isLoading = true;  
  error: string | null = null;  
  totalCount = 0;  
  pageNumber = 1;  
  pageSize = 20;  
  totalPages = 1;  
searchControl = new FormControl('');  
searchTerm: string = '';  
  constructor(  
    private apiService: ApiService,  
    private cartService: CartService,  
    private authService: AuthService,  
    private snackBar: MatSnackBar  
  ) {}  
  
  ngOnInit() {  
    this.loadCategories();  
    this.performSearch();  

      // Setup search functionality with debounce  
  this.searchControl.valueChanges.pipe(  
    debounceTime(300),  
    distinctUntilChanged()  
  ).subscribe(searchTerm => {  
    this.searchTerm = searchTerm || '';  
    this.performSearch();  
  });  
  }  
  performSearch() {  
  this.isLoading = true;  
  this.apiService.searchProducts(this.searchTerm, this.selectedCategoryId || undefined).subscribe({  
    next: (response) => {  
      this.products = response.products || [];  
      this.totalCount = response.totalCount || 0;  
      this.pageNumber = response.pageNumber || 1;  
      this.pageSize = response.pageSize || 20;  
      this.totalPages = response.totalPages || 1;  
      this.isLoading = false;  
    },  
    error: (err) => {  
      this.error = 'Failed to search products';  
      this.isLoading = false;  
      console.error('Error searching products:', err);  
    }  
  });  
}  

// Add clear search method  
clearSearch() {  
  this.searchControl.setValue('');  
  this.searchTerm = '';  
  this.performSearch();  
}
  loadCategories() {  
    this.apiService.getCategories().subscribe({  
      next: (response) => {  
        this.categories = response || [];  
      },  
      error: (err) => {  
        console.error('Error loading categories:', err);  
      }  
    });  
  }  
  
  loadProducts(categoryId?: number) {  
    this.selectedCategoryId = categoryId || null;  
    this.performSearch();  
  }  
  
  onCategoryChange(categoryId: number | null) {  
    this.selectedCategoryId = categoryId;  
    this.performSearch();  
  }  
  
  addToCart(product: any) {  
    this.cartService.addToCart(product, 1);  
    this.snackBar.open(`${product.name} added to cart!`, 'Close', { duration: 3000 });  
  }  
  
  onImageError(event: Event): void {  
    const img = event.target as HTMLImageElement;  
    img.src = 'https://via.placeholder.com/300x250/667eea/ffffff?text=No+Image';  
  }  
}