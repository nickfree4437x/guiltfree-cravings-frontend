import {
  CheckCircle2,
  Eye,
  Loader2,
  Star,
  XCircle,
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
        px-5
        py-5
        transition-colors
        sm:px-6
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          xl:flex-row
          xl:items-center
          xl:justify-between
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
                        ? "h-[14px] w-[14px] fill-[#D79A3B] text-[#D79A3B]"
                        : "h-[14px] w-[14px] text-[#DED4CA]"
                    }
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                )
              )}
            </div>

            <span className="text-[11px] text-[#8B7A6C]">
              {review.rating}/5
            </span>

            <ReviewStatusBadge
              status={review.status}
            />
          </div>

          {/* TITLE */}

          <h3
            className="
              mt-1
              text-[14px]
              font-semibold
              tracking-[-0.01em]
              text-gray-600
            "
          >
            {review.title ||
              "Untitled Review"}
          </h3>

          {/* COMMENT */}

          <p
            className="
              mt-0
              line-clamp-2
              max-w-3xl
              text-[12px]
              leading-relaxed
              text-[#8B7A6C]
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
            <span className=" text-[#6F6259]">
              {review.displayName ||
                "Customer"}
            </span>

            {review.email && (
              <span>
                {review.email}
              </span>
            )}

            {review.product?.name && (
              <span>
                Product:{" "}
                <span className="font-medium text-[#6F6259]">
                  {review.product.name}
                </span>
              </span>
            )}

            <span>
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
              rounded-xl
              border
              border-[#D7E2F8]
              bg-[#F2F6FF]
              text-[#4D7FEA]
              hover:border-[#BFD0F5]
              hover:bg-[#E8F0FF]
              hover:text-[#3D6ED8]
              focus:ring-[#4D7FEA]/15
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
                rounded-xl
                border
                border-[#CFE4D4]
                bg-[#EEF8F2]
                text-[#3F8A58]
                hover:border-[#B7D8C0]
                hover:bg-[#E3F3E8]
                hover:text-[#34764A]
                focus:outline-none
                focus:ring-[#3F8A58]/15
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
                rounded-xl
                border
                border-[#F0D1D5]
                bg-[#FFF3F5]
                text-[#C45D6D]
                hover:border-[#E8B9C0]
                hover:bg-[#FCE7EA]
                hover:text-[#B84D5E]
                focus:outline-none
                focus:ring-[#C45D6D]/15
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