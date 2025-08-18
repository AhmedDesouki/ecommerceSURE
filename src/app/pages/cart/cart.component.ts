import { Component, OnInit } from '@angular/core';  
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';  
import { MatCardModule } from '@angular/material/card';  
import { MatButtonModule } from '@angular/material/button';  
import { MatIconModule } from '@angular/material/icon';  
import { MatInputModule } from '@angular/material/input';  
import { CartService, CartItem } from '../../services/cart.service';  
import { Observable } from 'rxjs';  
  
@Component({  
  selector: 'app-cart',  
  standalone: true,  
  imports: [  
    CommonModule,  
    RouterModule,  
    MatCardModule,  
    MatButtonModule,  
    MatIconModule,  
    MatInputModule  
  ],  
  templateUrl: './cart.component.html',  
  styleUrls: ['./cart.component.css']  
})  
export class CartComponent implements OnInit {  
  cartItems$: Observable<CartItem[]>;  
  cartTotal = 0;  
  cartItemCount = 0;  
  
  constructor(private cartService: CartService) {  
    this.cartItems$ = this.cartService.cartItems$;  
  }  
  
  ngOnInit() {  
    this.cartItems$.subscribe(items => {  
      this.cartTotal = this.cartService.getCartTotal();  
      this.cartItemCount = this.cartService.getCartItemCount();  
    });  
  }  
  
  updateQuantity(productId: number, quantity: number) {  
    this.cartService.updateQuantity(productId, quantity);  
  }  
  
  removeItem(productId: number) {  
    this.cartService.removeFromCart(productId);  
  }  
  
  clearCart() {  
    this.cartService.clearCart();  
  }  
}