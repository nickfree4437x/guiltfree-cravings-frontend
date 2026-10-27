import axios from "axios";

// ─── Types ────────────────────────────────────────────────
export interface AuthUser {
  id: number;
  name: string | null;
  phone: string;
  email: string | null;
  isVerified: boolean;
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: { token: string; user: AuthUser };
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

// ─── API Instance ─────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// ─── API: Verify MSG91 OTP ────────────────────────────────
// MSG91 access-token → backend verifies → returns GuiltFree JWT
export const verifyOtp = async (
  phone: string,
  accessToken: string
): Promise<VerifyOtpResponse["data"]> => {
  const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", {
    phone,
    accessToken,
  });

  return response.data.data;
};

// ─── API: Update My Profile (JWT protected) ───────────────
export const updateMyProfile = async (
  payload: UpdateProfilePayload,
  token: string
): Promise<AuthUser> => {
  const response = await api.patch<UpdateProfileResponse>("/users/me", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data;
};

export default api;