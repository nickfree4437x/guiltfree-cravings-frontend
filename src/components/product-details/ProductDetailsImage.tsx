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

// ─── Helpers ──────────────────────────────────────────────

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const url = value.trim();

  return url.length > 0 ? url : null;
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

  const images = [
    ...(Array.isArray(packagingImages) ? packagingImages : []),
    legacyImage,
  ]
    .map(normalizeImageUrl)
    .filter((image): image is string => image !== null);

  return Array.from(new Set(images));
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

  // The selected Glass Jar variant's uploaded image.
  // Other packaging types do not use variant-specific images.
  const variantImage =
    selectedPackaging === "Glass Jar"
      ? normalizeImageUrl(variant?.image)
      : null;

  // Existing packaging gallery is used as a fallback.
  const packagingImages = useMemo(
    () => getPackagingImages(product, selectedPackaging),
    [
      product,
      selectedPackaging,
    ]
  );

  // Variant image comes first so it is displayed by default.
  // Existing gallery images remain available through navigation.
  const images = useMemo(() => {
    const combined = [
      ...(variantImage ? [variantImage] : []),
      ...packagingImages,
    ];

    return Array.from(new Set(combined));
  }, [variantImage, packagingImages]);

  // Reset gallery when the product, packaging, or selected variant changes.
  useEffect(() => {
    setActiveIndex(0);
  }, [
    product.id,
    selectedPackaging,
    variant?.id,
    variant?.quantity,
    variant?.unit,
    variant?.image,
  ]);

  // Keep the active index valid when the gallery changes.
  useEffect(() => {
    setActiveIndex((current) => {
      if (images.length === 0) return 0;

      return Math.min(current, images.length - 1);
    });
  }, [images.length]);

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

  const currentImage = images[activeIndex];
  const hasMultipleImages = images.length > 1;

  const variantLabel = variant
    ? `${variant.quantity}${variant.unit}`
    : "";

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="relative flex min-h-[300px] flex-col items-center overflow-hidden rounded-xl bg-white p-6 sm:min-h-[400px] sm:p-12 lg:sticky lg:top-[80px] lg:min-h-[600px] lg:self-start lg:p-12">
      {currentImage ? (
        <img
          key={`${currentImage}-${selectedPackaging}-${variant?.id ?? "default"}`}
          src={currentImage}
          alt={`${product.name} - ${selectedPackaging}${
            variantLabel ? ` - ${variantLabel}` : ""
          } - Image ${activeIndex + 1}`}
          className="relative z-[1] block max-h-[330px] w-full object-contain sm:max-h-[430px] lg:max-h-[500px]"
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
          Image unavailable for {selectedPackaging}
        </div>
      )}

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