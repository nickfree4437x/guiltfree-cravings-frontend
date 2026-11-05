
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Product, ProductVariant } from "../../api/productApi";

// ─── Types ────────────────────────────────────────────────

type PackagingOption = "Plastic Box" | "Cardboard Box" | "Glass Jar";

interface ProductDetailsImageProps {
  product: Product;
  packaging: string;
  variant?: ProductVariant | null;
}

type VariantWithImages = ProductVariant & {
  images?: string[];
  image?: string | null;
};

// ─── Helpers ──────────────────────────────────────────────

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const url = value.trim();

  return url.length > 0 ? url : null;
}

function uniqueImages(values: unknown[]): string[] {
  const images = values
    .map(normalizeImageUrl)
    .filter((image): image is string => image !== null);

  return Array.from(new Set(images));
}

/**
 * Supports:
 * - New variant.images[] gallery
 * - Legacy variant.image
 */
function getVariantImages(
  variant?: ProductVariant | null
): string[] {
  if (!variant) return [];

  const variantWithImages = variant as VariantWithImages;

  return uniqueImages([
    ...(Array.isArray(variantWithImages.images)
      ? variantWithImages.images
      : []),
    variantWithImages.image,
  ]);
}

function getPackagingImages(
  product: Product,
  packaging: PackagingOption
): string[] {
  const packagingImages =
    packaging === "Glass Jar"
      ? product.glassJarImages
      : packaging === "Cardboard Box"
        ? product.cardboardBoxImages
        : product.regularImages;

  const legacyImage =
    packaging === "Glass Jar"
      ? product.glassJarImage
      : packaging === "Cardboard Box"
        ? product.cardboardBoxImage
        : product.image;

  return uniqueImages([
    ...(Array.isArray(packagingImages) ? packagingImages : []),
    legacyImage,
  ]);
}

// ─── Navigation Button ────────────────────────────────────

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${
        direction === "prev" ? "previous" : "next"
      } product image`}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EFE3D2] bg-white text-[#B5697A] shadow-sm transition-colors hover:bg-[#B5697A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]"
    >
      <Icon size={18} />
    </button>
  );
}

// ─── Product Details Image ────────────────────────────────

function ProductDetailsImage({
  product,
  packaging,
  variant = null,
}: ProductDetailsImageProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedPackaging: PackagingOption =
    packaging === "Glass Jar"
      ? "Glass Jar"
      : packaging === "Cardboard Box"
        ? "Cardboard Box"
        : "Plastic Box";

  // --------------------------------------------------
  // SELECTED VARIANT IMAGES
  // Only Glass Jar uses individual variant galleries.
  // --------------------------------------------------

  const variantImages = useMemo(
    () =>
      selectedPackaging === "Glass Jar"
        ? getVariantImages(variant)
        : [],
    [
      selectedPackaging,
      variant?.id,
      variant?.image,
      (variant as VariantWithImages | null)?.images,
    ]
  );

  // --------------------------------------------------
  // PACKAGING GALLERY
  // Existing product-level images remain supported.
  // --------------------------------------------------

  const packagingImages = useMemo(
    () => getPackagingImages(product, selectedPackaging),
    [product, selectedPackaging]
  );

  // --------------------------------------------------
  // FINAL GALLERY
  //
  // Glass Jar:
  // Selected variant images first.
  // Existing packaging gallery is fallback.
  //
  // Other packaging:
  // Existing packaging gallery only.
  // --------------------------------------------------

  const images = useMemo(() => {
    if (
      selectedPackaging === "Glass Jar" &&
      variantImages.length > 0
    ) {
      return variantImages;
    }

    return packagingImages;
  }, [
    selectedPackaging,
    variantImages,
    packagingImages,
  ]);

  // --------------------------------------------------
  // RESET GALLERY WHEN SELECTION CHANGES
  // --------------------------------------------------

  useEffect(() => {
    setActiveIndex(0);
  }, [
    product.id,
    selectedPackaging,
    variant?.id,
    variant?.quantity,
    variant?.unit,
  ]);

  // --------------------------------------------------
  // KEEP ACTIVE INDEX VALID
  // --------------------------------------------------

  useEffect(() => {
    setActiveIndex((current) => {
      if (images.length === 0) return 0;

      return Math.min(current, images.length - 1);
    });
  }, [images.length]);

  // --------------------------------------------------
  // GALLERY NAVIGATION
  // --------------------------------------------------

  const goToPrevious = () => {
    if (images.length <= 1) return;

    setActiveIndex((current) =>
      current <= 0 ? images.length - 1 : current - 1
    );
  };

  const goToNext = () => {
    if (images.length <= 1) return;

    setActiveIndex((current) =>
      current >= images.length - 1 ? 0 : current + 1
    );
  };

  // --------------------------------------------------
  // CURRENT IMAGE
  // --------------------------------------------------

  const currentImage = images[activeIndex];

  const hasMultipleImages = images.length > 1;

  const variantLabel = variant
    ? `${variant.quantity}${variant.unit}`
    : "";

  const imageSourceLabel =
    selectedPackaging === "Glass Jar" &&
    variantImages.length > 0
      ? variantLabel
      : selectedPackaging;

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="relative flex min-h-[300px] flex-col items-center overflow-hidden rounded-xl bg-white p-6 sm:min-h-[400px] sm:p-12 lg:sticky lg:top-[80px] lg:min-h-[600px] lg:self-start lg:p-12">
      {currentImage ? (
        <img
          key={`${currentImage}-${selectedPackaging}-${variant?.id ?? "default"}`}
          src={currentImage}
          alt={`${product.name} - ${imageSourceLabel}${
            variantLabel &&
            selectedPackaging === "Glass Jar"
              ? ` - ${variantLabel}`
              : ""
          } - Image ${activeIndex + 1}`}
          className="relative z-[1] block max-h-[330px] rounded-lg w-full object-contain sm:max-h-[430px] lg:max-h-[500px]"
          loading="eager"
          decoding="async"
          onError={(event) => {
            console.error(
              "Failed to load product image:",
              event.currentTarget.src
            );
          }}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-center text-sm text-[#8B7A6C]">
          Image unavailable for{" "}
          {selectedPackaging}
          {variantLabel &&
            selectedPackaging === "Glass Jar" &&
            ` (${variantLabel})`}
        </div>
      )}

      {/* VARIANT / PACKAGING LABEL */}

      {currentImage && (
        <div className="relative z-[2] mt-3">
          <span className="rounded-full border border-[#EFE3D2] bg-white px-3 py-1.5 text-[11px] text-slate-500">
            {selectedPackaging === "Glass Jar" &&
            variantImages.length > 0
              ? `Glass Jar - ${variantLabel}`
              : selectedPackaging}
          </span>
        </div>
      )}

      {/* IMAGE NAVIGATION */}

      {hasMultipleImages && (
        <div className="relative z-[2] mt-4 flex w-full shrink-0 items-center justify-center gap-4">
          <NavButton
            direction="prev"
            onClick={goToPrevious}
          />

          <span
            className="min-w-[64px] rounded-full border border-[#EFE3D2] bg-white px-3 py-2 text-center text-xs text-[#8B7A6C] shadow-sm"
            aria-live="polite"
            aria-atomic="true"
          >
            {activeIndex + 1} / {images.length}
          </span>

          <NavButton
            direction="next"
            onClick={goToNext}
          />
        </div>
      )}
    </div>
  );
}

export default ProductDetailsImage;
