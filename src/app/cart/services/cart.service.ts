import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CartResponse, AddToCartRequest, UpdateQuantityRequest } from '../models/cart.models';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Cart`;

  // 🟢 لو عندك JWT حطيه في localStorage بعد الـ Login
  private getHeaders() {
    const token = localStorage.getItem('token');
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.baseUrl, this.getHeaders()).pipe(
      map(res => ({
        items: res.items ?? [],
        total: res.total ?? 0
      }))
    );
  }

  addToCart(productId: number, quantity: number) {
    const body: AddToCartRequest = { productId, quantity };
    return this.http.post<{ message: string }>(this.baseUrl, body, this.getHeaders());
  }

  updateQuantity(itemId: number, quantity: number) {
    const body: UpdateQuantityRequest = { quantity };
    return this.http.put<{ message: string }>(`${this.baseUrl}/${itemId}`, body, this.getHeaders());
  }

  removeItem(itemId: number) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${itemId}`, this.getHeaders());
  }
}
