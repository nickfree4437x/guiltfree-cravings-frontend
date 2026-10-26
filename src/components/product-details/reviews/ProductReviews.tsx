import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, MessageSquarePlus, ChevronLeft, ChevronRight } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";

import {
  deleteProductReview,
  getMyProductReview,
  getProductReviews,
  type Review,
  type ReviewSummary,
} from "../../../api/reviewApi";

import { useAuthStore } from "../../../store/authStore";

import ReviewItem from "./ReviewItem";
import ReviewModal from "./ReviewModal";
import ReviewSummaryComponent from "./ReviewSummary";

// ─── Types ────────────────────────────────────────────────
interface ProductReviewsProps {
  productId: number;
  productName: string;
  onLoginRequired: () => void;
}

// ─── Config ───────────────────────────────────────────────
const REVIEWS_PER_PAGE = 5;

const EMPTY_SUMMARY: ReviewSummary = {
  totalReviews: 0,
  averageRating: 0,
  breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

// Status → visual mapping (badge color, label, description)
const STATUS_MAP = {
  VERIFIED: {
    badge: "bg-[#FBEEF1] text-[#A55D6F]",
    label: "Verified",
    description: "Your review is visible publicly.",
  },
  REJECTED: {
    badge: "bg-red-50 text-red-600",
    label: "Rejected",
    description: "This review is not visible publicly. You can update it and submit again.",
  },
  PENDING: {
    badge: "bg-amber-50 text-amber-700",
    label: "Pending verification",
    description: "Your review is waiting for verification.",
  },
} as const;

const getStatusMeta = (status: Review["status"]) =>
  STATUS_MAP[status as keyof typeof STATUS_MAP] ?? STATUS_MAP.PENDING;

// ─── Pagination Button ────────────────────────────────────
function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous page" : "Next page"}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#EADFD3] bg-white text-[#B5697A] transition-all duration-200 hover:border-[#B5697A] hover:bg-[#FBEEF1] focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#EADFD3] disabled:hover:bg-white sm:h-9 sm:w-9"
    >
      <Icon size={15} strokeWidth={2} />
    </button>
  );
}

// ─── Component ────────────────────────────────────────────
function ProductReviews({ productId, productName, onLoginRequired }: ProductReviewsProps) {
  const { token, isAuthenticated } = useAuthStore();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>(EMPTY_SUMMARY);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMyReview, setIsLoadingMyReview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Load public reviews ────────────────────────────────
  const loadReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getProductReviews(productId);
      setReviews(data.reviews);
      setSummary(data.summary);
      setCurrentPage(1);
    } catch (loadError) {
      console.error("Failed to load product reviews:", loadError);
      setError("Unable to load reviews right now.");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  // ─── Load my review ─────────────────────────────────────
  const loadMyReview = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setMyReview(null);
      return;
    }
    try {
      setIsLoadingMyReview(true);
      const review = await getMyProductReview(productId, token);
      setMyReview(review);
    } catch (loadError) {
      console.error("Failed to load my review:", loadError);
      setMyReview(null);
    } finally {
      setIsLoadingMyReview(false);
    }
  }, [productId, token, isAuthenticated]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    void loadMyReview();
  }, [loadMyReview]);

  // ─── Pagination ─────────────────────────────────────────
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    return reviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [reviews, currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document.getElementById("reviews-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Smart Page Numbers (with Ellipsis for Mobile)
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  // ─── Handlers ───────────────────────────────────────────
  const handleWriteReview = () => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
    setIsModalOpen(true);
  };

  const handleReviewSuccess = (review: Review) => {
    setMyReview(review);
    void loadReviews(); // refresh public list (new review is PENDING)
    setIsModalOpen(false);
  };

  const handleDeleteReview = async () => {
    if (!token || !myReview) return;
    if (!window.confirm("Are you sure you want to delete your review?")) return;

    try {
      setIsDeleting(true);
      await deleteProductReview(productId, token);
      setMyReview(null);
      await loadReviews();
    } catch (deleteError: any) {
      console.error("Failed to delete review:", deleteError);
      setError(
        deleteError?.response?.data?.message ||
          deleteError?.message ||
          "Unable to delete your review."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Derived: my review meta ────────────────────────────
  const myStatus = myReview ? getStatusMeta(myReview.status) : null;

  // ─── Render ─────────────────────────────────────────────
  return (
    <section className="w-full">
      {/* =====================================================
          HEADER - RESPONSIVE
      ===================================================== */}
      <div className="mb-6 flex flex-row items-center justify-between gap-3 sm:items-end">
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold tracking-wide text-gray-700 sm:text-[20px] truncate">
            Customer Reviews
          </h2>
          <p className="mt-0 text-[11px] leading-relaxed text-slate-500 sm:text-[12px] truncate">
            Honest thoughts from customers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleWriteReview}
          className="group inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#D9B7C0] bg-white px-3 py-1.5 text-[11px] text-[#B5697A] transition-all duration-200 hover:border-[#B5697A] hover:bg-[#B5697A] hover:text-white sm:gap-2.5 sm:px-5 sm:py-2 sm:text-[12px]"
        >
          <MessageSquarePlus
            size={14}
            strokeWidth={1.8}
            className="text-[#B5697A] transition-colors duration-200 group-hover:text-white sm:h-[15px] sm:w-[15px]"
          />
          <span className="whitespace-nowrap">{myReview ? "Your Review" : "Write Review"}</span>
        </button>
      </div>

      {/* Summary */}
      {!isLoading && <ReviewSummaryComponent summary={summary} />}

      {/* =====================================================
          MY REVIEW STATUS
      ===================================================== */}
      {isAuthenticated && myReview && myStatus && (
        <div className="mt-5 rounded-xl border border-[#F0DDE2] bg-[#FFFCFD] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[12px] font-medium text-gray-700">Your review</p>
                <span className={`rounded-full px-2.5 py-0.5 text-[9px] ${myStatus.badge}`}>
                  {myStatus.label}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {myStatus.description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 transition hover:bg-blue-100 sm:h-9 sm:w-9"
                aria-label="Edit review"
              >
                <FaEdit size={13} />
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => void handleDeleteReview()}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50 sm:h-9 sm:w-9"
                aria-label="Delete review"
              >
                {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <FaTrash size={13} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[12px] text-red-600">
          {error}
        </div>
      )}

      {/* =====================================================
          REVIEWS LIST
      ===================================================== */}
      <div
        id="reviews-list"
        className="mt-7 rounded-xl border border-[#F0DDE2] bg-white p-4 shadow-[0_2px_12px_rgba(181,105,122,0.04)] sm:p-6"
      >
        {isLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#B5697A]" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FBEEF1] text-[#B5697A]">
              <MessageSquarePlus size={21} />
            </div>
            <h3 className="mt-4 text-[14px] font-medium text-[#2C2C2C]">No reviews yet</h3>
            <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-[#8B7A6C] md:text-[12px]">
              Be the first to share your experience with this laddoo.
            </p>
            <button
              type="button"
              onClick={handleWriteReview}
              className="mt-4 rounded-lg bg-[#B5697A] px-4 py-2.5 text-[11px] font-[350] text-white transition hover:bg-[#A55D6F]"
            >
              Write the first review
            </button>
          </div>
        ) : (
          <>
            <div>
              {paginatedReviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>

            {/* =====================================================
                PAGINATION - FULLY RESPONSIVE
            ===================================================== */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-[#F5EBEF] pt-5 sm:flex-row">
                <p className="text-[11px] text-slate-500 sm:text-[12px]">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {(currentPage - 1) * REVIEWS_PER_PAGE + 1}
                  </span>
                  {" – "}
                  <span className="font-semibold text-gray-700">
                    {Math.min(currentPage * REVIEWS_PER_PAGE, reviews.length)}
                  </span>{" "}
                  of <span className="font-semibold text-gray-700">{reviews.length}</span> reviews
                </p>

                <div className="flex items-center gap-1 sm:gap-1.5">
                  <NavButton
                    direction="prev"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  />

                  {getPageNumbers().map((page, idx) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="flex h-8 w-6 items-center justify-center text-[12px] text-gray-400 sm:h-9 sm:w-8"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page as number)}
                        aria-label={`Go to page ${page}`}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`inline-flex h-8 min-w-[30px] items-center justify-center rounded-lg border px-1.5 text-[12px] transition-all duration-200 focus:outline-none sm:h-9 sm:min-w-[32px] sm:px-2 ${
                          page === currentPage
                            ? "border-[#B5697A] bg-[#B5697A] text-white shadow-sm"
                            : "border-[#EADFD3] bg-white text-[#6F6259] hover:border-[#B5697A] hover:text-[#B5697A]"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <NavButton
                    direction="next"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review modal */}
      {isModalOpen && isAuthenticated && token && (
        <ReviewModal
          productId={productId}
          productName={productName}
          token={token}
          existingReview={myReview}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleReviewSuccess}
        />
      )}

      {/* A11y loading state */}
      {isLoadingMyReview && <span className="sr-only">Loading your review...</span>}
    </section>
  );
}

export default ProductReviews;