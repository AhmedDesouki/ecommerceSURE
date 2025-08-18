import { Injectable } from '@angular/core';  
import { BehaviorSubject, Observable } from 'rxjs';  
  
export interface CartItem {  
  id: number;  
  productId: number;  
  productName: string;  
  price: number;  
  quantity: number;  
  imageUrl: string;  
}  
  
@Injectable({  
  providedIn: 'root'  
})  
export class CartService {  
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);  
  public cartItems$ = this.cartItemsSubject.asObservable();  
    
  private cartItems: CartItem[] = [];  
  
  constructor() {  
    // Load cart from localStorage on service initialization  
    this.loadCartFromStorage();  
  }  
  
  addToCart(product: any, quantity: number = 1): void {  
    const existingItem = this.cartItems.find(item => item.productId === product.id);  
      
    if (existingItem) {  
      existingItem.quantity += quantity;  
    } else {  
      const newItem: CartItem = {  
        id: Date.now(), // Simple ID generation  
        productId: product.id,  
        productName: product.name,  
        price: product.price,  
        quantity: quantity,  
        imageUrl: product.imageUrl  
      };  
      this.cartItems.push(newItem);  
    }  
      
    this.updateCart();  
  }  
  
  removeFromCart(productId: number): void {  
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);  
    this.updateCart();  
  }  
  
  updateQuantity(productId: number, quantity: number): void {  
    const item = this.cartItems.find(item => item.productId === productId);  
    if (item) {  
      if (quantity <= 0) {  
        this.removeFromCart(productId);  
      } else {  
        item.quantity = quantity;  
        this.updateCart();  
      }  
    }  
  }  
  
  clearCart(): void {  
    this.cartItems = [];  
    this.updateCart();  
  }  
  
  getCartTotal(): number {  
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);  
  }  
  
  getCartItemCount(): number {  
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);  
  }  
  
  private updateCart(): void {  
    this.cartItemsSubject.next([...this.cartItems]);  
    this.saveCartToStorage();  
  }  
  
  private loadCartFromStorage(): void {  
    const savedCart = localStorage.getItem('cart');  
    if (savedCart) {  
      this.cartItems = JSON.parse(savedCart);  
      this.cartItemsSubject.next([...this.cartItems]);  
    }  
  }  
  
  private saveCartToStorage(): void {  
    localStorage.setItem('cart', JSON.stringify(this.cartItems));  
  }  
}