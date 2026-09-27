import { useState } from "react";

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

function StarRating({
  rating,
  interactive = false,
  onChange,
  size = "sm",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const activeRating =
    interactive && hoverRating > 0
      ? hoverRating
      : rating;

  const starSize =
    size === "lg"
      ? "h-6 w-6"
      : size === "md"
        ? "h-5 w-5"
        : "h-3.5 w-3.5";

  const handleClick = (value: number) => {
    if (!interactive || !onChange) return;

    onChange(value);
  };

  return (
    <div
      className="flex items-center gap-1"
      role={interactive ? "radiogroup" : undefined}
      aria-label={
        interactive
          ? "Select rating"
          : `${rating} out of 5 stars`
      }
      onMouseLeave={() => {
        if (interactive) {
          setHoverRating(0);
        }
      }}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= activeRating;

        return (
          <button
            key={starValue}
            type={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : -1}
            disabled={!interactive}
            onMouseEnter={() => {
              if (interactive) {
                setHoverRating(starValue);
              }
            }}
            onClick={() => handleClick(starValue)}
            aria-label={
              interactive
                ? `${starValue} star${starValue > 1 ? "s" : ""}`
                : undefined
            }
            className={`
              ${
                interactive
                  ? "cursor-pointer"
                  : "cursor-default"
              }
              ${interactive ? "rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]/40" : ""}
            `}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`
                ${starSize}
                transition-colors
                duration-200
                ${
                  isActive
                    ? "text-[#B5697A]"
                    : "text-[#E7DDD5]"
                }
              `}
              aria-hidden="true"
            >
              <path d="m12 2.5 2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.57l-5.9 3.11 1.13-6.58L2.45 9.44l6.6-.96L12 2.5Z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;