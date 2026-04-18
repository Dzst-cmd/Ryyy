export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviewsCount: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type StoreCategory = 'الكل' | 'إلكترونيات' | 'أزياء' | 'منزل' | 'جمال';
