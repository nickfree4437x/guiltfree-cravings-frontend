import axios from "axios";

/*
 * =========================================================
 * ADMIN API
 * =========================================================
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export interface AdminUser {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;

  data: {
    token: string;
    admin: AdminUser;
  };
}

/*
 * =========================================================
 * ADMIN LOGIN
 * =========================================================
 *
 * POST /api/admin/auth/login
 *
 * Request:
 *
 * {
 *   email: string,
 *   password: string
 * }
 *
 * Response:
 *
 * {
 *   success: true,
 *   message: "...",
 *   data: {
 *     token: "...",
 *     admin: {...}
 *   }
 * }
 */

/* 
 * =========================================================
 * LOGIN
 * =========================================================
 */

export const adminLogin = async (
  email: string,
  password: string
): Promise<AdminLoginResponse["data"]> => {
  const response =
    await axios.post<AdminLoginResponse>(
      `${API_BASE_URL}/admin/auth/login`,
      {
        email: email.trim().toLowerCase(),
        password,
      }
    );

  if (
    !response.data.success ||
    !response.data.data
  ) {
    throw new Error(
      response.data.message ||
        "Admin login failed."
    );
  }

  return response.data.data;
};