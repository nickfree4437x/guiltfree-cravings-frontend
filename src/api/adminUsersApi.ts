import axios from "axios";

import type {
  AdminCustomer,
  AdminCustomerDetails,
} from "../components/admin/customers/types";

// ─── Config ───────────────────────────────────────────────
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://guiltfreecravings.com/api";

const ADMIN_TOKEN_KEY = "guiltfree_admin_token";

// ─── Helpers ──────────────────────────────────────────────
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN_KEY)}`,
  },
});

// ─── Types ────────────────────────────────────────────────
interface AdminCustomersResponse {
  success: boolean;
  message?: string;
  data: { customers: AdminCustomer[] };
}

interface AdminCustomerDetailsResponse {
  success: boolean;
  message?: string;
  data: { customer: AdminCustomerDetails };
}

// ─── API: Get All Customers ───────────────────────────────
export const getAdminCustomers = async (): Promise<AdminCustomer[]> => {
  const response = await axios.get<AdminCustomersResponse>(
    `${API_BASE_URL}/admin/users`,
    getAuthHeaders()
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Unable to load customers.");
  }

  return response.data.data.customers;
};

// ─── API: Get Customer By ID ──────────────────────────────
export const getAdminCustomerById = async (id: number): Promise<AdminCustomerDetails> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid customer ID.");
  }

  const response = await axios.get<AdminCustomerDetailsResponse>(
    `${API_BASE_URL}/admin/users/${id}`,
    getAuthHeaders()
  );

  if (!response.data.success || !response.data.data?.customer) {
    throw new Error(response.data.message || "Unable to load customer details.");
  }

  return response.data.data.customer;
};