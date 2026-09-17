import axios from "axios";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

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

/*
 * =========================================================
 * API RESPONSES
 * =========================================================
 */

interface ProfileResponse {
  success: boolean;
  message?: string;
  data: UserProfile;
}

/*
 * =========================================================
 * AXIOS INSTANCE
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
 * AUTH TOKEN
 * =========================================================
 */

const AUTH_TOKEN_KEY =
  "guiltfree_auth_token";

const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(
      AUTH_TOKEN_KEY
    );
  } catch {
    return null;
  }
};

/*
 * =========================================================
 * REQUEST INTERCEPTOR
 * =========================================================
 *
 * Automatically attaches:
 *
 * Authorization: Bearer <token>
 *
 * to authenticated user requests.
 */

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
 * =========================================================
 * GET MY PROFILE
 * =========================================================
 *
 * GET /api/users/me
 */

export const getMyProfile =
  async (): Promise<UserProfile> => {
    const response =
      await api.get<ProfileResponse>(
        "/users/me"
      );

    return response.data.data;
  };

/*
 * =========================================================
 * UPDATE MY PROFILE
 * =========================================================
 *
 * PATCH /api/users/me
 */

export const updateMyProfile = async (
  payload: UpdateProfilePayload
): Promise<UserProfile> => {
  const response =
    await api.patch<ProfileResponse>(
      "/users/me",
      payload
    );

  return response.data.data;
};

export default api;