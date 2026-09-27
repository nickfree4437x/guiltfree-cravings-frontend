import { Quote } from "lucide-react";

import StarRating from "./StarRating";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  review: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  isNew?: boolean;
}

function TestimonialCard({
  testimonial,
  isNew = false,
}: TestimonialCardProps) {
  return (
    <article
      className="
        group
        relative
        flex
        w-full
        shrink-0
        snap-start
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-[#EADBD0]
        bg-gradient-to-br
        from-[#FFF9F5]
        via-[#FFFDFB]
        to-[#FBECEF]
        p-6
        shadow-sm
        sm:w-[70%]
        sm:p-7
        md:w-[48%]
        lg:w-[32%]
        lg:p-8
      "
    >
      {/* Soft decorative glow */}

      {/* <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-16
          h-36
          w-36
          rounded-full
          bg-[#F5E9D9]/45
          blur-3xl
        "
      /> */}

      {/* Quote mark */}
      <Quote
        className="
          absolute
          right-5
          top-5
          z-10
          h-7
          w-7
          text-[#B5697A]/15
        "
        fill="currentColor"
        strokeWidth={0}
        aria-hidden="true"
      />

      {/* Rating */}
      <div className="relative z-10">
        <StarRating
          rating={testimonial.rating}
          size="sm"
        />
      </div>

      {/* New review indicator */}
      {isNew && (
        <span
          className="
            absolute
            right-5
            top-[52px]
            z-10
            rounded-full
            border
            border-[#E5C5CC]
            bg-[#F8E8EC]
            px-2.5
            py-1
            text-[9px]
            tracking-wide
            text-[#B5697A]
          "
        >
          New
        </span>
      )}

      {/* Review */}
      <p
        className="
          relative
          z-10
          mt-5
          flex-1
          text-[12px]
          leading-[1.5]
          text-gray-500
          sm:text-[13px]
          md:text-[14px]
        "
      >
        &ldquo;{testimonial.review}&rdquo;
      </p>

      {/* Divider */}
      <div
        className="
          relative
          z-10
          mt-6
          h-px
          w-full
          bg-[#EADBD0]
        "
      />

      {/* Customer */}
      <div
        className="
          relative
          z-10
          mt-5
          flex
          items-center
          gap-3
        "
      >
        <span
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#B5697A]
            text-[14px]
            text-white
          "
        >
          {testimonial.name
            .charAt(0)
            .toUpperCase()}
        </span>

        <div className="min-w-0">
          <p
            className="
              truncate
              text-[14px]
              font-semibold
              leading-tight
              text-[#1F4A2E]
              sm:text-[14.5px]
            "
          >
            {testimonial.name}
          </p>

          <p
            className="
              mt-0.5
              text-[10px]
              tracking-[0.12em]
              text-[#8B7A6C]
              sm:text-[10px]
            "
          >
            {testimonial.role}
          </p>
        </div>
      </div>
    </article>
  );
}

export default TestimonialCard;