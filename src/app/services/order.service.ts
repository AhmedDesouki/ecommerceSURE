import { Injectable } from '@angular/core';  
import { Observable } from 'rxjs';  
import { ApiService } from './api.service';  
  
export interface OrderItem {  
  productId: number;  
  quantity: number;  
}  
  
export interface OrderRequest {  
  orderItems: OrderItem[];  
  shippingAddress: string;  
  shippingCity: string;  
  shippingPostalCode: string;  
  shippingCountry: string;  
  phoneNumber: string;  
  notes: string;  
}  
  
@Injectable({  
  providedIn: 'root'  
})  
export class OrderService {  
  constructor(private apiService: ApiService) {}  
  
  createOrder(orderData: OrderRequest): Observable<any> {  
    return this.apiService.createOrder(orderData);  
  }  
  
  getOrders(): Observable<any> {  
    return this.apiService.getOrders();  
  }  
  
  getOrderById(orderId: number): Observable<any> {  
    return this.apiService.getOrderById(orderId);  
  }  
}