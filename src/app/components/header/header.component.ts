import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule,MatIconModule, MatBadgeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentUser$ = this.authService.currentUser$;
  cartItemCount = 0;  

  constructor(public authService: AuthService,  private cartService: CartService, private apiService: ApiService  ) {}

  logout(): void {
    // Call backend to invalidate refresh token, then clear client auth regardless of server result
    this.apiService.logout().subscribe({
      next: () => this.authService.logout(),
      error: () => this.authService.logout()
    });
  }
   ngOnInit() {  
    this.cartService.cartItems$.subscribe(items => {  
      this.cartItemCount = this.cartService.getCartItemCount();  
    });  
  }  
  getUserInitials(): string {
    const user = this.authService.getCurrentUser();
    if (user && user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  }

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.name : 'User';
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}