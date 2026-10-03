import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Loader2,
  X,
} from "lucide-react";

import {
  createProductReview,
  updateProductReview,
  type Review,
} from "../../../api/reviewApi";

import ReviewStars from "./ReviewStars";

interface ReviewModalProps {
  productId: number;
  productName: string;
  token: string;
  existingReview?: Review | null;
  onClose: () => void;
  onSuccess: (review: Review) => void;
}

function ReviewModal({
  productId,
  productName,
  token,
  existingReview,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const isEditing = Boolean(existingReview);

  const [rating, setRating] = useState(
    existingReview?.rating ?? 0
  );

  const [title, setTitle] = useState(
    existingReview?.title ?? ""
  );

  const [comment, setComment] = useState(
    existingReview?.comment ?? ""
  );

  const [displayName, setDisplayName] =
    useState(
      existingReview?.displayName ??
        existingReview?.user?.name ??
        ""
    );

  const [email, setEmail] = useState(
    existingReview?.email ?? ""
  );

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  /*
   * ============================================================
   * SYNC EXISTING REVIEW
   * ============================================================
   */

  useEffect(() => {
    setRating(
      existingReview?.rating ?? 0
    );

    setTitle(
      existingReview?.title ?? ""
    );

    setComment(
      existingReview?.comment ?? ""
    );

    setDisplayName(
      existingReview?.displayName ??
        existingReview?.user?.name ??
        ""
    );

    setEmail(
      existingReview?.email ?? ""
    );

    setError("");
    setIsSubmitted(false);
  }, [existingReview]);

  /*
   * ============================================================
   * SUBMIT REVIEW
   * ============================================================
   */

  const handleSubmit = async () => {
    setError("");

    /*
     * ----------------------------------------------------------
     * RATING
     * ----------------------------------------------------------
     */

    if (rating < 1 || rating > 5) {
      setError(
        "Please select a rating from 1 to 5."
      );
      return;
    }

    /*
     * ----------------------------------------------------------
     * TITLE
     * ----------------------------------------------------------
     */

    const trimmedTitle =
      title.trim();

    if (!trimmedTitle) {
      setError(
        "Please add a title to your review."
      );
      return;
    }

    if (trimmedTitle.length < 3) {
      setError(
        "Review title should be at least 3 characters."
      );
      return;
    }

    if (trimmedTitle.length > 120) {
      setError(
        "Review title cannot exceed 120 characters."
      );
      return;
    }

    /*
     * ----------------------------------------------------------
     * COMMENT
     * ----------------------------------------------------------
     */

    const trimmedComment =
      comment.trim();

    if (!trimmedComment) {
      setError(
        "Please write a review."
      );
      return;
    }

    if (trimmedComment.length < 5) {
      setError(
        "Your review should be at least 5 characters."
      );
      return;
    }

    if (trimmedComment.length > 1000) {
      setError(
        "Your review cannot exceed 1000 characters."
      );
      return;
    }

    /*
     * ----------------------------------------------------------
     * DISPLAY NAME
     * ----------------------------------------------------------
     */

    const trimmedDisplayName =
      displayName.trim();

    if (!trimmedDisplayName) {
      setError(
        "Please enter a display name."
      );
      return;
    }

    if (trimmedDisplayName.length < 2) {
      setError(
        "Display name should be at least 2 characters."
      );
      return;
    }

    if (trimmedDisplayName.length > 60) {
      setError(
        "Display name cannot exceed 60 characters."
      );
      return;
    }

    /*
     * ----------------------------------------------------------
     * EMAIL
     * ----------------------------------------------------------
     *
     * Email is optional.
     * If provided, validate it.
     * ----------------------------------------------------------
     */

    const trimmedEmail =
      email.trim().toLowerCase();

    if (trimmedEmail) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(trimmedEmail)) {
        setError(
          "Please enter a valid email address."
        );
        return;
      }

      if (trimmedEmail.length > 255) {
        setError(
          "Email cannot exceed 255 characters."
        );
        return;
      }
    }

    /*
     * ==========================================================
     * API REQUEST
     * ==========================================================
     */

    try {
      setIsSubmitting(true);

      const payload = {
        rating,
        title: trimmedTitle,
        comment: trimmedComment,
        displayName: trimmedDisplayName,
        email: trimmedEmail || undefined,
      };

      const review = isEditing
        ? await updateProductReview(
            productId,
            payload,
            token
          )
        : await createProductReview(
            productId,
            payload,
            token
          );

      onSuccess(review);

      setIsSubmitted(true);
    } catch (submitError: any) {
      console.error(
        "Failed to submit review:",
        submitError
      );

      const apiMessage =
        submitError?.response?.data?.message;

      setError(
        apiMessage ||
          submitError?.message ||
          "Unable to submit your review right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#EADBD0] bg-white shadow-[0_24px_80px_-30px_rgba(62,42,30,0.35)]">

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close review form"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#EADBD0] bg-white text-[#8B7A6C] transition hover:bg-[#FAF7F2] hover:text-[#B5697A] focus:outline-none"
        >
          <X
            className="h-4 w-4"
            strokeWidth={2}
          />
        </button>

        {/* ====================================================
            SUCCESS STATE
            ==================================================== */}

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center sm:px-10">

            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F8E8EC] text-[#B5697A]">
              <Check
                className="h-7 w-7"
                strokeWidth={2.2}
              />
            </span>

            <h3 className="mt-5 text-[22px] font-semibold tracking-wide text-[#1F4A2E]">
              {isEditing
                ? "Review updated!"
                : "Thank you!"}
            </h3>

            <p className="mt-2 max-w-[340px] text-[13px] leading-relaxed text-gray-600">
              Your review has been submitted
              and is awaiting verification.
              Once approved, it will appear
              publicly on this product.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-7 rounded-lg bg-[#1F4A2E] px-6 py-2.5 text-[13px] text-white transition hover:bg-[#173A24]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* ==================================================
                HEADER
                ================================================== */}

            <div className="border-b border-[#EADBD0] px-6 pb-5 pt-7 sm:px-8">

              <h2
                id="review-modal-title"
                className="mt-1 text-center text-[18px] font-semibold tracking-wide text-[#1F4A2E] sm:text-[20px]"
              >
                Review {productName}
              </h2>

              <p className="mt-1 text-center text-[12px] leading-relaxed text-gray-500">
                Tell us what you loved about
                your GuiltFree Cravings
                experience.
              </p>
            </div>

            {/* ==================================================
                FORM
                ================================================== */}

            <div className="px-6 py-5 sm:px-8">

              {/* =================================================
                  RATING
                  ================================================= */}

              <div className="text-center">
                <p className="text-[12px] font-medium text-[#2C2C2C]">
                  How would you rate it?
                </p>

                <div className="mt-3 flex justify-center">
                  <ReviewStars
                    rating={rating}
                    size={27}
                    interactive
                    onChange={setRating}
                  />
                </div>

                <p className="mt-2 text-[11px] text-gray-400">
                  {rating === 0
                    ? "Select your rating"
                    : rating === 5
                      ? "Loved it!"
                      : rating === 4
                        ? "Really good!"
                        : rating === 3
                          ? "It was good."
                          : rating === 2
                            ? "Could be better."
                            : "We'll do better."}
                </p>
              </div>

              {/* =================================================
                  REVIEW TITLE
                  ================================================= */}

              <div className="mt-5">

                <input
                  id="review-title"
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(
                      event.target.value
                    );
                    setError("");
                  }}
                  maxLength={120}
                  placeholder="Give your review a short title..."
                  className="mt-2 w-full rounded-lg border border-[#E6DCD0] bg-white px-4 py-3 text-[13px] text-[#2C2C2C] outline-none transition placeholder:text-gray-400 focus:border-[#AF956C] focus:ring-2 focus:ring-[#AF956C]/10"
                />

                <div className="mt-1 flex justify-end">
                  <span className="text-[10px] text-gray-400">
                    {title.length}/120
                  </span>
                </div>
              </div>

              {/* =================================================
                  COMMENT
                  ================================================= */}

              <div className="mt-4">

                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(event) => {
                    setComment(
                      event.target.value
                    );
                    setError("");
                  }}
                  maxLength={1000}
                  rows={5}
                  placeholder="Share your thoughts about the taste, freshness, packaging or overall experience..."
                  className="mt-2 w-full resize-none rounded-lg border border-[#E6DCD0] bg-white px-4 py-3 text-[13px] leading-6 text-[#2C2C2C] outline-none transition placeholder:text-gray-400 focus:border-[#AF956C] focus:ring-2 focus:ring-[#AF956C]/10"
                />

                <div className="mt-1 flex justify-end">
                  <span className="text-[10px] text-gray-400">
                    {comment.length}/1000
                  </span>
                </div>
              </div>

              {/* =================================================
                  DISPLAY NAME
                  ================================================= */}

              <div className="mt-4">

                <input
                  id="review-display-name"
                  type="text"
                  value={displayName}
                  onChange={(event) => {
                    setDisplayName(
                      event.target.value
                    );
                    setError("");
                  }}
                  maxLength={60}
                  placeholder="How should your name appear?"
                  className="mt-2 w-full rounded-lg border border-[#E6DCD0] bg-white px-4 py-3 text-[13px] text-[#2C2C2C] outline-none transition placeholder:text-gray-400 focus:border-[#AF956C] focus:ring-2 focus:ring-[#AF956C]/10"
                />
              </div>

              {/* =================================================
                  EMAIL
                  ================================================= */}

              <div className="mt-4">

                <input
                  id="review-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(
                      event.target.value
                    );
                    setError("");
                  }}
                  maxLength={255}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="mt-2 w-full rounded-lg border border-[#E6DCD0] bg-white px-4 py-3 text-[13px] text-[#2C2C2C] outline-none transition placeholder:text-gray-400 focus:border-[#AF956C] focus:ring-2 focus:ring-[#AF956C]/10"
                />

                <p className="mt-1.5 text-[10px] text-gray-400">
                  Your email will not be shown publicly.
                </p>
              </div>

              {/* =================================================
                  ERROR
                  ================================================= */}

              {error && (
                <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[12px] leading-relaxed text-red-500">
                  {error}
                </div>
              )}

              {/* =================================================
                  SUBMIT
                  ================================================= */}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  void handleSubmit();
                }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F4A2E] px-5 py-3 text-[13px] font-medium text-white transition hover:bg-[#173A24] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                    />

                    {isEditing
                      ? "Updating..."
                      : "Submitting..."}
                  </>
                ) : isEditing ? (
                  "Update Review"
                ) : (
                  "Submit Review"
                )}
              </button>

              <p className="mt-2 text-center text-[10px] leading-relaxed text-gray-400">
                Reviews are checked before
                appearing publicly.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReviewModal;