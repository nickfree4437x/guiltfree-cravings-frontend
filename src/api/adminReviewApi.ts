import api from "./productApi";

export type AdminReviewStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export interface AdminReviewUser {
  id: number;
  name: string | null;
  phone?: string;
  email?: string | null;
}

export interface AdminReviewProduct {
  id: number;
  name: string;
  image?: string;
}

export interface AdminReview {
  id: number;
  productId: number;
  userId: number;

  rating: number;
  title: string;
  comment: string;

  displayName: string;
  email: string | null;

  status: AdminReviewStatus;

  createdAt: string;
  updatedAt: string;

  user?: AdminReviewUser;
  product?: AdminReviewProduct;
}

export interface AdminReviewsResponse {
  success: boolean;
  data: {
    reviews: AdminReview[];
    summary: {
      total: number;
      pending: number;
      verified: number;
      rejected: number;
    };
  };
}

export interface AdminReviewResponse {
  success: boolean;
  message: string;
  data: AdminReview;
}

const getAdminAuthConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getAdminReviews = async (
  token: string
): Promise<AdminReviewsResponse["data"]> => {
  const response =
    await api.get<AdminReviewsResponse>(
      "/admin/reviews",
      getAdminAuthConfig(token)
    );

  if (!response.data.success) {
    throw new Error(
      "Failed to fetch reviews."
    );
  }

  return response.data.data;
};

export const getAdminReviewById = async (
  reviewId: number,
  token: string
): Promise<AdminReview> => {
  const response =
    await api.get<AdminReviewResponse>(
      `/admin/reviews/${reviewId}`,
      getAdminAuthConfig(token)
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Failed to fetch review."
    );
  }

  return response.data.data;
};

export const verifyAdminReview = async (
  reviewId: number,
  token: string
): Promise<AdminReview> => {
  const response =
    await api.patch<AdminReviewResponse>(
      `/admin/reviews/${reviewId}/verify`,
      {},
      getAdminAuthConfig(token)
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Failed to verify review."
    );
  }

  return response.data.data;
};

export const rejectAdminReview = async (
  reviewId: number,
  token: string
): Promise<AdminReview> => {
  const response =
    await api.patch<AdminReviewResponse>(
      `/admin/reviews/${reviewId}/reject`,
      {},
      getAdminAuthConfig(token)
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Failed to reject review."
    );
  }

  return response.data.data;
};