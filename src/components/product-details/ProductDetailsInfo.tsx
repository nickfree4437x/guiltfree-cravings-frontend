import { useEffect, useMemo, useState } from "react";

import {
  Leaf,
  Droplets,
  ShieldCheck,
  House,
} from "lucide-react";

import type { Product, ProductVariant } from "../../api/productApi";
import { getPublicOffers } from "../../api/offerApi";
import type { Offer } from "../../api/offerApi";

import PackagingSelector from "./PackagingSelector";
import ProductVariantSelector from "./ProductVariantSelector";
import ProductQuantitySelector from "./ProductQuantitySelector";
import ProductPurchaseActions from "./ProductPurchaseActions";

// ─── Types ────────────────────────────────────────────────

interface ProductDetailsInfoProps {
  product: Product;
  availablePackagings: string[];
  selectedPackaging: string;
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  quantity: number;
  onPackagingChange: (packaging: string) => void;
  onVariantChange: (variant: ProductVariant) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onViewCart: () => void;
}

interface OfferPreview {
  offer: Offer;
  discountAmount: number;
  finalPrice: number;
  originalPrice: number;
}

// ─── Config ───────────────────────────────────────────────

const TRUST_BADGES = [
  { icon: Leaf, label: "No Refined Sugar" },
  { icon: Droplets, label: "No Palm Oil" },
  { icon: ShieldCheck, label: "No Preservatives" },
  { icon: House, label: "Made at Home" },
];

const PACKAGING_LABELS: Record<string, string> = {
  "Plastic Box": "Regular",
  "Cardboard Box": "Cardboard Boxes",
  "Glass Jar": "Glass Jars",
};

const getPackagingLabel = (packaging: string) =>
  PACKAGING_LABELS[packaging] ?? packaging;

const formatPrice = (price: number) =>
  `₹${Math.round(price).toLocaleString("en-IN")}`;

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

function isOfferApplicableToVariant(
  offer: Offer,
  variantId: number
): boolean {
  const variantIds =
    offer.variantIds ??
    offer.offerVariants?.map((item) => item.variantId) ??
    [];

  return variantIds.length === 0 || variantIds.includes(variantId);
}

function getOfferDiscount(
  offer: Offer,
  subtotal: number
): number {
  if (subtotal <= 0) return 0;

  if (
    offer.minOrderValue !== null &&
    offer.minOrderValue !== undefined &&
    subtotal < Number(offer.minOrderValue)
  ) {
    return 0;
  }

  let discount = 0;

  if (offer.discountType === "PERCENTAGE") {
    discount = (subtotal * Number(offer.discountValue)) / 100;
  } else {
    discount = Number(offer.discountValue);
  }

  if (
    offer.maxDiscount !== null &&
    offer.maxDiscount !== undefined
  ) {
    discount = Math.min(discount, Number(offer.maxDiscount));
  }

  return Math.min(Math.max(discount, 0), subtotal);
}

// ─── Component ────────────────────────────────────────────

function ProductDetailsInfo({
  product,
  availablePackagings,
  selectedPackaging,
  variants,
  selectedVariant,
  quantity,
  onPackagingChange,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  onViewCart,
}: ProductDetailsInfoProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);

  // ─── Fetch Public Offers ─────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const fetchOffers = async () => {
      try {
        const publicOffers = await getPublicOffers();

        if (!cancelled) {
          setOffers(
            Array.isArray(publicOffers) ? publicOffers : []
          );
        }
      } catch (error) {
        console.error("Failed to fetch public offers:", error);

        if (!cancelled) {
          setOffers([]);
        }
      } finally {
        if (!cancelled) {
          setOffersLoading(false);
        }
      }
    };

    void fetchOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  // ─── Find Applicable Public Offer ────────────────────────

  const applicableOffer = useMemo<Offer | null>(() => {
    if (!selectedVariant || offers.length === 0) {
      return null;
    }

    const now = Date.now();

    return (
      offers.find((offer) => {
        return (
          offer.isActive &&
          offer.audience === "PUBLIC" &&
          isOfferDateValid(offer, now) &&
          isOfferApplicableToVariant(
            offer,
            selectedVariant.id
          )
        );
      }) ?? null
    );
  }, [offers, selectedVariant]);

  // ─── Calculate Discounted Price ──────────────────────────

  const offerPreview = useMemo<OfferPreview | null>(() => {
    if (!selectedVariant || !applicableOffer) {
      return null;
    }

    const originalPrice =
      Number(selectedVariant.price) * quantity;

    if (
      !Number.isFinite(originalPrice) ||
      originalPrice <= 0
    ) {
      return null;
    }

    const discountAmount = getOfferDiscount(
      applicableOffer,
      originalPrice
    );

    if (discountAmount <= 0) {
      return null;
    }

    return {
      offer: applicableOffer,
      originalPrice,
      discountAmount,
      finalPrice: originalPrice - discountAmount,
    };
  }, [selectedVariant, applicableOffer, quantity]);

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="flex flex-col p-6 sm:p-8 lg:p-10 xl:p-12">
      {/* Product Name */}
      <h1 className="text-[20px] sm:text-[24px] md:text-[26px] font-semibold md:-mt-4 -mt-5 tracking-wide text-[#C9788B] leading-snug md:whitespace-nowrap">
        {product.name}
      </h1>

      {/* Description */}
      <p className="mt-1 text-[12px] sm:text-[13.5px] md:text-[13.5px] leading-relaxed font-light tracking-wide text-justify text-gray-500">
        {product.description}
      </p>

      {/* Trust Badges */}
      <div className="mt-2 grid grid-cols-2 gap-5 pt-6 sm:grid-cols-4">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center text-center"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FBEEF1] text-[#B5697A]">
              <Icon size={19} strokeWidth={1.7} />
            </div>

            <p className="mt-3 text-[11px] font-semibold leading-4 text-gray-600 sm:text-xs">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Packaging */}
      <PackagingSelector
        packagings={availablePackagings}
        selectedPackaging={selectedPackaging}
        onChange={onPackagingChange}
      />

      {/* Sizes */}
      <ProductVariantSelector
        variants={variants}
        selectedVariant={selectedVariant}
        onChange={onVariantChange}
      />

      {/* Purchase Section */}
      <div className="mt-5">
        <div className="flex items-end justify-between gap-4">
          {/* Quantity */}
          <ProductQuantitySelector
            quantity={quantity}
            onChange={onQuantityChange}
          />

          {/* Price */}
          {selectedVariant && (
            <div className="pb-1 text-right">
              {!offersLoading && offerPreview ? (
                <>
                  {/* Discounted Price */}
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span className="text-[16px] font-semibold text-gray-700 md:text-[18px]">
                      {formatPrice(offerPreview.finalPrice)}
                    </span>

                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(offerPreview.originalPrice)}
                    </span>
                  </div>

                  {/* Savings (GFC20 applied) */}
                  <div className="mt-1 flex items-center justify-end gap-1.5">
                    <span className="text-[10px] text-[#28583B]">
                      {offerPreview.offer.code} applied
                    </span>

                    <span className="rounded-full bg-[#EAF4EC] px-2 py-0.5 text-[9px] text-[#28583B]">
                      SAVE {formatPrice(offerPreview.discountAmount)}
                    </span>
                  </div>

                  {/* Variant Label */}
                  <p className="mt-1 text-[10px] text-slate-500">
                    {selectedVariant.quantity}
                    {selectedVariant.unit} ·{" "}
                    {getPackagingLabel(selectedPackaging)}
                  </p>
                </>
              ) : (
                <>
                  {/* Regular Price */}
                  <div className="flex items-end justify-end gap-2">
                    <span className="text-[14px] font-semibold text-gray-600 md:text-[17px]">
                      {formatPrice(
                        Number(selectedVariant.price) * quantity
                      )}
                    </span>

                    <span className="pb-0.5 text-xs text-slate-500">
                      {selectedVariant.quantity}
                      {selectedVariant.unit} ·{" "}
                      {getPackagingLabel(selectedPackaging)}
                    </span>
                  </div>

                  {/* Per Pack Price */}
                  <p className="mt-1 text-[10px] text-gray-400">
                    {formatPrice(
                      Number(selectedVariant.price)
                    )}{" "}
                    per pack
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Purchase Actions */}
        <ProductPurchaseActions
          disabled={!selectedVariant}
          onAddToCart={onAddToCart}
          onViewCart={onViewCart}
        />
      </div>
    </div>
  );
}

export default ProductDetailsInfo;