import type { AdminReviewStatus } from "../../../api/adminReviewApi";

// ─── Filters ──────────────────────────────────────────────
export type StatusFilter = "ALL" | AdminReviewStatus;

export type RatingFilter = "ALL" | "1" | "2" | "3" | "4" | "5";

// ─── Summary ──────────────────────────────────────────────
export interface ReviewSummary {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}