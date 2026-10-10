import type { AdminReviewStatus } from "../../../api/adminReviewApi";

export type StatusFilter =
  | "ALL"
  | AdminReviewStatus;

export type RatingFilter =
  | "ALL"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5";

export interface ReviewSummary {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}