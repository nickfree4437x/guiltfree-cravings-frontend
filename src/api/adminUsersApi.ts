import axios from "axios";

import type {
  AdminCustomer,
} from "../components/admin/customers/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://guiltfree-cravings-backend.onrender.com/api";

/*
 * =========================================================
 * RESPONSE TYPE
 * =========================================================
 */

interface AdminCustomersResponse {
  success: boolean;
  message?: string;

  data: {
    customers: AdminCustomer[];
  };
}

/*
 * =========================================================
 * GET ADMIN CUSTOMERS
 * =========================================================
 */

export const getAdminCustomers =
  async (): Promise<AdminCustomer[]> => {
    const token =
      localStorage.getItem(
        "guiltfree_admin_token"
      );

    const response =
      await axios.get<AdminCustomersResponse>(
        `${API_BASE_URL}/admin/users`,
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
          "Unable to load customers."
      );
    }

    return response.data.data.customers;
  };