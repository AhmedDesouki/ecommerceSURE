import { Component, OnInit } from '@angular/core';  
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';  
import { MatCardModule } from '@angular/material/card';  
import { MatButtonModule } from '@angular/material/button';  
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  
import { MatSnackBar } from '@angular/material/snack-bar';  
import { ApiService } from '../../services/api.service';  
import { CartService } from '../../services/cart.service';  
import { AuthService } from '../../services/auth.service';  
  
@Component({  
  selector: 'app-home',  
  standalone: true,  
  imports: [  
    CommonModule,  
    RouterModule,  
    MatCardModule,  
    MatButtonModule,  
    MatProgressSpinnerModule  
  ],  
  templateUrl: './home.component.html',  
  styleUrls: ['./home.component.css']  
})  
export class HomeComponent implements OnInit {  
  products: any[] = [];  
  isLoading = false;  
  error = '';  
  
  constructor(  
    private apiService: ApiService,  
    private cartService: CartService,  
    private authService: AuthService,  
    private snackBar: MatSnackBar  
  ) {}  
  
  ngOnInit() {  
    this.loadProducts();  
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
        this.error = 'Failed to load products';  
        this.isLoading = false;  
      }  
    });  
  }  
  
  addToCart(product: any) {  
    if (this.authService.isAuthenticated()) {  
      const cartData = {  
        productId: product.id,  
        quantity: 1  
      };  
        
      this.apiService.addToCart(cartData).subscribe({  
        next: (response) => {  
          this.cartService.addToCart(product, 1);  
          this.snackBar.open(`${product.name} added to cart!`, 'Close', { duration: 3000 });  
        },  
        error: (err) => {  
          console.error('Error adding to cart:', err);  
          this.cartService.addToCart(product, 1);  
          this.snackBar.open(`${product.name} added to cart!`, 'Close', { duration: 3000 });  
        }  
      });  
    } else {  
      this.cartService.addToCart(product, 1);  
      this.snackBar.open(`${product.name} added to cart!`, 'Close', { duration: 3000 });  
    }  
  }  
  
  onImageError(event: any) {  
    event.target.src = 'assets/images/placeholder-product.jpg';  
  }  
}