// src/api/adminApi.ts

import axios from "axios";

// ─── Config ───────────────────────────────────────────────
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://guiltfreecravings.com/api";

const ADMIN_TOKEN_KEY = "guiltfree_admin_token";

// ─── Helpers ──────────────────────────────────────────────
const normalizeEmail = (email: string) => email.trim().toLowerCase();

// Extract clean message from JSON/HTML/Express errors
const extractApiErrorMessage = (
  errorData: unknown,
  fallbackMessage = "Something went wrong."
): string => {
  // JSON response
  if (errorData && typeof errorData === "object") {
    const data = errorData as { message?: unknown; error?: unknown };
    if (typeof data.message === "string" && data.message.trim()) return data.message.trim();
    if (typeof data.error === "string" && data.error.trim()) return data.error.trim();
  }

  // HTML response (Express dev error page)
  if (typeof errorData === "string") {
    const html = errorData.trim();

    const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
    if (preMatch?.[1]) {
      const preContent = preMatch[1]
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&#39;/gi, "'")
        .replace(/&quot;/gi, '"')
        .replace(/<[^>]+>/g, "")
        .trim();

      const firstLine = preContent.split("\n").map((l) => l.trim()).find(Boolean);
      if (firstLine) return firstLine.replace(/^Error:\s*/i, "").trim();
    }

    // Fallback: strip all HTML
    const plainText = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&#39;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/\s+/g, " ")
      .trim();

    if (plainText) return plainText.replace(/^Error:\s*/i, "").trim();
  }

  return fallbackMessage;
};

// ─── Axios Instance ───────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Response interceptor → converts backend errors into clean Error objects
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Server responded with error
    if (error.response) {
      const errorMessage = extractApiErrorMessage(
        error.response.data,
        "Something went wrong."
      );

      const customError = new Error(errorMessage);
      customError.name = "ApiError";
      (customError as any).response = error.response;
      (customError as any).status = error.response.status;

      return Promise.reject(customError);
    }

    // Network error
    if (error.request) {
      const networkError = new Error(
        "Network error. Please check your internet connection."
      );
      networkError.name = "NetworkError";
      return Promise.reject(networkError);
    }

    // Other axios errors
    if (error?.message) return Promise.reject(error);

    // Unknown
    const unknownError = new Error("Something went wrong. Please try again.");
    unknownError.name = "ApiError";
    return Promise.reject(unknownError);
  }
);

// ─── Types ────────────────────────────────────────────────
export interface AdminUser {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: { token: string; admin: AdminUser };
}

export interface ForgotAdminPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyAdminResetOtpResponse {
  success: boolean;
  message: string;
  data: { resetToken: string; expiresAt: string };
}

export interface ResetAdminPasswordResponse {
  success: boolean;
  message: string;
}

export interface ChangeAdminPasswordResponse {
  success: boolean;
  message: string;
}

// ─── API: Admin Login ─────────────────────────────────────
export const adminLogin = async (
  email: string,
  password: string
): Promise<AdminLoginResponse["data"]> => {
  try {
    const response = await axiosInstance.post<AdminLoginResponse>(
      "/admin/auth/login",
      { email: normalizeEmail(email), password }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Admin login failed.");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Admin login API error:", error);
    throw error;
  }
};

// ─── API: Forgot Admin Password ───────────────────────────
export const forgotAdminPassword = async (
  email: string
): Promise<ForgotAdminPasswordResponse> => {
  try {
    const response = await axiosInstance.post<ForgotAdminPasswordResponse>(
      "/admin/auth/forgot-password",
      { email: normalizeEmail(email) }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Unable to send password reset OTP.");
    }

    return response.data;
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    throw error;
  }
};

// ─── API: Verify Admin Reset OTP ──────────────────────────
export const verifyAdminResetOtp = async (
  email: string,
  otp: string
): Promise<VerifyAdminResetOtpResponse["data"]> => {
  try {
    const response = await axiosInstance.post<VerifyAdminResetOtpResponse>(
      "/admin/auth/verify-reset-otp",
      { email: normalizeEmail(email), otp: otp.trim() }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Invalid password reset OTP.");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("Verify OTP API error:", error);
    throw error;
  }
};

// ─── API: Reset Admin Password ────────────────────────────
export const resetAdminPassword = async (
  email: string,
  resetToken: string,
  newPassword: string
): Promise<ResetAdminPasswordResponse> => {
  try {
    const response = await axiosInstance.post<ResetAdminPasswordResponse>(
      "/admin/auth/reset-password",
      { email: normalizeEmail(email), resetToken, newPassword }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Unable to reset admin password.");
    }

    return response.data;
  } catch (error: any) {
    console.error("Reset password API error:", error);
    throw error;
  }
};

// ─── API: Change Admin Password (protected) ───────────────
export const changeAdminPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ChangeAdminPasswordResponse> => {
  try {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) throw new Error("Admin authentication is required.");

    const response = await axiosInstance.post<ChangeAdminPasswordResponse>(
      "/admin/auth/change-password",
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Unable to change admin password.");
    }

    return response.data;
  } catch (error: any) {
    console.error("Change password API error:", error);
    throw error;
  }
};

// Add to the bottom of src/api/adminApi.ts

// ============================================================
// ADMIN ORDER ISSUES
// ============================================================

export type OrderIssueStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface AdminOrderIssueItem {
  id: number;
  productId: number;
  variantId: number;
  productName: string;
  variantQuantity: number;
  variantUnit: string;
  packaging: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface AdminOrderIssuePayment {
  id: number;
  status: string;
  amount: number;
  createdAt: string;
}

export interface AdminOrderIssueOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  area: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  orderStatus: string;
  paymentStatus: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  createdAt: string;
  items: AdminOrderIssueItem[];
  payments: AdminOrderIssuePayment[];
}

export interface AdminOrderIssue {
  id: number;
  orderId: number;
  orderNumber: string;
  issueType: string;
  message: string;
  status: OrderIssueStatus;
  createdAt: string;
  updatedAt: string;
  order: AdminOrderIssueOrder;
}

export interface AdminOrderIssueStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

export interface AdminOrderIssuePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface AdminOrderIssueApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminOrderIssuesListResponse {
  success: boolean;
  message: string;
  data: AdminOrderIssue[];
  pagination: AdminOrderIssuePagination;
  filters?: {
    search: string | null;
    status: OrderIssueStatus | null;
    issueType: string | null;
    sortOrder: "asc" | "desc";
  };
}

export interface AdminOrderIssuesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderIssueStatus | "";
  issueType?: string;
  sortOrder?: "asc" | "desc";
}

const getAdminAuthHeaders = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  if (!token) {
    throw new Error("Admin authentication is required. Please log in again.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAdminOrderIssueStats = async () => {
  const response = await axiosInstance.get<
    AdminOrderIssueApiResponse<AdminOrderIssueStats>
  >("/admin/order-issues/stats", {
    headers: getAdminAuthHeaders(),
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Unable to load issue statistics.");
  }

  return response.data.data;
};

export const getAdminOrderIssues = async (
  params: AdminOrderIssuesQuery = {}
) => {
  const response = await axiosInstance.get<AdminOrderIssuesListResponse>(
    "/admin/order-issues",
    {
      headers: getAdminAuthHeaders(),
      params,
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Unable to load order issues.");
  }

  return response.data;
};

export const getAdminOrderIssueById = async (id: number) => {
  const response = await axiosInstance.get<
    AdminOrderIssueApiResponse<AdminOrderIssue>
  >(`/admin/order-issues/${id}`, {
    headers: getAdminAuthHeaders(),
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Unable to load issue details.");
  }

  return response.data.data;
};

export const updateAdminOrderIssueStatus = async (
  id: number,
  status: OrderIssueStatus
) => {
  const response = await axiosInstance.patch<
    AdminOrderIssueApiResponse<AdminOrderIssue>
  >(
    `/admin/order-issues/${id}/status`,
    { status },
    {
      headers: getAdminAuthHeaders(),
    }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Unable to update issue status.");
  }

  return response.data.data;
};

/*
 * ============================================================
 * ADMIN ORDER ISSUE CONVERSATION
 * ============================================================
 */

export type OrderIssueMessageSender = "CUSTOMER" | "ADMIN";

export interface AdminOrderIssueMessage {
  id: number;
  issueId: number;
  senderType: OrderIssueMessageSender;
  senderId: number;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderIssueConversation {
  issue: {
    id: number;
    orderNumber: string;
    issueType: string;
    status: OrderIssueStatus;
    createdAt: string;
  };
  messages: AdminOrderIssueMessage[];
}

export interface AdminOrderIssueConversationResponse {
  success: boolean;
  message: string;
  data: AdminOrderIssueConversation;
}

export interface AdminOrderIssueMessageResponse {
  success: boolean;
  message: string;
  data: AdminOrderIssueMessage;
}

/**
 * Fetch conversation messages for an order issue.
 *
 * GET /api/admin/order-issues/:id/messages
 */
export const getAdminOrderIssueMessages = async (
  issueId: number
): Promise<AdminOrderIssueConversation> => {
  if (!Number.isSafeInteger(issueId) || issueId <= 0) {
    throw new Error("Invalid order issue ID.");
  }

  const response =
    await axiosInstance.get<AdminOrderIssueConversationResponse>(
      `/admin/order-issues/${issueId}/messages`,
      {
        headers: getAdminAuthHeaders(),
      }
    );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || "Unable to load conversation."
    );
  }

  return response.data.data;
};

/**
 * Send a reply as the authenticated admin.
 *
 * POST /api/admin/order-issues/:id/messages
 */
export const sendAdminOrderIssueMessage = async (
  issueId: number,
  message: string
): Promise<AdminOrderIssueMessage> => {
  if (!Number.isSafeInteger(issueId) || issueId <= 0) {
    throw new Error("Invalid order issue ID.");
  }

  const normalizedMessage = message.trim();

  if (!normalizedMessage) {
    throw new Error("Please enter a message.");
  }

  if (normalizedMessage.length > 2000) {
    throw new Error("Message cannot exceed 2000 characters.");
  }

  const response =
    await axiosInstance.post<AdminOrderIssueMessageResponse>(
      `/admin/order-issues/${issueId}/messages`,
      {
        message: normalizedMessage,
      },
      {
        headers: getAdminAuthHeaders(),
      }
    );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || "Unable to send reply."
    );
  }

  return response.data.data;
};