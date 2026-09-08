import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Loader2, TicketPercent } from "lucide-react";

import CouponCard, {
  type Coupon,
} from "../../components/coupons/CouponCard";

import {
  getCustomerOffers,
  type Offer,
} from "../../api/offerApi";

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "No expiry";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "No expiry";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDiscount(offer: Offer) {
  if (offer.discountType === "PERCENTAGE") {
    return `${offer.discountValue}% OFF`;
  }

  return `₹${offer.discountValue} OFF`;
}

function formatMinimumOrder(minOrderValue: number | null) {
  if (
    minOrderValue === null ||
    minOrderValue === undefined ||
    minOrderValue <= 0
  ) {
    return "No minimum order";
  }

  return `₹${minOrderValue}`;
}

function mapOfferToCoupon(offer: Offer): Coupon {
  return {
    id: offer.id,
    code: offer.code,
    title: offer.name,
    description:
      offer.audience === "SPECIFIC_CUSTOMER"
        ? "A special offer created for your account."
        : "Enjoy this offer on your eligible order with GuiltFree Cravings.",
    discount: formatDiscount(offer),
    minimumOrder: formatMinimumOrder(offer.minOrderValue),
    expiry: formatDate(offer.expiresAt),
  };
}

function CouponsPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError("");

        const customerOffers = await getCustomerOffers();

        if (!isMounted) {
          return;
        }

        setOffers(customerOffers);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : "Unable to load your offers right now.";

        setError(message);
        setOffers([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOffers();

    return () => {
      isMounted = false;
    };
  }, []);

  const coupons = offers.map(mapOfferToCoupon);

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#fffaf5] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <header className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
            Offers & Savings
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            My Coupons
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Discover the offers available for you and use your coupon codes
            at checkout to save more.
          </p>
        </header>

        {/* Coupon Count */}
        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-500">
              {coupons.length}{" "}
              {coupons.length === 1 ? "available offer" : "available offers"}
            </p>

            <Link
              to="/#products"
              className="shrink-0 text-sm font-semibold text-[#8b542f] transition-colors duration-200 hover:text-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
            >
              Shop Now →
            </Link>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <section
            aria-live="polite"
            className="rounded-3xl border border-[#eadfd3] bg-white px-6 py-16 text-center shadow-sm"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e4d3]">
              <Loader2
                className="h-5 w-5 animate-spin text-[#8b542f]"
                aria-hidden="true"
              />
            </div>

            <h2 className="mt-5 text-base font-semibold text-slate-900">
              Loading your offers
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We're checking the latest offers available for you.
            </p>
          </section>
        )}

        {/* Error State */}
        {!loading && error && (
          <section
            role="alert"
            className="rounded-3xl border border-red-100 bg-white px-6 py-12 text-center shadow-sm sm:px-8"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
              <AlertCircle
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>

            <h2 className="mt-5 text-base font-semibold text-slate-900">
              Unable to load offers
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {error}
            </p>
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && coupons.length === 0 && (
          <section className="rounded-3xl border border-[#eadfd3] bg-white px-6 py-14 text-center shadow-sm sm:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e4d3]">
              <TicketPercent
                className="h-6 w-6 text-[#8b542f]"
                aria-hidden="true"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No offers available right now
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              There are no active offers available for your account at the
              moment. Check back later for new savings.
            </p>

            <Link
              to="/#products"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#8b542f] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
            >
              Continue Shopping
            </Link>
          </section>
        )}

        {/* Coupon Grid */}
        {!loading && !error && coupons.length > 0 && (
          <section
            aria-label="Available coupons"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {coupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
              />
            ))}
          </section>
        )}

        {/* Coupon Information */}
        {!loading && !error && coupons.length > 0 && (
          <section className="mt-8 rounded-3xl border border-[#eadfd3] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3e4d3]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5 text-[#8b542f]"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7h.01"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  How to use a coupon
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Copy your coupon code and apply it during checkout before
                  completing your order.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Back to Shop */}
        <div className="mt-8 text-center">
          <Link
            to="/#products"
            className="inline-flex items-center text-sm font-semibold text-[#8b542f] transition-colors duration-200 hover:text-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default CouponsPage;