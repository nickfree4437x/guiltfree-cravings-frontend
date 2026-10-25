import { CheckCircle2 } from "lucide-react";

import type { Review } from "../../../api/reviewApi";
import ReviewStars from "./ReviewStars";

// ─── Types ────────────────────────────────────────────────
interface ReviewItemProps {
  review: Review;
}

// ─── Component ────────────────────────────────────────────
function ReviewItem({ review }: ReviewItemProps) {
  const displayName = review.displayName?.trim() || "Customer";

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(review.createdAt));

  return (
    <article className="border-b border-[#EEE5DA] py-5 first:pt-0 last:border-b-0 last:pb-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {/* Customer + Verified */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-[13px] font-medium text-gray-700">{displayName}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] text-[#5F7A62]">
              <CheckCircle2 size={12} strokeWidth={2} />
              Verified
            </span>
          </div>

          {/* Stars */}
          <div className="mt-1.5">
            <ReviewStars rating={review.rating} size={14} />
          </div>
        </div>

        {/* Date */}
        <time dateTime={review.createdAt} className="shrink-0 text-[10px] text-gray-400">
          {formattedDate}
        </time>
      </div>

      {/* Title */}
      {review.title?.trim() && (
        <h4 className="mt-2 text-[13px] font-medium leading-relaxed text-gray-600 sm:text-[14px]">
          {review.title}
        </h4>
      )}

      {/* Comment */}
      <p className="mt-1.5 text-[11px] leading-relaxed text-justify text-slate-500 sm:text-[12px]">
        {review.comment}
      </p>
    </article>
  );
}

export default ReviewItem;