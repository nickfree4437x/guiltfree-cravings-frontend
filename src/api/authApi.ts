import axios from "axios";

/*
 * =========================================================
 * AUTH USER
 * =========================================================
 */

export interface AuthUser {
  id: number;
  name: string | null;
  phone: string;
  email: string | null;
  isVerified: boolean;
}

/*
 * =========================================================
 * SEND OTP RESPONSE
 * =========================================================
 */

interface SendOtpResponse {
  success: boolean;
  message: string;

  data: {
    userId: number;
    phone: string;
    expiresAt: string;
  };
}

/*
 * =========================================================
 * VERIFY OTP RESPONSE
 * =========================================================
 */

interface VerifyOtpResponse {
  success: boolean;
  message: string;

  data: {
    token: string;
    user: AuthUser;
  };
}

/*
 * =========================================================
 * UPDATE PROFILE
 * =========================================================
 */

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

/*
 * =========================================================
 * API INSTANCE
 * =========================================================
 */

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * =========================================================
 * SEND OTP
 * =========================================================
 */

export const sendOtp = async (
  phone: string
): Promise<SendOtpResponse["data"]> => {
  const response =
    await api.post<SendOtpResponse>(
      "/auth/send-otp",
      {
        phone,
      }
    );

  return response.data.data;
};

/*
 * =========================================================
 * VERIFY OTP
 * =========================================================
 */

export const verifyOtp = async (
  phone: string,
  otp: string
): Promise<VerifyOtpResponse["data"]> => {
  const response =
    await api.post<VerifyOtpResponse>(
      "/auth/verify-otp",
      {
        phone,
        otp,
      }
    );

  return response.data.data;
};

/*
 * =========================================================
 * UPDATE MY PROFILE
 * =========================================================
 *
 * Authenticated API
 *
 * PATCH /api/users/me
 *
 * JWT is sent through Authorization header.
 */

export const updateMyProfile = async (
  payload: UpdateProfilePayload,
  token: string
): Promise<AuthUser> => {
  const response =
    await api.patch<UpdateProfileResponse>(
      "/users/me",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data.data;
};

export default api;