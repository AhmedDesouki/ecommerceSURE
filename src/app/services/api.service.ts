import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginCredentials, AuthResponse } from './auth.service';
import { AuthService } from './auth.service';  

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {  
  console.log('ApiService constructor called, apiUrl:', this.apiUrl);  
}
//helper fun to get header
private getAuthHeaders(): { [key: string]: string } {  
  const token = this.authService.getToken();  
  return token ? { Authorization: `Bearer ${token}` } : {};  
}

  // Authentication methods
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const endpoint = `${this.apiUrl}/api/Auth/login`;
    console.log('ApiService.login() called, endpoint:', endpoint);
    
    return this.http.post<AuthResponse>(endpoint, credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('ApiService.login() error:', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: any): Observable<AuthResponse> {
    const endpoint = `${this.apiUrl}/api/Auth/register`;
    console.log('ApiService.register() called, endpoint:', endpoint);
    
    return this.http.post<AuthResponse>(endpoint, userData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('ApiService.register() error:', error);
        return throwError(() => error);
      })
    );
  }

  refreshToken(token: string): Observable<any> {
    const endpoint = `${this.apiUrl}/api/Auth/refresh`;
    console.log('ApiService.refreshToken() called, endpoint:', endpoint);
    
    return this.http.post(endpoint, { token }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('ApiService.refreshToken() error:', error);
        return throwError(() => error);
      })
    );
  }

  getProducts(): Observable<any> {
    // Fix: Use correct endpoint - controller route is "api/[controller]" which becomes "api/Products"
    const endpoint = `${this.apiUrl}/api/Products`;
    console.log('ApiService.getProducts() called, endpoint:', endpoint);
    
    return this.http.get(endpoint).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('ApiService.getProducts() error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        
        if (error.status === 0) {
          console.error('Network error - CORS issue or backend not accessible');
        } else if (error.status === 404) {
          console.error('Endpoint not found - check the URL');
        }
        
        return throwError(() => error);
      })
    );
  }

  // Admin methods for product management
  createProduct(productData: any): Observable<any> {  
  const endpoint = `${this.apiUrl}/api/Products`;  
  const headers = this.getAuthHeaders();  
  console.log('ApiService.createProduct() called, endpoint:', endpoint);  
    
  return this.http.post(endpoint, productData, { headers }).pipe(  
    catchError((error: HttpErrorResponse) => {  
      console.error('ApiService.createProduct() error:', error);  
      return throwError(() => error);  
    })  
  );  
}

updateProduct(productId: number, productData: any): Observable<any> {  
  const endpoint = `${this.apiUrl}/api/Products/${productId}`;  
  const headers = this.getAuthHeaders();  
  console.log('ApiService.updateProduct() called, endpoint:', endpoint);  
    
  return this.http.put(endpoint, productData, { headers }).pipe(  
    catchError((error: HttpErrorResponse) => {  
      console.error('ApiService.updateProduct() error:', error);  
      return throwError(() => error);  
    })  
  );  
}

  deleteProduct(productId: number): Observable<any> {  
  const endpoint = `${this.apiUrl}/api/Products/${productId}`;  
  const headers = this.getAuthHeaders();  
  console.log('ApiService.deleteProduct() called, endpoint:', endpoint);  
    
  return this.http.delete(endpoint, { headers }).pipe(  
    catchError((error: HttpErrorResponse) => {  
      console.error('ApiService.deleteProduct() error:', error);  
      return throwError(() => error);  
    })  
  );  
}

  getCategories(): Observable<any> {
    const endpoint = `${this.apiUrl}/api/Products/categories`;
    console.log('ApiService.getCategories() called, endpoint:', endpoint);
    
    return this.http.get(endpoint).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('ApiService.getCategories() error:', error);
        return throwError(() => error);
      })
    );
  }
}