import axios from "axios";

import type { AdminProduct } from "../components/admin/products/types";

// ─── Configuration ────────────────────────────────────────

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://guiltfreecravings.com/api";

const ADMIN_TOKEN_KEY = "guiltfree_admin_token";

// ─── Response Types ───────────────────────────────────────

interface AdminProductsResponse {
  success: boolean;
  message?: string;
  data?: {
    products: AdminProduct[];
  };
}

interface AdminProductResponse {
  success: boolean;
  message?: string;
  data?: {
    product: AdminProduct;
  };
}

// ─── Authentication Headers ──────────────────────────────

const getAdminHeaders = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  if (!token) {
    throw new Error("Admin session expired. Please log in again.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ─── Get All Products ─────────────────────────────────────

export const getAdminProducts = async (): Promise<AdminProduct[]> => {
  const response = await axios.get<AdminProductsResponse>(
    `${API_BASE_URL}/admin/products`,
    {
      headers: getAdminHeaders(),
    }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || "Unable to load products."
    );
  }

  return response.data.data.products;
};

// ─── Get Product By ID ────────────────────────────────────

export const getAdminProductById = async (
  id: number
): Promise<AdminProduct> => {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid product ID.");
  }

  const response = await axios.get<AdminProductResponse>(
    `${API_BASE_URL}/admin/products/${id}`,
    {
      headers: getAdminHeaders(),
    }
  );

  if (!response.data.success || !response.data.data?.product) {
    throw new Error(
      response.data.message || "Unable to load product details."
    );
  }

  return response.data.data.product;
};