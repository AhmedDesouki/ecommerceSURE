import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminProductsComponent } from './pages/admin/admin-products/admin-products.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/auth.guard';
import { CartComponent } from './pages/cart/cart.component';  
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'admin/products', 
    component: AdminProductsComponent,
    canActivate: [AdminGuard]
  },
  { path: 'cart', component: CartComponent },  
  { path: 'checkout', component: CheckoutComponent },
  { 
    path: 'profile', 
    component: EditProfileComponent,
    canActivate: [AuthGuard]
  },
  //{ path: 'orders', component: OrdersComponent },
  { path: '**', redirectTo: '' }
];