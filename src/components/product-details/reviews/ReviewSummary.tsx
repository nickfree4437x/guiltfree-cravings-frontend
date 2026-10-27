import ReviewStars from "./ReviewStars";

import type { ReviewSummary as ReviewSummaryType } from "../../../api/reviewApi";

// ─── Types ────────────────────────────────────────────────
interface ReviewSummaryProps {
  summary: ReviewSummaryType;
}

// ─── Mini Star ────────────────────────────────────────────
function StarMini() {
  return (
    <span className="text-[11px] text-[#B5697A]" aria-hidden="true">
      ★
    </span>
  );
}

// ─── Component ────────────────────────────────────────────
function ReviewSummary({ summary }: ReviewSummaryProps) {
  const { totalReviews, averageRating, breakdown } = summary;

  // Safe fallback if breakdown is missing from API
  const safeBreakdown = {
    5: breakdown?.[5] ?? 0,
    4: breakdown?.[4] ?? 0,
    3: breakdown?.[3] ?? 0,
    2: breakdown?.[2] ?? 0,
    1: breakdown?.[1] ?? 0,
  };

  const avg = Number(averageRating || 0);

  return (
    <div className="rounded-xl border border-[#F0DDE2] bg-[#FFFCFD] p-5 sm:p-6">
      <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
        {/* Average rating */}
        <div className="text-center sm:border-r sm:border-[#F0DDE2] sm:pr-6">
          <div className="text-[35px] font-semibold leading-[1.1] tracking-tight text-gray-700">
            {avg.toFixed(1)}
          </div>

          <div className="mt-3 flex justify-center">
            <ReviewStars rating={avg} size={18} />
          </div>

          <p className="mt-2 text-[12px] text-slate-500">
            {totalReviews}{" "}
            {totalReviews === 1 ? "verified review" : "verified reviews"}
          </p>
        </div>

        {/* Rating breakdown */}
        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = safeBreakdown[rating as keyof typeof safeBreakdown];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-3">
                <span className="w-8 text-right text-[12px] text-slate-500">{rating}</span>
                <StarMini />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F3E8EB]">
                  <div
                    className="h-full rounded-full bg-[#B5697A] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-6 text-[11px] text-slate-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ReviewSummary;