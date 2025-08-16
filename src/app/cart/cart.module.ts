import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CartPageComponent } from './pages/cart-page.component';
import { CartService } from './services/cart.service';

@NgModule({
  declarations: [
    CartPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [CartService]
})
export class CartModule { }
