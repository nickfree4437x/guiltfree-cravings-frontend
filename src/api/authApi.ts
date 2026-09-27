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
    "https://guiltfree-cravings-backend.onrender.com/api",

  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * =========================================================
 * VERIFY MSG91 OTP
 * =========================================================
 *
 * The OTP itself is verified by MSG91 Web SDK.
 *
 * After successful MSG91 verification,
 * frontend receives an MSG91 access token.
 *
 * That access token is sent to our backend.
 *
 * Backend:
 * MSG91 access-token verification
 *        ↓
 * User find/create
 *        ↓
 * GuiltFree JWT
 */

export const verifyOtp = async (
  phone: string,
  accessToken: string
): Promise<VerifyOtpResponse["data"]> => {
  const response =
    await api.post<VerifyOtpResponse>(
      "/auth/verify-otp",
      {
        phone,
        accessToken,
      }
    );

  return response.data.data;
};

/*
 * =========================================================
 * UPDATE MY PROFILE
 * =========================================================
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