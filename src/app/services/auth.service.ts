import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
}

// Updated to match your API response
export interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;          // Changed from number to string (UUID)
    fullName: string;    // Changed from name to fullName
    email: string;
  };
  roles: string[];       // Added roles array
  message: string;
}

// Updated User interface
export interface User {
  id: string;           // Changed from number to string (UUID)
  email: string;
  name: string;         // We'll map fullName to name internally
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'user_data';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    this.loadStoredUser();
    
  }

  private loadStoredUser(): void {
    const userData = localStorage.getItem(this.userKey);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuthData();
      }
    }
  }

  // Updated to handle your API response structure
  setAuthData(response: AuthResponse): void {
    // Extract role from JWT token
    const role = this.extractRoleFromToken(response.token);
    
    // Map API response to internal User structure
    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.fullName, // Map fullName to name
      role: role || 'user' // Default to 'user' if role not found
    };

    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Helper method to extract role from JWT token
  private extractRoleFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // The role claim key from your JWT
      return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  }



  
  login(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.router.navigate(['/']);
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role?.toLowerCase() === 'admin';
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role?.toLowerCase() === 'user';
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role?.toLowerCase() === role.toLowerCase();
  }

  // Updated demo login methods
  demoLoginAsAdmin(): void {
    const adminUser: User = {
      id: 'bde0cbaa-737e-487f-bded-c1ae22dae18b',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'Admin'
    };
    this.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImJkZTBjYmFhLTczN2UtNDg3Zi1iZGVkLWMxYWUyMmRhZTE4YiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFkbWluQGV4YW1wbGUuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IkFkbWluIFVzZXIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTc1NTM5MzQ5NiwiaXNzIjoiU1VSRV9TdG9yZV9BUEkiLCJhdWQiOiJTVVJFX1N0b3JlX1VzZXJzIn0.Kep60eQ27pl9WQe99yKkUtvXSJEhV1DjUMkf1sa0RbA', adminUser);
  }

  demoLoginAsUser(): void {
    const regularUser: User = {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user'
    };
    this.login('demo-user-token', regularUser);
  }

  // Profile update methods
  updateUserProfile(updatedUser: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem(this.userKey, JSON.stringify(updatedUserData));
      this.currentUserSubject.next(updatedUserData);
    }
  }

  updateUserEmail(newEmail: string): void {
    this.updateUserProfile({ email: newEmail });
  }

  updateUserName(newName: string): void {
    this.updateUserProfile({ name: newName });
  }

  
}