import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Check, X } from "lucide-react";

import StarRating from "./StarRating";
import type { Testimonial } from "./TestimonialCard";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: Testimonial) => void;
}

const MAX_REVIEW_LENGTH = 500;

function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const [errors, setErrors] = useState<{
    name?: string;
    review?: string;
    rating?: string;
  }>({});

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setCity("");
      setReview("");
      setRating(5);
      setErrors({});
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const validateForm = () => {
    const newErrors: {
      name?: string;
      review?: string;
      rating?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your name.";
    } else if (name.trim().length < 2) {
      newErrors.name =
        "Name should be at least 2 characters.";
    }

    if (!review.trim()) {
      newErrors.review =
        "Please write something about your experience.";
    } else if (review.trim().length < 10) {
      newErrors.review =
        "Please write at least 10 characters.";
    }

    if (rating < 1 || rating > 5) {
      newErrors.rating =
        "Please select a rating.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newReview: Testimonial = {
      id: Date.now(),
      name: name.trim(),
      role: city.trim() || "Customer",
      review: review.trim(),
      rating,
    };

    onSubmit(newReview);

    setIsSubmitted(true);

    window.setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleReviewChange = (
    value: string
  ) => {
    if (value.length <= MAX_REVIEW_LENGTH) {
      setReview(value);

      if (errors.review) {
        setErrors((previous) => ({
          ...previous,
          review: undefined,
        }));
      }
    }
  };

  const handleNameChange = (
    value: string
  ) => {
    setName(value);

    if (errors.name) {
      setErrors((previous) => ({
        ...previous,
        name: undefined,
      }));
    }
  };

  const handleOverlayClick = () => {
    if (!isSubmitted) {
      onClose();
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
        bg-[#2c2c2c]/35
        p-4
        backdrop-blur-sm
        sm:p-6
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="
          relative
          w-full
          max-w-[500px]
          overflow-hidden
          rounded-2xl
          border
          border-[#EADBD0]
          bg-white
          shadow-sm
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* Close button */}
        {!isSubmitted && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close review form"
            className="
              absolute
              right-4
              top-5
              z-10
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[#EADBD0]
              bg-white
              text-[#8B7A6C]
              hover:text-[#B5697A]
              focus:outline-none
            "
          >
            <X
              className="h-4 w-4"
              strokeWidth={2}
            />
          </button>
        )}

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
                bg-[#F8E8EC]
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
                text-[22px]
                font-semibold
                tracking-wide
                text-[#1F4A2E]
              "
            >
              Thank you!
            </h3>

            <p
              className="
                mt-2
                max-w-[330px]
                text-[13px]
                leading-relaxed
                text-gray-700
              "
            >
              Your review has been added.
              Thanks for sharing your experience
              with GuiltFree Cravings.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              className="
                border-b
                border-[#EADBD0]
                px-6
                pb-5
                pt-7
                sm:px-8
              "
            >
              <h2
                id="review-modal-title"
                className="
                  mt-1
                  text-center
                  text-[22px]
                  font-semibold
                  tracking-wide
                  text-[#1F4A2E]
                  sm:text-[24px]
                "
              >
                Write a Review
              </h2>

              <p
                className="
                  mt-0
                  text-center
                  text-[12px]
                  leading-relaxed
                  text-[#7A6A5C]
                "
              >
                We'd love to know what you thought
                about our laddoos.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="
                max-h-[calc(100vh-190px)]
                overflow-y-auto
                px-6
                py-6
                sm:px-8
              "
            >
              {/* Name */}
              <div>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    handleNameChange(
                      event.target.value
                    )
                  }
                  placeholder="Enter your name"
                  autoComplete="name"
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-[#E5D7CB]
                    bg-white
                    px-3.5
                    text-[12.5px]
                    text-[#3A2D24]
                    outline-none
                    placeholder:text-[#A89A90]
                  "
                />

                {errors.name && (
                  <p
                    className="
                      mt-1.5
                      text-[10.5px]
                      text-[#B5697A]
                    "
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="mt-4">
                <input
                  id="review-city"
                  type="text"
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value)
                  }
                  placeholder="e.g. Delhi"
                  autoComplete="address-level2"
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-[#E5D7CB]
                    bg-white
                    px-3.5
                    text-[12.5px]
                    text-[#3A2D24]
                    focus:outline-none
                    placeholder:text-[#A89A90]
                  "
                />
              </div>

              {/* Rating */}
              <div className="mt-5">
                <StarRating
                  rating={rating}
                  interactive
                  onChange={setRating}
                  size="lg"
                />

                {errors.rating && (
                  <p
                    className="
                      mt-1.5
                      text-[10.5px]
                      text-[#B5697A]
                    "
                  >
                    {errors.rating}
                  </p>
                )}
              </div>

              {/* Review */}
              <div className="mt-5">
                <textarea
                  id="review-message"
                  value={review}
                  onChange={(event) =>
                    handleReviewChange(
                      event.target.value
                    )
                  }
                  placeholder="Tell us about your experience..."
                  rows={5}
                  className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-[#E5D7CB]
                    bg-white
                    px-3.5
                    py-3
                    text-[12.5px]
                    leading-relaxed
                    text-[#3A2D24]
                    outline-none
                    placeholder:text-[#A89A90]
                  "
                />

                {errors.review && (
                  <p
                    className="
                      mt-0.5
                      text-[10.5px]
                      text-[#B5697A]
                    "
                  >
                    {errors.review}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="
                  mt-6
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#B5697A]
                  px-5
                  text-[12px]
                  tracking-wide
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[#A85F70]
                  hover:shadow-md
                  focus:outline-none
                "
              >
                Submit Review
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ReviewModal;