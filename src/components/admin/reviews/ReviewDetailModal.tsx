import {
  CheckCircle2,
  Loader2,
  MessageSquareText,
  Star,
  X,
  XCircle,
} from "lucide-react";

import type { AdminReview } from "../../../api/adminReviewApi";

import ReviewStatusBadge from "./ReviewStatusBadge";
import { formatReviewDate } from "./reviewUtils";

interface ReviewDetailModalProps {
  review: AdminReview;
  actionId: number | null;
  onClose: () => void;
  onVerify: () => void;
  onReject: () => void;
}

interface InfoBoxProps {
  label: string;
  value: string;
}

function ReviewDetailModal({
  review,
  actionId,
  onClose,
  onVerify,
  onReject,
}: ReviewDetailModalProps) {
  const isActioning =
    actionId === review.id;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-[#1F2937]/45
        px-4
        py-6
        backdrop-blur-sm
      "
    >
      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-[#EFE3D2]
          bg-white
          shadow-sm
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            gap-4
            border-b
            border-[#EFE3D2]
            px-5
            py-4
            sm:px-6
          "
        >
          <div className="min-w-0 pr-3">

            <h2
              className="
                mt-2
                break-words
                text-[16px] md:text-[18px]
                font-semibold
                tracking-[-0.02em]
                text-[#1F4A2E]
              "
            >
              {review.title ||
                "Untitled Review"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isActioning}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#E8DED3]
              bg-[#FFFCF8]
              text-[#8B7A6C]
              hover:border-[#D9B8C1]
              hover:bg-[#FBECEF]
              hover:text-[#B5697A]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Close review details"
          >
            <X
              className="h-3 w-3"
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* BODY */}

        <div
          className="
            min-h-0
            overflow-y-auto
            px-5
            py-6
            sm:px-6
          "
        >
          {/* RATING */}

          <div className="flex flex-wrap items-center gap-3">
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
                        ? "h-[18px] w-[18px] fill-[#D79A3B] text-[#D79A3B]"
                        : "h-[18px] w-[18px] text-[#DED4CA]"
                    }
                    strokeWidth={1.7}
                  />
                )
              )}
            </div>

            <span className="text-[12px] text-[#6F6259]">
              {review.rating}/5
            </span>

            <ReviewStatusBadge
              status={review.status}
            />
          </div>

          {/* COMMENT */}

          <div
            className="
              mt-4
              rounded-xl
              border
              border-[#EFE3D2]
              bg-[#FFFCF8]
              p-5
            "
          >
            <div className="mb-3 flex items-center gap-2">
              <MessageSquareText
                className="h-4 w-4 text-[#B5697A]"
                strokeWidth={1.8}
              />

              <span
                className="
                  text-[11px]
                  uppercase
                  tracking-[0.08em]
                  text-[#8B7A6C]
                "
              >
                Customer Comment
              </span>
            </div>

            <p
              className="
                text-[12px] md:text-[13px]
                leading-relaxed
                text-gray-600
              "
            >
              {review.comment ||
                "No comment provided."}
            </p>
          </div>

          {/* INFO */}

          <div className="mt-4">

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBox
                label="Customer"
                value={
                  review.displayName ||
                  "Customer"
                }
              />

              <InfoBox
                label="Email"
                value={
                  review.email ||
                  "Not provided"
                }
              />

              <InfoBox
                label="Product"
                value={
                  review.product?.name ||
                  `Product #${review.productId}`
                }
              />

              <InfoBox
                label="Submitted"
                value={formatReviewDate(
                  review.createdAt
                )}
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div
          className="
            flex
            shrink-0
            flex-col-reverse
            gap-2
            border-t
            border-[#EFE3D2]
            bg-[#FFFCF8]
            px-5
            py-4
            sm:flex-row
            sm:justify-end
            sm:px-6
          "
        >

          {review.status !==
            "REJECTED" && (
            <button
              type="button"
              onClick={onReject}
              disabled={isActioning}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#F0D1D5]
                bg-[#FFF3F5]
                px-4
                py-2.5
                text-[12px]
                text-[#C45D6D]
                hover:border-[#E8B9C0]
                hover:bg-[#FCE7EA]
                focus:outline-none
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isActioning ? (
                <Loader2
                  className="h-[15px] w-[15px] animate-spin"
                  strokeWidth={1.8}
                />
              ) : (
                <XCircle
                  className="h-[15px] w-[15px]"
                  strokeWidth={1.8}
                />
              )}

              Reject
            </button>
          )}

          {review.status !==
            "VERIFIED" && (
            <button
              type="button"
              onClick={onVerify}
              disabled={isActioning}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#CFE4D4]
                bg-[#EEF8F2]
                px-4
                py-2.5
                text-[12px]
                text-[#3F8A58]
                hover:border-[#B7D8C0]
                hover:bg-[#E3F3E8]
                focus:outline-none
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isActioning ? (
                <Loader2
                  className="h-[15px] w-[15px] animate-spin"
                  strokeWidth={1.8}
                />
              ) : (
                <CheckCircle2
                  className="h-[15px] w-[15px]"
                  strokeWidth={1.8}
                />
              )}

              Verify
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: InfoBoxProps) {
  return (
    <div
      className="
        rounded-xl
        border
        border-[#EFE3D2]
        bg-white
        px-4
        py-3
        transition-colors
        duration-200
        hover:bg-[#FFFCF8]
      "
    >
      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.08em]
          text-[#A0958C]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1.5
          break-words
          text-[12px]
          text-[#3D3834]
        "
      >
        {value}
      </p>
    </div>
  );
}

export default ReviewDetailModal;