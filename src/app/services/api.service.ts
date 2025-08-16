import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('ApiService constructor called, apiUrl:', this.apiUrl);
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
}