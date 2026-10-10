import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Loader2,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

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
  const isEditing =
    Boolean(existingReview);

  const [rating, setRating] = useState(
    existingReview?.rating ?? 0
  );

  const [title, setTitle] = useState(
    existingReview?.title ?? ""
  );

  const [comment, setComment] =
    useState(
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

    setIsSubmitted(false);
  }, [existingReview]);

  /*
   * ============================================================
   * SUBMIT REVIEW
   * ============================================================
   */

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error(
        "Please select a rating from 1 to 5."
      );
      return;
    }

    const trimmedTitle =
      title.trim();

    if (!trimmedTitle) {
      toast.error(
        "Please add a title to your review."
      );
      return;
    }

    if (trimmedTitle.length < 3) {
      toast.error(
        "Review title should be at least 3 characters."
      );
      return;
    }

    if (trimmedTitle.length > 120) {
      toast.error(
        "Review title cannot exceed 120 characters."
      );
      return;
    }

    const trimmedComment =
      comment.trim();

    if (!trimmedComment) {
      toast.error(
        "Please write a review."
      );
      return;
    }

    if (trimmedComment.length < 5) {
      toast.error(
        "Your review should be at least 5 characters."
      );
      return;
    }

    if (trimmedComment.length > 1000) {
      toast.error(
        "Your review cannot exceed 1000 characters."
      );
      return;
    }

    const trimmedDisplayName =
      displayName.trim();

    if (!trimmedDisplayName) {
      toast.error(
        "Please enter a display name."
      );
      return;
    }

    if (trimmedDisplayName.length < 2) {
      toast.error(
        "Display name should be at least 2 characters."
      );
      return;
    }

    if (trimmedDisplayName.length > 60) {
      toast.error(
        "Display name cannot exceed 60 characters."
      );
      return;
    }

    const trimmedEmail =
      email.trim().toLowerCase();

    if (trimmedEmail) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(trimmedEmail)) {
        toast.error(
          "Please enter a valid email address."
        );
        return;
      }

      if (trimmedEmail.length > 255) {
        toast.error(
          "Email cannot exceed 255 characters."
        );
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const payload = {
        rating,
        title: trimmedTitle,
        comment: trimmedComment,
        displayName: trimmedDisplayName,
        email:
          trimmedEmail || undefined,
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

      toast.success(
        isEditing
          ? "Your review has been updated successfully."
          : "Your review has been submitted successfully."
      );
    } catch (submitError: any) {
      console.error(
        "Failed to submit review:",
        submitError
      );

      const apiMessage =
        submitError?.response?.data
          ?.message;

      toast.error(
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
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-[#2C1F24]/45
        px-4
        py-6
      "
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
      <div
        className="
          relative
          max-h-[92vh]
          w-full
          max-w-[620px]
          overflow-y-auto
          rounded-2xl
          border
          border-[#F0DDE2]
          bg-white
          shadow-sm
        "
      >
        {/* ====================================================
            CLOSE
            ==================================================== */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close review form"
          className="
            absolute
            right-5
            top-5
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-[#F0DDE2]
            bg-white
            text-[#8B7A6C]
            hover:border-[#D9B7C0]
            hover:bg-[#FBEEF1]
            hover:text-[#B5697A]
            focus:outline-none
          "
        >
          <X
            className="h-4 w-4"
            strokeWidth={2}
          />
        </button>

        {/* ====================================================
            SUCCESS
            ==================================================== */}

        {isSubmitted ? (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              px-6
              py-14
              text-center
              sm:px-10
            "
          >
            <span
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-[#FBEEF1]
                text-[#B5697A]
              "
            >
              <Check
                className="h-7 w-7"
                strokeWidth={2.2}
              />
            </span>

            <h3
              className="
                mt-5
                text-[21px]
                font-semibold
                tracking-wide
                text-[#2C2C2C]
              "
            >
              {isEditing
                ? "Review updated!"
                : "Thank you!"}
            </h3>

            <p
              className="
                mt-2
                max-w-[340px]
                text-[12px]
                leading-[1.7]
                text-[#8B7A6C]
                sm:text-[13px]
              "
            >
              Your review has been
              submitted and is awaiting
              verification. Once approved,
              it will appear publicly on
              this product.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="
                mt-7
                rounded-lg
                bg-[#B5697A]
                px-7
                py-2.5
                text-[12px]
                text-white
                transition-all
                hover:bg-[#A55D6F]
              "
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* ==================================================
                HEADER
                ================================================== */}

            <div
              className="
                border-b
                border-[#F0DDE2]
                px-6
                pb-5
                pt-7
                sm:px-8
              "
            >
              <h2
                id="review-modal-title"
                className="
                  pr-8
                  text-center
                  text-[20px]
                  font-semibold
                  tracking-wide
                  text-[#2C2C2C]
                  sm:text-[22px]
                "
              >
                {isEditing
                  ? "Edit Your Review"
                  : "Write a Review"}
              </h2>

              <p
                className="
                  mt-1
                  text-center
                  text-[11px]
                  leading-relaxed
                  text-[#8B7A6C]
                  sm:text-[12px]
                "
              >
                {isEditing
                  ? `Update your thoughts about ${productName}.`
                  : `Share your experience with ${productName}.`}
              </p>
            </div>

            {/* ==================================================
                FORM
                ================================================== */}

            <div
              className="
                px-6
                py-6
                sm:px-8
                sm:py-7
              "
            >
              {/* ================================
                  RATING
                  ================================= */}

              <div
                className="
                  rounded-lg
                  border
                  border-[#F0DDE2]
                  bg-[#FFFCFD]
                  px-5
                  py-4
                "
              >
                <p
                  className="
                    text-center
                    text-[12px]
                    text-[#6D5844]
                  "
                >
                  How would you rate it?
                </p>

                <div className="mt-2 flex justify-center">
                  <ReviewStars
                    rating={rating}
                    size={27}
                    interactive
                    onChange={setRating}
                  />
                </div>

                <p
                  className="
                    mt-1.5
                    text-center
                    text-[10px]
                    text-[#B5697A]
                  "
                >
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

              {/* ================================
                  TITLE
                  ================================= */}

              <div className="mt-4">
                <input
                  id="review-title"
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(
                      event.target.value
                    );
                  }}
                  maxLength={120}
                  placeholder="Give your review a short title... *"
                  aria-label="Review title"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-[#EADBD0]
                    bg-white
                    px-4
                    py-3
                    text-[12px]
                    text-gray-600
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-gray-600
                    focus:border-[#B5697A]
                  "
                />

                <div className="mt-1 flex justify-end">
                  <span className="text-[9px] text-[#A89486]">
                    {title.length}/120
                  </span>
                </div>
              </div>

              {/* ================================
                  COMMENT
                  ================================= */}

              <div className="mt-3">
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(event) => {
                    setComment(
                      event.target.value
                    );
                  }}
                  maxLength={1000}
                  rows={5}
                  placeholder="Share your thoughts about the taste, freshness, packaging or overall experience... *"
                  aria-label="Your review"
                  className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-[#EADBD0]
                    bg-white
                    px-4
                    py-3
                    text-[12px]
                    leading-[1.65]
                    text-gray-600
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-gray-600
                    focus:border-[#B5697A]
                  "
                />

                <div className="mt-0 flex justify-end">
                  <span className="text-[9px] text-[#A89486]">
                    {comment.length}/1000
                  </span>
                </div>
              </div>

              {/* ================================
                  USER DETAILS
                  ================================= */}

              <div
                className="
                  mt-3
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                "
              >
                <input
                  id="review-display-name"
                  type="text"
                  value={displayName}
                  onChange={(event) => {
                    setDisplayName(
                      event.target.value
                    );
                  }}
                  maxLength={60}
                  placeholder="Display name *"
                  aria-label="Display name"
                  autoComplete="name"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-[#EADBD0]
                    bg-white
                    px-4
                    py-3
                    text-[12px]
                    text-gray-600
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-gray-600
                    focus:border-[#B5697A]
                  "
                />

                <input
                  id="review-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(
                      event.target.value
                    );
                  }}
                  maxLength={255}
                  placeholder="Email (optional)"
                  aria-label="Email"
                  autoComplete="email"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-[#EADBD0]
                    bg-white
                    px-4
                    py-3
                    text-[12px]
                    text-gray-600
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-gray-600
                    focus:border-[#B5697A]
                  "
                />
              </div>

              <p
                className="
                  mt-1.5
                  text-[9px]
                  text-[#A89486]
                "
              >
                Your email will not be shown
                publicly.
              </p>

              {/* ================================
                  SUBMIT
                  ================================= */}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  void handleSubmit();
                }}
                className="
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[#B5697A]
                  px-5
                  py-3
                  text-[12px]
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-[#A55D6F]
                  hover:shadow-md
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#B5697A]/20
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
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

              <p
                className="
                  mt-2.5
                  text-center
                  text-[10px]
                  text-[#A89486]
                "
              >
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