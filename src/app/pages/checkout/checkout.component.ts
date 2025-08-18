import { Component, OnInit } from '@angular/core';  
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';  
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';  
import { MatCardModule } from '@angular/material/card';  
import { MatButtonModule } from '@angular/material/button';  
import { MatFormFieldModule } from '@angular/material/form-field';  
import { MatInputModule } from '@angular/material/input';  
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  
import { MatSnackBar } from '@angular/material/snack-bar';  
import { Router } from '@angular/router';  
import { CartService, CartItem } from '../../services/cart.service';  
import { OrderService, OrderRequest } from '../../services/order.service';  
import { AuthService } from '../../services/auth.service';  
  
@Component({  
  selector: 'app-checkout',  
  standalone: true,  
  imports: [  
    CommonModule,  
    RouterModule,  
    ReactiveFormsModule,  
    MatCardModule,  
    MatButtonModule,  
    MatFormFieldModule,  
    MatInputModule,  
    MatProgressSpinnerModule  
  ],  
  templateUrl: './checkout.component.html',  
  styleUrls: ['./checkout.component.css']  
})  
export class CheckoutComponent implements OnInit {  
  checkoutForm: FormGroup;  
  cartItems: CartItem[] = [];  
  cartTotal = 0;  
  isLoading = false;  
  isSubmitting = false;  
  
  constructor(  
    private fb: FormBuilder,  
    private cartService: CartService,  
    private orderService: OrderService,  
    private authService: AuthService,  
    private router: Router,  
    private snackBar: MatSnackBar  
  ) {  
    this.checkoutForm = this.fb.group({  
      shippingAddress: ['', [Validators.required, Validators.minLength(10)]],  
      shippingCity: ['', [Validators.required, Validators.minLength(2)]],  
      shippingPostalCode: ['', [Validators.required, Validators.minLength(3)]],  
      shippingCountry: ['', [Validators.required, Validators.minLength(2)]],  
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],  
      notes: ['']  
    });  
  }  
  
  ngOnInit() {  
    // Check if user is authenticated  
    if (!this.authService.isAuthenticated()) {  
      this.router.navigate(['/login']);  
      return;  
    }  
  
    // Load cart items  
    this.cartService.cartItems$.subscribe(items => {  
      this.cartItems = items;  
      this.cartTotal = this.cartService.getCartTotal();  
        
      // Redirect to cart if empty  
      if (items.length === 0) {  
        this.router.navigate(['/cart']);  
        this.snackBar.open('Your cart is empty', 'Close', { duration: 3000 });  
      }  
    });  
  }  
  
  onSubmit() {  
    if (this.checkoutForm.valid && this.cartItems.length > 0) {  
      this.isSubmitting = true;  
  
      // Prepare order data according to your API structure  
      const orderData: OrderRequest = {  
        orderItems: this.cartItems.map(item => ({  
          productId: item.productId,  
          quantity: item.quantity  
        })),  
        shippingAddress: this.checkoutForm.value.shippingAddress,  
        shippingCity: this.checkoutForm.value.shippingCity,  
        shippingPostalCode: this.checkoutForm.value.shippingPostalCode,  
        shippingCountry: this.checkoutForm.value.shippingCountry,  
        phoneNumber: this.checkoutForm.value.phoneNumber,  
        notes: this.checkoutForm.value.notes || ''  
      };  
  
      this.orderService.createOrder(orderData).subscribe({  
        next: (response) => {  
          this.snackBar.open('Order placed successfully!', 'Close', { duration: 5000 });  
          this.cartService.clearCart(); // Clear cart after successful order  
          this.router.navigate(['/orders']); // Navigate to orders page  
        },  
        error: (err) => {  
          console.error('Error creating order:', err);  
          this.snackBar.open('Failed to place order. Please try again.', 'Close', { duration: 5000 });  
          this.isSubmitting = false;  
        }  
      });  
    } else {  
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });  
    }  
  }  
  
  goBackToCart() {  
    this.router.navigate(['/cart']);  
  }  
}