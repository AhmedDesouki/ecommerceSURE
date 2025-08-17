import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentUser$ = this.authService.currentUser$;

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
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