export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subTotal: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateQuantityRequest {
  quantity: number;
}
