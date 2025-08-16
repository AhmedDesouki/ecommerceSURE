import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart.models';

@Component({
  standalone: true,
  selector: 'app-cart-page',
  imports: [CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  constructor(private cartService: CartService) { }

  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  items = signal<CartItem[]>([]);
  total = signal<number>(0);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.loading.set(true);
    this.error.set(null);
    this.cartService.getCart().subscribe({
      next: res => {
        this.items.set(res.items || []);
        this.total.set(res.total || 0);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(this.extractError(err));
        this.loading.set(false);
      }
    });
  }

  inc(item: CartItem) {
    this.update(item, item.quantity + 1);
  }

  dec(item: CartItem) {
    if (item.quantity > 1) this.update(item, item.quantity - 1);
  }

  onQtyChange(item: CartItem, value: string) {
    const q = Number(value);
    if (!Number.isFinite(q) || q < 1) return;
    this.update(item, q);
  }

  update(item: CartItem, quantity: number) {
    this.loading.set(true);
    this.cartService.updateQuantity(item.id, quantity).subscribe({
      next: () => this.loadCart(),
      error: err => {
        alert(this.extractError(err));
        this.loading.set(false);
      }
    });
  }

  remove(item: CartItem) {
    if (!confirm('Remove this item?')) return;
    this.loading.set(true);
    this.cartService.removeItem(item.id).subscribe({
      next: () => this.loadCart(),
      error: err => {
        alert(this.extractError(err));
        this.loading.set(false);
      }
    });
  }

  extractError(err: any): string {
    return typeof err?.error === 'string'
      ? err.error
      : err?.error?.message ?? 'Something went wrong';
  }

  trackById = (_: number, it: CartItem) => it.id;
}
