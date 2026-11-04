
import { useEffect, useState } from "react";

import { getProducts, type Product } from "../../api/productApi";
import { getPublicOffers } from "../../api/offerApi";
import type { Offer } from "../../api/offerApi";

import ProductCard from "../product/ProductCard";

// ─── Types ────────────────────────────────────────────────

interface RecommendedProductsProps {
  currentProductId: number;
}

interface ProductOfferInfo {
  discountedVariantIds: number[];
  discountPercentage: number;
}

// ─── Shared Card Classes ──────────────────────────────────

const CARD_WIDTH =
  "w-full max-w-[280px] sm:w-[calc(50%-10px)] md:w-[280px] lg:w-[260px]";

// ─── Offer Helpers ────────────────────────────────────────

function isOfferDateValid(offer: Offer, now: number): boolean {
  const startTime = new Date(offer.startsAt).getTime();

  if (!Number.isFinite(startTime) || startTime > now) {
    return false;
  }

  if (offer.expiresAt) {
    const expiryTime = new Date(offer.expiresAt).getTime();

    if (!Number.isFinite(expiryTime) || expiryTime < now) {
      return false;
    }
  }

  return true;
}

function getProductOfferInfo(
  product: Product,
  offers: Offer[]
): ProductOfferInfo {
  const now = Date.now();

  const productVariants = product.variants ?? [];

  const applicableOffer = offers.find((offer) => {
    if (
      !offer.isActive ||
      offer.audience !== "PUBLIC" ||
      !isOfferDateValid(offer, now)
    ) {
      return false;
    }

    // Product-card pricing currently supports percentage offers.
    if (offer.discountType !== "PERCENTAGE") {
      return false;
    }

    const percentage = Number(offer.discountValue);

    if (
      !Number.isFinite(percentage) ||
      percentage <= 0 ||
      percentage > 100
    ) {
      return false;
    }

    const offerVariantIds =
      offer.variantIds ??
      offer.offerVariants?.map((item) => item.variantId) ??
      [];

    // Empty variant list means all product variants are eligible.
    const eligibleVariants =
      offerVariantIds.length === 0
        ? productVariants
        : productVariants.filter((variant) =>
            offerVariantIds.includes(variant.id)
          );

    return eligibleVariants.some(
      (variant) =>
        variant.packaging === "Plastic Box" &&
        variant.unit?.trim().toLowerCase() === "g" &&
        Number(variant.quantity) > 0
    );
  });

  if (!applicableOffer) {
    return {
      discountedVariantIds: [],
      discountPercentage: 0,
    };
  }

  const offerVariantIds =
    applicableOffer.variantIds ??
    applicableOffer.offerVariants?.map(
      (item) => item.variantId
    ) ??
    [];

  const eligibleVariants = productVariants.filter(
    (variant) =>
      variant.packaging === "Plastic Box" &&
      variant.unit?.trim().toLowerCase() === "g" &&
      Number(variant.quantity) > 0 &&
      (offerVariantIds.length === 0 ||
        offerVariantIds.includes(variant.id))
  );

  return {
    discountedVariantIds: eligibleVariants.map(
      (variant) => variant.id
    ),
    discountPercentage: Number(applicableOffer.discountValue),
  };
}

// ─── Component ────────────────────────────────────────────

function RecommendedProducts({
  currentProductId,
}: RecommendedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── Fetch Products and Public Offers ────────────────────

  useEffect(() => {
    let cancelled = false;

    const fetchRecommendedProducts = async () => {
      try {
        setLoading(true);

        const [allProducts, publicOffers] = await Promise.all([
          getProducts(),
          getPublicOffers(),
        ]);

        if (cancelled) return;

        const recommended = allProducts.filter(
          (product) =>
            product.id !== currentProductId &&
            product.isActive
        );

        setProducts(recommended);

        setOffers(
          Array.isArray(publicOffers) ? publicOffers : []
        );
      } catch (error) {
        console.error(
          "Failed to fetch recommended products:",
          error
        );

        if (!cancelled) {
          setProducts([]);
          setOffers([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchRecommendedProducts();

    return () => {
      cancelled = true;
    };
  }, [currentProductId]);

  // ─── Loading Skeleton ────────────────────────────────────

  if (loading) {
    return (
      <section className="w-full">
        <div className="mb-5 text-center">
          <div className="mx-auto h-5 w-52 animate-pulse rounded bg-[#F5EFE6]" />
          <div className="mx-auto mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-[#F5EFE6]" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`${CARD_WIDTH} overflow-hidden rounded-md bg-white shadow-[0_8px_30px_-18px_rgba(82,55,43,0.22)]`}
            >
              <div className="aspect-square w-full animate-pulse bg-[#F5EFE6]" />

              <div className="space-y-3 p-4">
                <div className="h-4 w-4/5 animate-pulse rounded bg-[#F5EFE6]" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-[#F5EFE6]" />
                <div className="h-9 w-full animate-pulse rounded bg-[#F5EFE6]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ─── Empty State ─────────────────────────────────────────

  if (products.length === 0) return null;

  // ─── Recommended Products ────────────────────────────────

  return (
    <section className="w-full mt-2 md:mt-4">
      <div className="mb-6 text-center">
        <h2 className="text-[20px] font-semibold tracking-wide text-[#2c2c2c] sm:text-[24px]">
          You May Also Like
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
        {products.map((product) => {
          const offerInfo = getProductOfferInfo(
            product,
            offers
          );

          return (
            <div key={product.id} className={CARD_WIDTH}>
              <ProductCard
                product={product}
                packaging="Plastic Box"
                discountedVariantIds={
                  offerInfo.discountedVariantIds
                }
                discountPercentage={
                  offerInfo.discountPercentage
                }
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RecommendedProducts;
