export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  thumbnail: string;
  categoryId: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  stock: number;
}

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  thumbnail: string;
  categoryId: string;
  price: number;
  salePrice?: number;
}
