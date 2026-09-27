// src/api/adminApi.ts

import axios from "axios";

/*
 * =========================================================
 * ADMIN API
 * =========================================================
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://guiltfree-cravings-backend.onrender.com/api";


/*
 * =========================================================
 * ERROR MESSAGE EXTRACTOR
 * =========================================================
 *
 * Backend se error different formats mein aa sakta hai:
 *
 * 1. JSON
 *    { message: "Current password is incorrect." }
 *
 * 2. JSON
 *    { error: "Something went wrong." }
 *
 * 3. Express HTML error page
 *    <pre>Error: Current password is incorrect.
 *    at createServiceError(...)
 *    at changeAdminPassword(...)</pre>
 *
 * Frontend ko hamesha sirf clean message chahiye.
 * =========================================================
 */

const extractApiErrorMessage = (
  errorData: unknown,
  fallbackMessage = "Something went wrong."
): string => {

  /*
   * =======================================================
   * JSON RESPONSE
   * =======================================================
   */

  if (
    errorData &&
    typeof errorData === "object"
  ) {
    const data = errorData as {
      message?: unknown;
      error?: unknown;
    };

    if (
      typeof data.message === "string" &&
      data.message.trim()
    ) {
      return data.message.trim();
    }

    if (
      typeof data.error === "string" &&
      data.error.trim()
    ) {
      return data.error.trim();
    }
  }


  /*
   * =======================================================
   * HTML RESPONSE
   * =======================================================
   *
   * Express development error handler generally returns:
   *
   * <html>
   *   ...
   *   <pre>
   *     Error: Current password is incorrect.
   *     at createServiceError(...)
   *     at changeAdminPassword(...)
   *   </pre>
   * </html>
   *
   * We extract only the first meaningful error line.
   * =======================================================
   */

  if (typeof errorData === "string") {
    const html = errorData.trim();

    /*
     * -------------------------------------------------------
     * Try extracting content from <pre>
     * -------------------------------------------------------
     */

    const preMatch = html.match(
      /<pre[^>]*>([\s\S]*?)<\/pre>/i
    );

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

      /*
       * The first line normally contains:
       *
       * Error: Current password is incorrect.
       */

      const firstLine = preContent
        .split("\n")
        .map((line) => line.trim())
        .find(Boolean);

      if (firstLine) {
        return firstLine
          .replace(/^Error:\s*/i, "")
          .trim();
      }
    }


    /*
     * -------------------------------------------------------
     * Fallback HTML parsing
     * -------------------------------------------------------
     */

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

    if (plainText) {
      return plainText
        .replace(/^Error:\s*/i, "")
        .trim();
    }
  }


  /*
   * =======================================================
   * FALLBACK
   * =======================================================
   */

  return fallbackMessage;
};


/*
 * =========================================================
 * AXIOS INSTANCE WITH INTERCEPTORS
 * =========================================================
 */

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


/*
 * =========================================================
 * RESPONSE INTERCEPTOR
 * =========================================================
 *
 * Converts backend errors into clean JavaScript Error
 * objects so frontend components can simply use:
 *
 * error.message
 *
 * Example:
 *
 * Backend:
 * Error: Current password is incorrect.
 * at changeAdminPassword(...)
 *
 * Frontend:
 * Current password is incorrect.
 * =========================================================
 */

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {

    /*
     * =======================================================
     * SERVER RESPONSE ERROR
     * =======================================================
     */

    if (error.response) {
      const errorData =
        error.response.data;

      const errorMessage =
        extractApiErrorMessage(
          errorData,
          "Something went wrong."
        );


      /*
       * Create clean custom error
       */

      const customError =
        new Error(errorMessage);

      customError.name =
        "ApiError";


      /*
       * Keep original response available
       * for debugging if required.
       */

      (
        customError as any
      ).response =
        error.response;

      (
        customError as any
      ).status =
        error.response.status;


      return Promise.reject(
        customError
      );
    }


    /*
     * =======================================================
     * NETWORK ERROR
     * =======================================================
     */

    if (error.request) {
      const networkError =
        new Error(
          "Network error. Please check your internet connection."
        );

      networkError.name =
        "NetworkError";

      return Promise.reject(
        networkError
      );
    }


    /*
     * =======================================================
     * OTHER AXIOS ERRORS
     * =======================================================
     */

    if (error?.message) {
      return Promise.reject(
        error
      );
    }


    /*
     * =======================================================
     * UNKNOWN ERROR
     * =======================================================
     */

    const unknownError =
      new Error(
        "Something went wrong. Please try again."
      );

    unknownError.name =
      "ApiError";

    return Promise.reject(
      unknownError
    );
  }
);


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

export interface ForgotAdminPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyAdminResetOtpResponse {
  success: boolean;
  message: string;
  data: {
    resetToken: string;
    expiresAt: string;
  };
}

export interface ResetAdminPasswordResponse {
  success: boolean;
  message: string;
}

export interface ChangeAdminPasswordResponse {
  success: boolean;
  message: string;
}


/*
 * =========================================================
 * ADMIN LOGIN
 * =========================================================
 */

export const adminLogin = async (
  email: string,
  password: string
): Promise<
  AdminLoginResponse["data"]
> => {

  try {
    const response =
      await axiosInstance.post<AdminLoginResponse>(
        "/admin/auth/login",
        {
          email:
            email
              .trim()
              .toLowerCase(),
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

  } catch (error: any) {

    console.error(
      "Admin login API error:",
      error
    );

    throw error;
  }
};


/*
 * =========================================================
 * FORGOT ADMIN PASSWORD
 * =========================================================
 */

export const forgotAdminPassword = async (
  email: string
): Promise<
  ForgotAdminPasswordResponse
> => {

  try {
    const response =
      await axiosInstance.post<ForgotAdminPasswordResponse>(
        "/admin/auth/forgot-password",
        {
          email:
            email
              .trim()
              .toLowerCase(),
        }
      );


    if (
      !response.data.success
    ) {
      throw new Error(
        response.data.message ||
          "Unable to send password reset OTP."
      );
    }


    return response.data;

  } catch (error: any) {

    console.error(
      "Forgot password API error:",
      error
    );

    throw error;
  }
};


/*
 * =========================================================
 * VERIFY ADMIN RESET OTP
 * =========================================================
 */

export const verifyAdminResetOtp = async (
  email: string,
  otp: string
): Promise<
  VerifyAdminResetOtpResponse["data"]
> => {

  try {
    const response =
      await axiosInstance.post<VerifyAdminResetOtpResponse>(
        "/admin/auth/verify-reset-otp",
        {
          email:
            email
              .trim()
              .toLowerCase(),

          otp:
            otp.trim(),
        }
      );


    if (
      !response.data.success ||
      !response.data.data
    ) {
      throw new Error(
        response.data.message ||
          "Invalid password reset OTP."
      );
    }


    return response.data.data;

  } catch (error: any) {

    console.error(
      "Verify OTP API error:",
      error
    );

    throw error;
  }
};


/*
 * =========================================================
 * RESET ADMIN PASSWORD
 * =========================================================
 */

export const resetAdminPassword = async (
  email: string,
  resetToken: string,
  newPassword: string
): Promise<
  ResetAdminPasswordResponse
> => {

  try {
    const response =
      await axiosInstance.post<ResetAdminPasswordResponse>(
        "/admin/auth/reset-password",
        {
          email:
            email
              .trim()
              .toLowerCase(),

          resetToken,

          newPassword,
        }
      );


    if (
      !response.data.success
    ) {
      throw new Error(
        response.data.message ||
          "Unable to reset admin password."
      );
    }


    return response.data;

  } catch (error: any) {

    console.error(
      "Reset password API error:",
      error
    );

    throw error;
  }
};


/*
 * =========================================================
 * CHANGE ADMIN PASSWORD
 * =========================================================
 *
 * Protected endpoint.
 *
 * Sends the currently logged-in admin's JWT
 * through the Authorization header.
 * =========================================================
 */

export const changeAdminPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<
  ChangeAdminPasswordResponse
> => {

  try {

    /*
     * =======================================================
     * GET ADMIN ACCESS TOKEN
     * =======================================================
     */

    const token =
      localStorage.getItem(
        "guiltfree_admin_token"
      );


    if (!token) {
      throw new Error(
        "Admin authentication is required."
      );
    }


    /*
     * =======================================================
     * CHANGE PASSWORD REQUEST
     * =======================================================
     */

    const response =
      await axiosInstance.post<ChangeAdminPasswordResponse>(
        "/admin/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    /*
     * =======================================================
     * VALIDATE RESPONSE
     * =======================================================
     */

    if (
      !response.data.success
    ) {
      throw new Error(
        response.data.message ||
          "Unable to change admin password."
      );
    }


    return response.data;

  } catch (error: any) {

    console.error(
      "Change password API error:",
      error
    );

    throw error;
  }
};