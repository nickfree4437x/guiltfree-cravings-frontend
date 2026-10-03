import {
  Star,
} from "lucide-react";

interface ReviewStarsProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

function ReviewStars({
  rating,
  size = 17,
  interactive = false,
  onChange,
}: ReviewStarsProps) {
  const safeRating = Math.max(
    0,
    Math.min(
      5,
      Math.round(
        Number.isFinite(rating)
          ? rating
          : 0
      )
    )
  );

  const handleRatingChange = (
    value: number
  ) => {
    if (!interactive) {
      return;
    }

    onChange?.(value);
  };

  return (
    <div
      className="flex items-center gap-0.5"
      role={
        interactive
          ? "radiogroup"
          : undefined
      }
      aria-label={
        interactive
          ? "Select a rating"
          : `Rating ${safeRating} out of 5`
      }
    >
      {[1, 2, 3, 4, 5].map(
        (star) => {
          const filled =
            star <= safeRating;

          if (interactive) {
            return (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={
                  star === safeRating
                }
                aria-label={`${star} star${
                  star > 1
                    ? "s"
                    : ""
                }`}
                onClick={() =>
                  handleRatingChange(
                    star
                  )
                }
                className="group rounded-sm p-0.5 outline-none transition-transform duration-150 hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#B5697A]/30"
              >
                <Star
                  size={size}
                  strokeWidth={1.8}
                  className={
                    filled
                      ? "fill-[#B5697A] text-[#B5697A]"
                      : "text-[#B5697A] transition-colors duration-150 group-hover:fill-[#B5697A]/20"
                  }
                />
              </button>
            );
          }

          return (
            <Star
              key={star}
              size={size}
              strokeWidth={1.8}
              aria-hidden="true"
              className={
                filled
                  ? "fill-[#B5697A] text-[#B5697A]"
                  : "text-[#B5697A]"
              }
            />
          );
        }
      )}
    </div>
  );
}

export default ReviewStars;