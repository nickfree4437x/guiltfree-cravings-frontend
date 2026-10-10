import axios from "axios";

import type {
  AdminCustomer,
  AdminCustomerDetails,
} from "../components/admin/customers/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://guiltfree-cravings-backend.onrender.com/api";

/*
 * =========================================================
 * RESPONSE TYPES
 * =========================================================
 */

interface AdminCustomersResponse {
  success: boolean;
  message?: string;

  data: {
    customers: AdminCustomer[];
  };
}

interface AdminCustomerDetailsResponse {
  success: boolean;
  message?: string;

  data: {
    customer: AdminCustomerDetails;
  };
}

/*
 * =========================================================
 * GET ALL CUSTOMERS
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

/*
 * =========================================================
 * GET CUSTOMER BY ID
 * =========================================================
 */

export const getAdminCustomerById =
  async (
    id: number
  ): Promise<AdminCustomerDetails> => {
    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      throw new Error(
        "Invalid customer ID."
      );
    }

    const token =
      localStorage.getItem(
        "guiltfree_admin_token"
      );

    const response =
      await axios.get<AdminCustomerDetailsResponse>(
        `${API_BASE_URL}/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    if (
      !response.data.success ||
      !response.data.data?.customer
    ) {
      throw new Error(
        response.data.message ||
          "Unable to load customer details."
      );
    }

    return response.data.data.customer;
  };