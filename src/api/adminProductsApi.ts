import axios from "axios";

import type { AdminProduct } from "../components/admin/products/types";

// ─── Config ───────────────────────────────────────────────
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://guiltfreecravings.com/api";

const ADMIN_TOKEN_KEY = "guiltfree_admin_token";

// ─── Types ────────────────────────────────────────────────
interface AdminProductsResponse {
  success: boolean;
  message?: string;
  data: {
    products: AdminProduct[];
  };
}

// ─── API: Get All Products ────────────────────────────────
export const getAdminProducts = async (): Promise<AdminProduct[]> => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  const response = await axios.get<AdminProductsResponse>(
    `${API_BASE_URL}/admin/products`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Unable to load products.");
  }

  return response.data.data.products;
};