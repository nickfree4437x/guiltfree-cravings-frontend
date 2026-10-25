import { useEffect, useState } from "react";

import type { Coupon } from "../../components/coupons/CouponCard";
import { getCustomerOffers, type Offer } from "../../api/offerApi";

import CouponsPageHeader from "../../components/coupons/CouponsPageHeader";
import CouponsLoadingState from "../../components/coupons/CouponsLoadingState";
import CouponsErrorState from "../../components/coupons/CouponsErrorState";
import CouponsEmptyState from "../../components/coupons/CouponsEmptyState";
import CouponsGrid from "../../components/coupons/CouponsGrid";
import CouponsUsageInfo from "../../components/coupons/CouponsUsageInfo";

// ─── Formatters ───────────────────────────────────────────
function formatDate(dateString: string | null) {
  if (!dateString) return "No expiry";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "No expiry";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDiscount(offer: Offer) {
  return offer.discountType === "PERCENTAGE"
    ? `${offer.discountValue}% OFF`
    : `₹${offer.discountValue} OFF`;
}

function formatMinimumOrder(minOrderValue: number | null) {
  if (minOrderValue === null || minOrderValue === undefined || minOrderValue <= 0) {
    return "No minimum order";
  }
  return `₹${minOrderValue}`;
}

// ─── Offer → Coupon Mapper ────────────────────────────────
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

// ─── Component ────────────────────────────────────────────
function CouponsPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch customer offers
  useEffect(() => {
    let isMounted = true;

    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError("");
        const customerOffers = await getCustomerOffers();
        if (!isMounted) return;
        setOffers(customerOffers);
      } catch (err) {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your offers right now."
        );
        setOffers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchOffers();
    return () => { isMounted = false; };
  }, []);

  const coupons = offers.map(mapOfferToCoupon);

  // Shared render conditions
  const isReady = !loading && !error;
  const hasCoupons = isReady && coupons.length > 0;

  // ─── Render ─────────────────────────────────────────────
  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-4 pb-10 pt-16 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-6xl">
        <CouponsPageHeader />

        {/* Loading */}
        {loading && <CouponsLoadingState />}

        {/* Error */}
        {!loading && error && <CouponsErrorState message={error} />}

        {/* Empty */}
        {isReady && coupons.length === 0 && <CouponsEmptyState />}

        {/* Grid + Usage Info */}
        {hasCoupons && (
          <>
            <CouponsGrid coupons={coupons} />
            <CouponsUsageInfo />
          </>
        )}
      </div>
    </main>
  );
}

export default CouponsPage;