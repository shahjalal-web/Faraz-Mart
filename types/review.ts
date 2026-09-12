export interface Testimonial {
  id: string;
  customerName: string;
  avatar: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  date: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  avatar: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  date: string;
}

export interface RatingDistribution {
  average: number;
  total: number;
  counts: Record<1 | 2 | 3 | 4 | 5, number>;
}
