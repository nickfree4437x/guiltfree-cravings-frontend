import api from "./productApi";

export type ReviewStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export interface ReviewUser {
  id: number;
  name: string | null;
}

export interface Review {
  id: number;

  productId: number;
  userId: number;

  // Review data
  rating: number;
  title: string;
  comment: string;

  // Customer information
  displayName: string;
  email: string | null;

  // Moderation
  status: ReviewStatus;

  createdAt: string;
  updatedAt: string;

  user: ReviewUser;
}

export interface ReviewBreakdown {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  breakdown: ReviewBreakdown;
}

export interface ProductReviewsResponse {
  success: boolean;

  data: {
    reviews: Review[];
    summary: ReviewSummary;
  };
}

export interface MyReviewResponse {
  success: boolean;
  data: Review | null;
}

/**
 * ============================================================
 * CREATE / UPDATE REVIEW PAYLOAD
 * ============================================================
 */

export interface CreateReviewPayload {
  rating: number;

  title: string;

  comment: string;

  displayName: string;

  email?: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: Review;
}

export interface DeleteReviewResponse {
  success: boolean;
  message: string;
}

/**
 * ============================================================
 * AUTH HEADER
 * ============================================================
 */

const getAuthConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/**
 * ============================================================
 * GET VERIFIED REVIEWS
 * ============================================================
 */

export const getProductReviews = async (
  productId: number
): Promise<ProductReviewsResponse["data"]> => {
  const response =
    await api.get<ProductReviewsResponse>(
      `/products/${productId}/reviews`
    );

  if (!response.data.success) {
    throw new Error(
      "Failed to fetch product reviews."
    );
  }

  return response.data.data;
};

/**
 * ============================================================
 * GET MY REVIEW
 * ============================================================
 */

export const getMyProductReview = async (
  productId: number,
  token: string
): Promise<Review | null> => {
  const response =
    await api.get<MyReviewResponse>(
      `/products/${productId}/reviews/me`,
      getAuthConfig(token)
    );

  if (!response.data.success) {
    throw new Error(
      "Failed to fetch your review."
    );
  }

  return response.data.data;
};

/**
 * ============================================================
 * CREATE REVIEW
 * ============================================================
 */

export const createProductReview = async (
  productId: number,
  payload: CreateReviewPayload,
  token: string
): Promise<Review> => {
  const response =
    await api.post<ReviewResponse>(
      `/products/${productId}/reviews`,
      payload,
      getAuthConfig(token)
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Failed to submit review."
    );
  }

  return response.data.data;
};

/**
 * ============================================================
 * UPDATE REVIEW
 * ============================================================
 */

export const updateProductReview = async (
  productId: number,
  payload: CreateReviewPayload,
  token: string
): Promise<Review> => {
  const response =
    await api.put<ReviewResponse>(
      `/products/${productId}/reviews`,
      payload,
      getAuthConfig(token)
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Failed to update review."
    );
  }

  return response.data.data;
};

/**
 * ============================================================
 * DELETE REVIEW
 * ============================================================
 */

export const deleteProductReview = async (
  productId: number,
  token: string
): Promise<string> => {
  const response =
    await api.delete<DeleteReviewResponse>(
      `/products/${productId}/reviews`,
      getAuthConfig(token)
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Failed to delete review."
    );
  }

  return response.data.message;
};