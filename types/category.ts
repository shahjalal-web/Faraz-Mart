export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string | null;
  productCount: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
}
