import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Loader2,
  MessageSquarePlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

interface ProductReviewsProps {
  productId: number;
  productName: string;
  onLoginRequired: () => void;
}

const REVIEWS_PER_PAGE = 5;

function ProductReviews({
  productId,
  productName,
  onLoginRequired,
}: ProductReviewsProps) {
  const {
    token,
    isAuthenticated,
  } = useAuthStore();

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [summary, setSummary] =
    useState<ReviewSummary>({
      totalReviews: 0,
      averageRating: 0,
      breakdown: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    });

  const [myReview, setMyReview] =
    useState<Review | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isLoadingMyReview, setIsLoadingMyReview] =
    useState(false);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ==========================================================
     PAGINATION STATE
  ========================================================== */
  const [currentPage, setCurrentPage] =
    useState(1);

  /**
   * ============================================================
   * LOAD PUBLIC REVIEWS
   * ============================================================
   */

  const loadReviews = useCallback(
    async () => {
      try {
        setIsLoading(true);
        setError("");

        const data =
          await getProductReviews(productId);

        setReviews(data.reviews);
        setSummary(data.summary);
        setCurrentPage(1); // Reset page on new data
      } catch (loadError) {
        console.error(
          "Failed to load product reviews:",
          loadError
        );

        setError(
          "Unable to load reviews right now."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [productId]
  );

  /**
   * ============================================================
   * LOAD MY REVIEW
   * ============================================================
   */

  const loadMyReview =
    useCallback(async () => {
      if (!token || !isAuthenticated) {
        setMyReview(null);
        return;
      }

      try {
        setIsLoadingMyReview(true);

        const review =
          await getMyProductReview(
            productId,
            token
          );

        setMyReview(review);
      } catch (loadError) {
        console.error(
          "Failed to load my review:",
          loadError
        );

        setMyReview(null);
      } finally {
        setIsLoadingMyReview(false);
      }
    }, [
      productId,
      token,
      isAuthenticated,
    ]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    void loadMyReview();
  }, [loadMyReview]);

  /**
   * ============================================================
   * PAGINATION LOGIC
   * ============================================================
   */

  const totalPages = Math.ceil(
    reviews.length / REVIEWS_PER_PAGE
  );

  const paginatedReviews = useMemo(() => {
    const startIndex =
      (currentPage - 1) * REVIEWS_PER_PAGE;

    return reviews.slice(
      startIndex,
      startIndex + REVIEWS_PER_PAGE
    );
  }, [reviews, currentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    // Scroll to reviews section top (optional but good UX)
    const section =
      document.getElementById("reviews-list");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /**
   * ============================================================
   * OPEN REVIEW
   * ============================================================
   */

  const handleWriteReview = () => {
    /**
     * Guest user:
     * Let the parent ProductDetailsPage open
     * the existing OTP authentication modal.
     */
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }

    /**
     * Logged-in user:
     * Open the review modal normally.
     */
    setIsModalOpen(true);
  };

  /**
   * ============================================================
   * REVIEW SUCCESS
   * ============================================================
   */

  const handleReviewSuccess = (
    review: Review
  ) => {
    setMyReview(review);

    /*
     * Do not add the newly submitted review
     * to public reviews because it is PENDING.
     *
     * Reloading public reviews keeps the frontend
     * consistent with backend moderation.
     */
    void loadReviews();

    setIsModalOpen(false);
  };

  /**
   * ============================================================
   * DELETE REVIEW
   * ============================================================
   */

  const handleDeleteReview = async () => {
    if (!token || !myReview) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete your review?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteProductReview(
        productId,
        token
      );

      setMyReview(null);

      await loadReviews();
    } catch (deleteError: any) {
      console.error(
        "Failed to delete review:",
        deleteError
      );

      window.alert(
        deleteError?.response?.data?.message ||
          deleteError?.message ||
          "Unable to delete your review."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="w-full">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[18px] font-semibold tracking-wide text-gray-700 sm:text-[20px]">
            Customer Reviews
          </h2>

          <p className="mt-0 text-[11px] leading-relaxed text-slate-500 sm:text-[12px]">
            Honest thoughts from customers who
            have tried it.
          </p>
        </div>

        <button
          type="button"
          onClick={handleWriteReview}
          className="group inline-flex w-fit items-center justify-center gap-2.5 rounded-lg border border-[#D9B7C0] bg-white px-5 py-2 text-[12px] text-[#B5697A] transition-all duration-200 hover:border-[#B5697A] hover:bg-[#B5697A] hover:text-white"
        >
          <MessageSquarePlus
            size={15}
            strokeWidth={1.8}
            className="text-[#B5697A] transition-colors duration-200 group-hover:text-white"
          />

          <span>
            {myReview
              ? "Your Review"
              : "Write a Review"}
          </span>
        </button>
      </div>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      {!isLoading && (
        <ReviewSummaryComponent
          summary={summary}
        />
      )}

      {/* ======================================================
          MY REVIEW STATUS
      ====================================================== */}

      {isAuthenticated &&
        myReview && (
          <div className="mt-5 rounded-xl border border-[#F0DDE2] bg-[#FFFCFD] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[12px] font-medium text-gray-700">
                    Your review
                  </p>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[9px] ${
                      myReview.status ===
                      "VERIFIED"
                        ? "bg-[#FBEEF1] text-[#A55D6F]"
                        : myReview.status ===
                            "REJECTED"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {myReview.status ===
                    "VERIFIED"
                      ? "Verified"
                      : myReview.status ===
                          "REJECTED"
                        ? "Rejected"
                        : "Pending verification"}
                  </span>
                </div>

                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  {myReview.status ===
                  "VERIFIED"
                    ? "Your review is visible publicly."
                    : myReview.status ===
                        "REJECTED"
                      ? "This review is not visible publicly. You can update it and submit again."
                      : "Your review is waiting for verification."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(true)
                  }
                  className="p-2 rounded-md text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                >
                  <FaEdit size={13} />
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    void handleDeleteReview();
                  }}
                  className="p-2 rounded-md text-sm bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                  {isDeleting ? (
                    <Loader2
                      size={13}
                      className="animate-spin"
                    />
                  ) : (
                    <FaTrash size={13} />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[12px] text-red-600">
          {error}
        </div>
      )}

      {/* ======================================================
          REVIEWS LIST
      ====================================================== */}

      <div
        id="reviews-list"
        className="mt-7 rounded-xl border border-[#F0DDE2] bg-white p-5 shadow-[0_2px_12px_rgba(181,105,122,0.04)] sm:p-6"
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

            <h3 className="mt-4 text-[14px] font-medium text-[#2C2C2C]">
              No reviews yet
            </h3>

            <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-[#8B7A6C] md:text-[12px]">
              Be the first to share your
              experience with this laddoo.
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
                <ReviewItem
                  key={review.id}
                  review={review}
                />
              ))}
            </div>

            {/* ==================================================
                PAGINATION
            ================================================== */}

            {totalPages > 1 && (
              <div
                className="
                  mt-6
                  flex
                  flex-col
                  items-center
                  justify-between
                  gap-3
                  border-t
                  border-[#F5EBEF]
                  pt-5
                  sm:flex-row
                "
              >
                {/* Page Info */}
                <p className="text-[11px] text-slate-500 sm:text-[12px]">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {(currentPage - 1) * REVIEWS_PER_PAGE + 1}
                  </span>
                  {" – "}
                  <span className="font-semibold text-gray-700">
                    {Math.min(
                      currentPage * REVIEWS_PER_PAGE,
                      reviews.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">
                    {reviews.length}
                  </span>{" "}
                  reviews
                </p>

                {/* Controls */}
                <div className="flex items-center gap-1.5">
                  {/* Previous */}
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="
                      inline-flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[#EADFD3]
                      bg-white
                      text-[#B5697A]
                      transition-all
                      duration-200
                      hover:border-[#B5697A]
                      hover:bg-[#FBEEF1]
                      focus:outline-none
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                      disabled:hover:border-[#EADFD3]
                      disabled:hover:bg-white
                    "
                  >
                    <ChevronLeft
                      size={15}
                      strokeWidth={2}
                    />
                  </button>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        goToPage(page)
                      }
                      aria-label={`Go to page ${page}`}
                      aria-current={
                        page === currentPage
                          ? "page"
                          : undefined
                      }
                      className={`
                        inline-flex
                        h-8
                        min-w-[32px]
                        items-center
                        justify-center
                        rounded-lg
                        border
                        px-2
                        text-[12px]
                        transition-all
                        duration-200
                        focus:outline-none
                        ${
                          page === currentPage
                            ? "border-[#B5697A] bg-[#B5697A] text-white shadow-sm"
                            : "border-[#EADFD3] bg-white text-[#6F6259] hover:border-[#B5697A] hover:text-[#B5697A]"
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    aria-label="Next page"
                    className="
                      inline-flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[#EADFD3]
                      bg-white
                      text-[#B5697A]
                      transition-all
                      duration-200
                      hover:border-[#B5697A]
                      hover:bg-[#FBEEF1]
                      focus:outline-none
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                      disabled:hover:border-[#EADFD3]
                      disabled:hover:bg-white
                    "
                  >
                    <ChevronRight
                      size={15}
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ======================================================
          REVIEW MODAL
      ====================================================== */}

      {isModalOpen &&
        isAuthenticated &&
        token && (
          <ReviewModal
            productId={productId}
            productName={productName}
            token={token}
            existingReview={myReview}
            onClose={() =>
              setIsModalOpen(false)
            }
            onSuccess={
              handleReviewSuccess
            }
          />
        )}

      {/* ======================================================
          AUTH LOADING STATE
      ====================================================== */}

      {isLoadingMyReview && (
        <span className="sr-only">
          Loading your review...
        </span>
      )}
    </section>
  );
}

export default ProductReviews;