import { Routes } from '@angular/router';
import { CartPageComponent } from './cart/pages/cart-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cart', pathMatch: 'full' },
  { path: 'cart', component: CartPageComponent },
];
