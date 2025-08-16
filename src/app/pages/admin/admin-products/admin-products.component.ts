import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  isLoading = false;
  showAddForm = false;
  editingProduct: any = null;
  
  productForm: FormGroup;
  
  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'stock', 'actions'];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.isLoading = true;
    this.apiService.getProducts().subscribe({
      next: (response) => {
        this.products = response.products || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
        this.snackBar.open('Failed to load products', 'Close', { duration: 3000 });
      }
    });
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categories = response || [];
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
      }
    });
  }

  showAddProductForm() {
    this.showAddForm = true;
    this.editingProduct = null;
    this.productForm.reset();
  }

  showEditProductForm(product: any) {
    this.editingProduct = product;
    this.showAddForm = true;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId
    });
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingProduct = null;
    this.productForm.reset();
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      
      if (this.editingProduct) {
        // Update existing product
        this.apiService.updateProduct(this.editingProduct.id, productData).subscribe({
          next: (response) => {
            this.snackBar.open('Product updated successfully!', 'Close', { duration: 3000 });
            this.loadProducts();
            this.cancelForm();
          },
          error: (err) => {
            console.error('Error updating product:', err);
            this.snackBar.open('Failed to update product', 'Close', { duration: 3000 });
          }
        });
      } else {
        // Create new product
        this.apiService.createProduct(productData).subscribe({
          next: (response) => {
            this.snackBar.open('Product created successfully!', 'Close', { duration: 3000 });
            this.loadProducts();
            this.cancelForm();
          },
          error: (err) => {
            console.error('Error creating product:', err);
            this.snackBar.open('Failed to create product', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteProduct(productId).subscribe({
        next: (response) => {
          this.snackBar.open('Product deleted successfully!', 'Close', { duration: 3000 });
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.snackBar.open('Failed to delete product', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  onImageError(event: Event): void {
    // Handle image loading errors by setting a fallback image
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://via.placeholder.com/50x50/667eea/ffffff?text=No+Image';
    }
  }
}
