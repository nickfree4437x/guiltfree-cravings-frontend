import axios from "axios";

// ─── Types ────────────────────────────────────────────────
export interface UserProfile {
  id: number;
  name: string | null;
  phone: string;
  email: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

// ─── API Responses ────────────────────────────────────────
interface ProfileResponse {
  success: boolean;
  message?: string;
  data: UserProfile;
}

// ─── Axios Instance ───────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://guiltfreecravings.com/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Auth Token + Interceptor ─────────────────────────────
const AUTH_TOKEN_KEY = "guiltfree_auth_token";

const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

// Attaches `Authorization: Bearer <token>` to every request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── API: Get My Profile ──────────────────────────────────
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await api.get<ProfileResponse>("/users/me");
  return response.data.data;
};

// ─── API: Update My Profile ───────────────────────────────
export const updateMyProfile = async (
  payload: UpdateProfilePayload
): Promise<UserProfile> => {
  const response = await api.patch<ProfileResponse>("/users/me", payload);
  return response.data.data;
};

export default api;