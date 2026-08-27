import axios from "axios";

/* =========================================================
   Product Variant
========================================================= */

export interface ProductVariant {
  id: number;
  productId: number;
  quantity: number;
  unit: string;
  packaging: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   Product
========================================================= */

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
}

/* =========================================================
   API Response Types
========================================================= */

interface ProductsResponse {
  success: boolean;
  count: number;
  data: Product[];
}

interface ProductResponse {
  success: boolean;
  data: Product;
}

/* =========================================================
   Axios Instance
========================================================= */

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 10000,
});

/* =========================================================
   Get All Active Products
========================================================= */

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<ProductsResponse>("/products");

  if (!response.data.success) {
    throw new Error("Failed to fetch products.");
  }

  return response.data.data;
};

/* =========================================================
   Get Single Product By ID
========================================================= */

export const getProductById = async (
  id: number
): Promise<Product> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid product ID.");
  }

  const response = await api.get<ProductResponse>(
    `/products/${id}`
  );

  if (!response.data.success) {
    throw new Error("Failed to fetch product.");
  }

  return response.data.data;
};

export default api;