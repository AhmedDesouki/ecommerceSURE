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

// Inside ApiService class
getProducts(): Observable<any> {
  const endpoint = `${this.apiUrl}/api/Products`;
  return this.http.get(endpoint).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('ApiService.getProducts() error:', error);
      // Return sample data for development
      return this.getSampleProducts();
    })
  );
}

getProductsByCategory(categoryId: string): Observable<any> {
  const endpoint = `${this.apiUrl}/api/Products/${categoryId}`;
  return this.http.get(endpoint).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('ApiService.getProductsByCategory() error:', error);
      // Return sample data for development
      return this.getSampleProductsByCategory(categoryId);
    })
  );
}




getProductById(productId: number): Observable<any> {
  const endpoint = `${this.apiUrl}/api/Products/${productId}`;
  console.log('ApiService.getProductById() called, endpoint:', endpoint);

  return this.http.get(endpoint).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('ApiService.getProductById() error:', error);
      // Return sample data for development
      return this.getSampleProductById(productId);
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
    const endpoint = `${this.apiUrl}/api/categories`;
    console.log('ApiService.getCategories() called, endpoint:', endpoint);

    return this.http.get(endpoint).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('ApiService.getCategories() error:', error);
        // Return sample data for development
        return this.getSampleCategories();
      })
    );
  }

// Cart API methods
addToCart(cartData: any): Observable<any> {
  const endpoint = `${this.apiUrl}/api/Cart`;
  const headers = this.getAuthHeaders();
  console.log('ApiService.addToCart() called, endpoint:', endpoint);

  return this.http.post(endpoint, cartData, { headers }).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('ApiService.addToCart() error:', error);
      return throwError(() => error);
    })
  );
}

getCartItems(): Observable<any> {
  const endpoint = `${this.apiUrl}/api/Cart`;
  const headers = this.getAuthHeaders();
  console.log('ApiService.getCartItems() called, endpoint:', endpoint);

  return this.http.get(endpoint, { headers }).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('ApiService.getCartItems() error:', error);
      return throwError(() => error);
    })
  );
}

updateCartItem(itemId: number, quantity: number): Observable<any> {
  const endpoint = `${this.apiUrl}/api/Cart/${itemId}`;
  const headers = this.getAuthHeaders();
  console.log('ApiService.updateCartItem() called, endpoint:', endpoint);

  return this.http.put(endpoint, { quantity }, { headers }).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('ApiService.updateCartItem() error:', error);
      return throwError(() => error);
    })
  );
}

removeFromCart(itemId: number): Observable<any> {
  const endpoint = `${this.apiUrl}/api/Cart/${itemId}`;
  const headers = this.getAuthHeaders();
  console.log('ApiService.removeFromCart() called, endpoint:', endpoint);

  return this.http.delete(endpoint, { headers }).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('ApiService.removeFromCart() error:', error);
      return throwError(() => error);
    })
  );
}

// Sample data methods for development
private getSampleProducts(): Observable<any> {
  const sampleProducts = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation and long battery life.',
      price: 99.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center',
      categoryId: 1,
      categoryName: 'Electronics',
      stockQuantity: 45,
      brand: 'AudioTech'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      description: 'Advanced fitness tracking with heart rate monitor and GPS.',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&crop=center',
      categoryId: 1,
      categoryName: 'Electronics',
      stockQuantity: 23,
      brand: 'FitTech'
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      description: 'Comfortable and eco-friendly cotton t-shirt available in multiple colors.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop&crop=center',
      categoryId: 2,
      categoryName: 'Clothing',
      stockQuantity: 67,
      brand: 'EcoWear'
    },
    {
      id: 4,
      name: 'Stainless Steel Water Bottle',
      description: 'Insulated water bottle that keeps drinks cold for 24 hours.',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop&crop=center',
      categoryId: 3,
      categoryName: 'Home & Garden',
      stockQuantity: 89,
      brand: 'HydraTech'
    },
    {
      id: 5,
      name: 'Wireless Gaming Mouse',
      description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop&crop=center',
      categoryId: 1,
      categoryName: 'Electronics',
      stockQuantity: 34,
      brand: 'GameTech'
    },
    {
      id: 6,
      name: 'Leather Crossbody Bag',
      description: 'Stylish and practical leather bag perfect for everyday use.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop&crop=center',
      categoryId: 2,
      categoryName: 'Clothing',
      stockQuantity: 28,
      brand: 'LeatherCraft'
    }
  ];

  return new Observable(observer => {
    setTimeout(() => {
      observer.next({
        products: sampleProducts,
        totalCount: sampleProducts.length,
        pageSize: 20,
        pageNumber: 1
      });
      observer.complete();
    }, 500); // Simulate network delay
  });
}

private getSampleProductsByCategory(categoryId: string): Observable<any> {
  const allProducts = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation and long battery life.',
      price: 99.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center',
      categoryId: 1,
      categoryName: 'Electronics',
      stockQuantity: 45,
      brand: 'AudioTech'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      description: 'Advanced fitness tracking with heart rate monitor and GPS.',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&crop=center',
      categoryId: 1,
      categoryName: 'Electronics',
      stockQuantity: 23,
      brand: 'FitTech'
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      description: 'Comfortable and eco-friendly cotton t-shirt available in multiple colors.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop&crop=center',
      categoryId: 2,
      categoryName: 'Clothing',
      stockQuantity: 67,
      brand: 'EcoWear'
    },
    {
      id: 4,
      name: 'Stainless Steel Water Bottle',
      description: 'Insulated water bottle that keeps drinks cold for 24 hours.',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop&crop=center',
      categoryId: 3,
      categoryName: 'Home & Garden',
      stockQuantity: 89,
      brand: 'HydraTech'
    },
    {
      id: 5,
      name: 'Wireless Gaming Mouse',
      description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop&crop=center',
      categoryId: 1,
      categoryName: 'Electronics',
      stockQuantity: 34,
      brand: 'GameTech'
    },
    {
      id: 6,
      name: 'Leather Crossbody Bag',
      description: 'Stylish and practical leather bag perfect for everyday use.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop&crop=center',
      categoryId: 2,
      categoryName: 'Clothing',
      stockQuantity: 28,
      brand: 'LeatherCraft'
    }
  ];

  const filteredProducts = allProducts.filter(product =>
    product.categoryId.toString() === categoryId
  );

  return new Observable(observer => {
    setTimeout(() => {
      observer.next({
        products: filteredProducts,
        totalCount: filteredProducts.length,
        pageSize: 20,
        pageNumber: 1
      });
      observer.complete();
    }, 500); // Simulate network delay
  });
}

private getSampleCategories(): Observable<any> {
  const sampleCategories = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Latest gadgets and electronic devices including smartphones, laptops, headphones, and smart home technology',
      productCount: 3
    },
    {
      id: 2,
      name: 'Clothing',
      description: 'Fashionable and comfortable clothing items for all seasons and occasions',
      productCount: 2
    },
    {
      id: 3,
      name: 'Home & Garden',
      description: 'Everything you need for your home and garden, from furniture to outdoor equipment',
      productCount: 1
    },
    {
      id: 4,
      name: 'Books',
      description: 'Literature and educational materials for all ages and interests',
      productCount: 0
    },
    {
      id: 5,
      name: 'Sports & Fitness',
      description: 'Equipment and gear for all your sports and fitness activities',
      productCount: 0
    },
    {
      id: 6,
      name: 'Beauty & Personal Care',
      description: 'Premium beauty products and personal care essentials',
      productCount: 0
    }
  ];

  return new Observable(observer => {
    setTimeout(() => {
      observer.next(sampleCategories);
      observer.complete();
    }, 500); // Simulate network delay
  });
}

private getSampleProductById(productId: number): Observable<any> {
  const sampleProducts = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'Experience crystal-clear sound with our premium wireless Bluetooth headphones. Features include active noise cancellation, 30-hour battery life, premium comfort with memory foam ear cushions, and seamless connectivity with all your devices. Perfect for music lovers, professionals, and anyone who values quality audio.',
      price: 99.99,
      originalPrice: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&crop=center',
      categoryId: 1,
      categoryName: 'Electronics',
      stockQuantity: 45,
      brand: 'AudioTech',
      specifications: 'Bluetooth 5.0, 40mm drivers, 20Hz-20kHz frequency response',
      dimensions: '7.5" x 3.2" x 8.1"',
      weight: '0.6 lbs'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      description: 'Track your fitness journey with precision using our advanced smart fitness watch. Monitor heart rate, track workouts, analyze sleep patterns, and stay connected with notifications. Water-resistant design and long battery life make it perfect for active lifestyles.',
      price: 199.99,
      originalPrice: 249.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center',
      categoryId: 1,
      categoryName: 'Electronics',
      stockQuantity: 23,
      brand: 'FitTech',
      specifications: 'GPS, Heart rate monitor, Sleep tracking, Water resistant 5ATM',
      dimensions: '1.4" display, 42mm case',
      weight: '0.1 lbs'
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      description: 'Made from 100% organic cotton, this comfortable t-shirt is perfect for everyday wear. Breathable fabric, classic fit, and available in multiple colors. Ethically produced and environmentally friendly.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center',
      categoryId: 2,
      categoryName: 'Clothing',
      stockQuantity: 67,
      brand: 'EcoWear',
      specifications: '100% Organic Cotton, Machine washable, Pre-shrunk',
      dimensions: 'Sizes: XS, S, M, L, XL, XXL',
      weight: '0.3 lbs'
    },
    {
      id: 4,
      name: 'Stainless Steel Water Bottle',
      description: 'Keep your drinks cold for 24 hours or hot for 12 hours with our premium insulated water bottle. Made from food-grade stainless steel, this bottle is durable, eco-friendly, and perfect for outdoor activities.',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop&crop=center',
      categoryId: 3,
      categoryName: 'Home & Garden',
      stockQuantity: 89,
      brand: 'HydraTech',
      specifications: '32oz capacity, Vacuum insulated, BPA-free',
      dimensions: '3.5" diameter x 11" height',
      weight: '0.8 lbs'
    },
    {
      id: 5,
      name: 'Wireless Gaming Mouse',
      description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons. Features include 25,600 DPI sensor, 7 programmable buttons, and wireless connectivity for lag-free gaming.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop&crop=center',
      categoryId: 1,
      categoryName: 'Electronics',
      stockQuantity: 34,
      brand: 'GameTech',
      specifications: '25,600 DPI, 7 programmable buttons, RGB lighting',
      dimensions: '4.8" x 2.6" x 1.5"',
      weight: '0.2 lbs'
    },
    {
      id: 6,
      name: 'Leather Crossbody Bag',
      description: 'Handcrafted from premium genuine leather, this crossbody bag combines style with functionality. Features include adjustable strap, multiple compartments, and durable construction for everyday use.',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop&crop=center',
      categoryId: 2,
      categoryName: 'Clothing',
      stockQuantity: 28,
      brand: 'LeatherCraft',
      specifications: 'Genuine leather, Adjustable strap, Multiple compartments',
      dimensions: '12" x 8" x 3"',
      weight: '1.2 lbs'
    }
  ];

  const product = sampleProducts.find(p => p.id === productId);

  return new Observable(observer => {
    setTimeout(() => {
      if (product) {
        observer.next(product);
      } else {
        observer.error('Product not found');
      }
      observer.complete();
    }, 500); // Simulate network delay
  });
}

}
