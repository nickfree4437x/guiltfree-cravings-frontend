import {
  CheckCircle2,
} from "lucide-react";

import type { Review } from "../../../api/reviewApi";

import ReviewStars from "./ReviewStars";

interface ReviewItemProps {
  review: Review;
}

function ReviewItem({
  review,
}: ReviewItemProps) {
  const displayName =
    review.displayName?.trim() ||
    "Customer";

  const formattedDate =
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(
      new Date(review.createdAt)
    );

  return (
    <article className="border-b border-[#EEE5DA] py-5 first:pt-0 last:border-b-0 last:pb-0">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {/* CUSTOMER + VERIFIED */}

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-[13px] font-medium text-[#2C2C2C]">
              {displayName}
            </h3>

            <span className="inline-flex items-center gap-1 text-[10px] text-[#5F7A62]">
              <CheckCircle2
                size={12}
                strokeWidth={2}
              />

              Verified
            </span>
          </div>

          {/* STARS */}

          <div className="mt-1.5">
            <ReviewStars
              rating={review.rating}
              size={14}
            />
          </div>
        </div>

        {/* DATE */}

        <time
          dateTime={review.createdAt}
          className="shrink-0 text-[10px] text-gray-400"
        >
          {formattedDate}
        </time>
      </div>

      {/* ======================================================
          REVIEW TITLE
      ====================================================== */}

      {review.title?.trim() && (
        <h4 className="mt-3 text-[13px] font-medium leading-5 text-[#2C2C2C] sm:text-[14px]">
          {review.title}
        </h4>
      )}

      {/* ======================================================
          REVIEW COMMENT
      ====================================================== */}

      <p className="mt-1.5 text-[12px] leading-relaxed text-justify text-gray-700 sm:text-[13px]">
        {review.comment}
      </p>
    </article>
  );
}

export default ReviewItem;