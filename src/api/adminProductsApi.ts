import axios from "axios";

import type {
  AdminProduct,
} from "../components/admin/products/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://guiltfree-cravings-backend.onrender.com/api";

/*
 * =========================================================
 * RESPONSE TYPES
 * =========================================================
 */

interface AdminProductsResponse {
  success: boolean;
  message?: string;
  data: {
    products: AdminProduct[];
  };
}

/*
 * =========================================================
 * GET ADMIN PRODUCTS
 * =========================================================
 */

export const getAdminProducts =
  async (): Promise<AdminProduct[]> => {
    const token =
      localStorage.getItem(
        "guiltfree_admin_token"
      );

    const response =
      await axios.get<AdminProductsResponse>(
        `${API_BASE_URL}/admin/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    if (
      !response.data.success ||
      !response.data.data
    ) {
      throw new Error(
        response.data.message ||
          "Unable to load products."
      );
    }

    return response.data.data.products;
  };