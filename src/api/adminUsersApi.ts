import axios from "axios";

import type {
  AdminCustomer,
  AdminCustomerDetails,
} from "../components/admin/customers/types";

// ─── Config ───────────────────────────────────────────────
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const ADMIN_TOKEN_KEY = "guiltfree_admin_token";

// ─── Helpers ──────────────────────────────────────────────
const getAuthHeaders = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// ─── Response Types ───────────────────────────────────────
interface AdminCustomersResponse {
  success: boolean;
  message?: string;
  data?: {
    customers: AdminCustomer[];
  };
}

interface AdminCustomerDetailsResponse {
  success: boolean;
  message?: string;
  data?: {
    customer: AdminCustomerDetails;
  };
}

// ─── API: Get All Customers ───────────────────────────────
export const getAdminCustomers = async (): Promise<AdminCustomer[]> => {
  try {
    const response = await axios.get<AdminCustomersResponse>(
      `${API_BASE_URL}/admin/users`,
      getAuthHeaders()
    );

    if (!response.data.success || !response.data.data?.customers) {
      throw new Error(
        response.data.message || "Unable to load customers."
      );
    }

    return response.data.data.customers;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load customers."
      );
    }

    throw error;
  }
};

// ─── API: Get Customer By ID ──────────────────────────────
export const getAdminCustomerById = async (
  id: number
): Promise<AdminCustomerDetails> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid customer ID.");
  }

  try {
    const response = await axios.get<AdminCustomerDetailsResponse>(
      `${API_BASE_URL}/admin/users/${id}`,
      getAuthHeaders()
    );

    const customer = response.data.data?.customer;

    if (!response.data.success || !customer) {
      throw new Error(
        response.data.message || "Unable to load customer details."
      );
    }

    return customer;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load customer details."
      );
    }

    throw error;
  }
};