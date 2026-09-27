import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PenLine,
} from "lucide-react";

import ReviewModal from "./sections/ReviewModal";
import TestimonialCard, {
  type Testimonial,
} from "./sections/TestimonialCard";

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Ananya Sharma",
    role: "Delhi",
    review:
      "The laddoos were honestly delicious. They tasted homemade, fresh and not overly sweet. The Dates Delight has become my favourite already.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rohit Mehta",
    role: "Gurugram",
    review:
      "I ordered the Dry Fruit Sattu Laddoo for my family and everyone loved them. The texture was perfect and the taste felt really authentic.",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Kapoor",
    role: "Noida",
    review:
      "Really loved how light and fresh these laddoos tasted. You can actually feel the homemade touch in every bite. Definitely ordering again.",
    rating: 5,
  },
  {
    id: 4,
    name: "Neha Arora",
    role: "Delhi",
    review:
      "I was looking for a healthier sweet option and these were exactly what I wanted. The ingredients and taste both felt thoughtfully done.",
    rating: 5,
  },
  {
    id: 5,
    name: "Karan Malhotra",
    role: "Faridabad",
    review:
      "The Sattu Laddoo was excellent. It wasn't too sweet and had a lovely roasted flavour. Great with evening chai and perfect for gifting too.",
    rating: 5,
  },
];

const STORAGE_KEY =
  "guiltfree-cravings-testimonials";

function TestimonialsSection() {
  const scrollRef =
    useRef<HTMLDivElement | null>(null);

  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(
      INITIAL_TESTIMONIALS
    );

  const [isReviewModalOpen, setIsReviewModalOpen] =
    useState(false);

  const [newReviewId, setNewReviewId] =
    useState<number | null>(null);

  /*
   * Load previously submitted reviews.
   *
   * This keeps reviews visible even after a page refresh.
   * Backend integration can replace this later.
   */
  useEffect(() => {
    try {
      const storedReviews =
        window.localStorage.getItem(
          STORAGE_KEY
        );

      if (!storedReviews) {
        return;
      }

      const parsedReviews = JSON.parse(
        storedReviews
      ) as Testimonial[];

      if (
        Array.isArray(parsedReviews) &&
        parsedReviews.length > 0
      ) {
        setTestimonials([
          ...parsedReviews,
          ...INITIAL_TESTIMONIALS,
        ]);
      }
    } catch (error) {
      console.error(
        "Failed to load customer reviews:",
        error
      );
    }
  }, []);

  const handleScroll = (
    direction: "left" | "right"
  ) => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const scrollAmount =
      container.clientWidth * 0.85;

    container.scrollBy({
      left:
        direction === "left"
          ? -scrollAmount
          : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleWriteReview = () => {
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (
    review: Testimonial
  ) => {
    setTestimonials((previous) => [
      review,
      ...previous,
    ]);

    setNewReviewId(review.id);

    /*
     * Store only user-submitted reviews.
     * Demo reviews remain in the source code.
     */
    try {
      const storedReviews =
        window.localStorage.getItem(
          STORAGE_KEY
        );

      const existingReviews: Testimonial[] =
        storedReviews
          ? (JSON.parse(
              storedReviews
            ) as Testimonial[])
          : [];

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
          review,
          ...existingReviews,
        ])
      );
    } catch (error) {
      console.error(
        "Failed to save customer review:",
        error
      );
    }

    /*
     * Scroll to the beginning so the newly
     * submitted review is immediately visible.
     */
    window.setTimeout(() => {
      scrollRef.current?.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }, 100);

    /*
     * Remove the "New" indicator after a short time.
     */
    window.setTimeout(() => {
      setNewReviewId(null);
    }, 4000);
  };

  return (
    <>
      <section
        id="testimonials"
        className="
          relative
          overflow-hidden
          bg-white
          py-10
          md:py-12
        "
      >
        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[1300px]
            px-6
            sm:px-10
            md:px-14
            lg:px-20
          "
        >
          {/* ================= HEADER ================= */}
          <div
            className="
              flex
              flex-col
              gap-6
              md:flex-row
              md:items-end
              md:justify-between
            "
          >
            {/* LEFT — Heading */}
            <div
              className="
                max-w-xl
                text-center
                md:text-left
              "
            >
              <h2
                className="
                  anim-fadeUp
                  delay-2
                  mb-1
                  text-[20px]
                  font-semibold
                  leading-snug
                  tracking-wide
                  text-[#C9788B]
                  sm:text-[24px]
                  md:whitespace-nowrap
                  md:text-[28px]
                "
              >
                Words from our customers
              </h2>

              <p
                className="
                  mx-auto
                  mt-0
                  max-w-[580px]
                  text-[12.5px]
                  leading-relaxed
                  tracking-wide
                  text-[#2c2c2c]
                  sm:text-[13.5px]
                  md:text-[14px]
                "
              >
                Real stories from real laddoo
                lovers.
              </p>
            </div>

            {/* RIGHT — Write Review + Arrows */}
            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                md:justify-end
              "
            >
              {/* Write a Review */}
              <button
                type="button"
                onClick={handleWriteReview}
                className="
                  group/review
                  inline-flex
                  shrink-0
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#B5697A]/30
                  bg-[#B5697A]
                  px-4
                  py-2.5
                  text-[12px]
                  tracking-wide
                  text-white
                  transition-all
                  duration-300
                  hover:border-[#B5697A]
                  hover:shadow-sm
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#B5697A]/50
                  focus-visible:ring-offset-2
                  active:scale-[0.98]
                  sm:text-[12.5px]
                "
              >
                <PenLine
                  className="
                    h-3.5
                    w-3.5
                  "
                  strokeWidth={2.2}
                  aria-hidden="true"
                />

                Write a Review
              </button>

              {/* Desktop arrows */}
              <div
                className="
                  hidden
                  shrink-0
                  items-center
                  gap-2.5
                  md:flex
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    handleScroll("left")
                  }
                  aria-label="Scroll testimonials left"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#EFE3D2]
                    bg-white
                    text-[#8B7A6C]
                    transition-all
                    duration-300
                    hover:border-[#B5697A]
                    hover:text-[#B5697A]
                    hover:shadow-sm
                    active:scale-95
                  "
                >
                  <ChevronLeft
                    className="h-4 w-4"
                    strokeWidth={2.2}
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleScroll("right")
                  }
                  aria-label="Scroll testimonials right"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#EFE3D2]
                    bg-white
                    text-[#8B7A6C]
                    transition-all
                    duration-300
                    hover:border-[#B5697A]
                    hover:text-[#B5697A]
                    hover:shadow-sm
                    active:scale-95
                  "
                >
                  <ChevronRight
                    className="h-4 w-4"
                    strokeWidth={2.2}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ================= REVIEWS ================= */}
          <div
            ref={scrollRef}
            className="
              relative
              mt-8
              flex
              snap-x
              snap-mandatory
              gap-5
              overflow-x-auto
              pb-4
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              sm:mt-10
              sm:gap-6
            "
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isNew={
                  testimonial.id ===
                  newReviewId
                }
              />
            ))}
          </div>

          {/* ================= MOBILE CONTROLS ================= */}
          <div
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-3
              md:hidden
            "
          >
            <button
              type="button"
              onClick={() =>
                handleScroll("left")
              }
              aria-label="Scroll testimonials left"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#EFE3D2]
                bg-white
                text-[#8B7A6C]
                transition-all
                hover:border-[#B5697A]
                hover:text-[#B5697A]
              "
            >
              <ChevronLeft
                className="h-4 w-4"
                strokeWidth={2.2}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                handleScroll("right")
              }
              aria-label="Scroll testimonials right"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#EFE3D2]
                bg-white
                text-[#8B7A6C]
                transition-all
                hover:border-[#B5697A]
                hover:text-[#B5697A]
              "
            >
              <ChevronRight
                className="h-4 w-4"
                strokeWidth={2.2}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ================= REVIEW MODAL ================= */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() =>
          setIsReviewModalOpen(false)
        }
        onSubmit={handleReviewSubmit}
      />
    </>
  );
}

export default TestimonialsSection;