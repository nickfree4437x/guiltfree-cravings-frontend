import axios from "axios";

// ─── Types ────────────────────────────────────────────────

export interface ProductVariant {
  id: number;
  productId: number;
  quantity: number;
  unit: string;
  packaging: string;
  price: number;

  // Variant-specific image, primarily for Glass Jar variants.
  image?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;

  // Images
  image: string;
  images: string[];
  regularImages: string[];
  glassJarImages: string[];
  cardboardBoxImages: string[];

  // Legacy packaging images
  glassJarImage: string | null;
  cardboardBoxImage: string | null;

  // Product information / dietary details
  ingredients: string | null;
  allergenInfo: string | null;
  medicalDisclaimer: string | null;
  benefits: string | null;
  usageSuggestions: string | null;
  storageInstructions: string | null;
  shelfLife: string | null;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  variants: ProductVariant[];
}

// ─── API Responses ────────────────────────────────────────

interface ProductsResponse {
  success: boolean;
  count: number;
  data: Product[];
}

interface ProductResponse {
  success: boolean;
  data: Product;
}

// ─── Axios Instance ───────────────────────────────────────

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://guiltfreecravings.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ─── Get All Active Products ──────────────────────────────

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<ProductsResponse>("/products");

  if (!response.data.success) {
    throw new Error("Failed to fetch products.");
  }

  return response.data.data;
};

// ─── Get Product By ID ────────────────────────────────────

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