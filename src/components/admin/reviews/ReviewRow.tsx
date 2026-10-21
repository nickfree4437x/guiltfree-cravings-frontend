import {
  CheckCircle2,
  Eye,
  Loader2,
  Star,
  XCircle,
  Mail,
  Package,
  Calendar,
  User,
} from "lucide-react";

import type { AdminReview } from "../../../api/adminReviewApi";

import ReviewStatusBadge from "./ReviewStatusBadge";
import { formatReviewDate } from "./reviewUtils";

interface ReviewRowProps {
  review: AdminReview;
  actionId: number | null;
  onView: () => void;
  onVerify: () => void;
  onReject: () => void;
}

function ReviewRow({
  review,
  actionId,
  onView,
  onVerify,
  onReject,
}: ReviewRowProps) {
  const isActioning =
    actionId === review.id;

  return (
    <div
      className="
        group
        px-5
        py-5
        transition-colors
        hover:bg-[#fffbfc]
        sm:px-6
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-start
          lg:justify-between
          lg:gap-6
        "
      >
        {/* ====================================================
            REVIEW CONTENT
        ==================================================== */}

        <div className="min-w-0 flex-1">
          {/* RATING + STATUS */}

          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className="flex items-center gap-0.5"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <Star
                    key={star}
                    className={
                      star <= review.rating
                        ? "h-[13px] w-[13px] fill-[#D79A3B] text-[#D79A3B]"
                        : "h-[13px] w-[13px] text-[#DED4CA]"
                    }
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                )
              )}
            </div>

            <span className="text-[11px] font-medium text-[#8B7A6C]">
              {review.rating}.0
            </span>

            <span className="h-3 w-px bg-[#EADFD3]" />

            <ReviewStatusBadge
              status={review.status}
            />
          </div>

          {/* TITLE */}

          <h3
            className="
              mt-2
              text-[14px]
              font-semibold
              tracking-[-0.01em]
              text-slate-700
              sm:text-[15px]
            "
          >
            {review.title ||
              "Untitled Review"}
          </h3>

          {/* COMMENT */}

          <p
            className="
              mt-1
              line-clamp-2
              max-w-3xl
              text-[12.5px]
              leading-relaxed
              text-slate-500
            "
          >
            {review.comment ||
              "No comment provided."}
          </p>

          {/* META */}

          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-1.5
              text-[11px]
              text-[#A0958C]
            "
          >
            {/* NAME */}
            <span className="inline-flex items-center gap-1.5 text-gray-600">
              <User
                className="h-3 w-3 text-[#B8AAA0]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {review.displayName ||
                "Customer"}
            </span>

            {/* EMAIL */}
            {review.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail
                  className="h-3 w-3 text-[#B8AAA0]"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                {review.email}
              </span>
            )}

            {/* PRODUCT */}
            {review.product?.name && (
              <span className="inline-flex items-center gap-1.5">
                <Package
                  className="h-3 w-3 text-[#B8AAA0]"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span className="text-[#8B7A6C]">
                  {review.product.name}
                </span>
              </span>
            )}

            {/* DATE */}
            <span className="inline-flex items-center gap-1.5">
              <Calendar
                className="h-3 w-3 text-[#B8AAA0]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {formatReviewDate(
                review.createdAt
              )}
            </span>
          </div>
        </div>

        {/* ====================================================
            ACTIONS
        ==================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
            lg:pt-1
          "
        >
          {/* ==================================================
              VIEW
          ================================================== */}

          <button
            type="button"
            onClick={onView}
            aria-label={`View ${
              review.title || "review"
            }`}
            title="View review"
            className="
              inline-flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              text-[#3D6ED8]
              border-[#D7E2F8]
              bg-[#F2F6FF]
              hover:border-[#BFD0F5]
              hover:bg-[#E8F0FF]
              focus:outline-none
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <Eye
              className="h-[16px] w-[16px]"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>

          {/* ==================================================
              VERIFY
          ================================================== */}

          {review.status !==
            "VERIFIED" && (
            <button
              type="button"
              onClick={onVerify}
              disabled={isActioning}
              aria-label={`Verify ${
                review.title || "review"
              }`}
              title="Verify review"
              className="
                inline-flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-[#CFE4D4]
                bg-[#EEF8F2]
                text-[#34764A]
                hover:border-[#B7D8C0]
                hover:bg-[#E3F3E8]
                focus:outline-none
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isActioning ? (
                <Loader2
                  className="
                    h-[16px]
                    w-[16px]
                    animate-spin
                  "
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              ) : (
                <CheckCircle2
                  className="h-[16px] w-[16px]"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              )}
            </button>
          )}

          {/* ==================================================
              REJECT
          ================================================== */}

          {review.status !==
            "REJECTED" && (
            <button
              type="button"
              onClick={onReject}
              disabled={isActioning}
              aria-label={`Reject ${
                review.title || "review"
              }`}
              title="Reject review"
              className="
                inline-flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-[#F0D1D5]
                bg-[#FFF3F5]
                text-[#C45D6D]
                hover:border-[#E8B9C0]
                hover:bg-[#FCE7EA]
                hover:text-[#B84D5E]
                focus:outline-none
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isActioning ? (
                <Loader2
                  className="
                    h-[16px]
                    w-[16px]
                    animate-spin
                  "
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              ) : (
                <XCircle
                  className="h-[16px] w-[16px]"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewRow;