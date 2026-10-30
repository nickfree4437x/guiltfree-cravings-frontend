// src/components/admin/products/types.ts

export interface ProductVariant {
  id: number;
  productId?: number;
  quantity: number;
  unit: string;
  packaging: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProduct {
  id: number;

  name: string;
  description: string;

  image: string;
  images: string[];

  regularImages: string[];
  glassJarImages: string[];
  cardboardBoxImages: string[];

  glassJarImage: string | null;
  cardboardBoxImage: string | null;

  ingredients: string | null;
  allergenInfo: string | null;
  medicalDisclaimer: string | null;
  benefits: string | null;
  usageSuggestions: string | null;
  storageInstructions: string | null;
  shelfLife: string | null;

  isActive: boolean;

  variants: ProductVariant[];

  createdAt: string;
  updatedAt: string;
}