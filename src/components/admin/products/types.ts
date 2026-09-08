// src/components/admin/products/types.ts

/*
 * =========================================================
 * PRODUCT TYPES
 * =========================================================
 */

export interface ProductVariant {
  id: number;
  quantity: number;
  unit: string;
  packaging: string;
  price: number;
}

export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  glassJarImage?: string | null;
  isActive: boolean;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}