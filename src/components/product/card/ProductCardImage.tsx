
import { PackageX } from "lucide-react";
import { useState } from "react";

import type { Product, ProductVariant } from "../../../api/productApi";

// ─── Types ────────────────────────────────────────────────

interface ProductCardImageProps {
  product: Product;
  packaging?: "Plastic Box" | "Glass Jar" | "Cardboard Box";
  variant?: ProductVariant | null;
  compact?: boolean;
}

type PackagingType = "Plastic Box" | "Glass Jar" | "Cardboard Box";

type VariantWithImages = ProductVariant & {
  images?: string[];
  image?: string | null;
};

// ─── Helpers ──────────────────────────────────────────────

const getContainerSize = (compact: boolean) =>
  compact
    ? "h-full w-full"
    : "h-[140px] w-full sm:h-[220px] md:h-[260px]";

function getValidImage(image?: string | null): string | null {
  if (typeof image !== "string") return null;

  const trimmedImage = image.trim();

  return trimmedImage.length > 0 ? trimmedImage : null;
}

function getFirstValidImage(
  images?: (string | null | undefined)[]
): string | null {
  if (!Array.isArray(images)) return null;

  for (const image of images) {
    const validImage = getValidImage(image);

    if (validImage) return validImage;
  }

  return null;
}

/**
 * Supports multiple variant images and legacy single image.
 */
function getVariantFirstImage(
  variant?: ProductVariant | null
): string | null {
  if (!variant) return null;

  const variantWithImages = variant as VariantWithImages;

  return (
    getFirstValidImage(variantWithImages.images) ??
    getValidImage(variantWithImages.image)
  );
}

// ─── Packaging Image Selection ────────────────────────────

function getProductImage(
  product: Product,
  packaging: PackagingType,
  variant?: ProductVariant | null
): string | null {

  // Glass Jar:
  // First priority: selected variant's first image.
  // Fallback: other Glass Jar variant images.
  // Then: legacy product-level Glass Jar images.

  if (packaging === "Glass Jar") {
    return (
      (variant?.packaging === "Glass Jar"
        ? getVariantFirstImage(variant)
        : null) ??

      getFirstValidImage(
        product.variants
          ?.filter(
            (item) =>
              item.packaging === "Glass Jar" &&
              item.id !== variant?.id
          )
          .flatMap((item) => {
            const variantWithImages =
              item as VariantWithImages;

            return [
              ...(variantWithImages.images ?? []),
              variantWithImages.image,
            ];
          })
      ) ??

      getFirstValidImage(product.glassJarImages) ??
      getValidImage(product.glassJarImage) ??
      getFirstValidImage(product.images) ??
      getValidImage(product.image)
    );
  }

  // Cardboard Box:
  // Preserve existing image selection.

  if (packaging === "Cardboard Box") {
    return (
      getFirstValidImage(product.cardboardBoxImages) ??
      getValidImage(product.cardboardBoxImage) ??
      getFirstValidImage(product.images) ??
      getValidImage(product.image)
    );
  }

  // Regular / Plastic Box:
  // Preserve existing image selection.

  return (
    getFirstValidImage(product.regularImages) ??
    getValidImage(product.image) ??
    getFirstValidImage(product.images)
  );
}

// ─── Component ────────────────────────────────────────────

function ProductCardImage({
  product,
  packaging = "Plastic Box",
  variant = null,
  compact = false,
}: ProductCardImageProps) {
  const [imageState, setImageState] = useState<{
    src: string;
    loaded: boolean;
    error: boolean;
  }>({
    src: "",
    loaded: false,
    error: false,
  });

  const image = getProductImage(
    product,
    packaging,
    variant
  );

  // Only use image state belonging to the current image.
  const isLoaded =
    imageState.src === image && imageState.loaded;

  const hasError =
    imageState.src === image && imageState.error;

  const handleImageLoad = () => {
    if (!image) return;

    setImageState({
      src: image,
      loaded: true,
      error: false,
    });
  };

  const handleImageError = () => {
    if (!image) return;

    console.error("Product image failed to load:", {
      productId: product.id,
      productName: product.name,
      packaging,
      variantId: variant?.id,
      image,
    });

    setImageState({
      src: image,
      loaded: true,
      error: true,
    });
  };

  // ─── Image Fallback ─────────────────────────────────────

  if (!image || hasError) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-[#fffbfc] ${getContainerSize(
          compact
        )} ${
          compact
            ? "rounded-lg p-2"
            : "rounded-lg p-3 sm:p-5 md:p-6"
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            className={`flex items-center justify-center rounded-full bg-white shadow-sm ${
              compact ? "h-8 w-8" : "h-10 w-10 sm:h-12 sm:w-12"
            }`}
          >
            <PackageX
              className={`text-[#B5697A]/60 ${
                compact
                  ? "h-4 w-4"
                  : "h-4 w-4 sm:h-5 sm:w-5"
              }`}
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </span>

          {!compact && (
            <span className="text-[10px] font-medium text-[#8B7A6C] sm:text-[11px]">
              Image coming soon
            </span>
          )}
        </div>
      </div>
    );
  }

  // ─── Image Display ──────────────────────────────────────

  return (
    <div
      className={`group/image relative flex items-center justify-center overflow-hidden bg-white ${getContainerSize(
        compact
      )} ${
        compact
          ? "rounded-xl p-1.5"
          : "rounded-xl p-3 sm:p-5 md:p-6"
      }`}
    >
      {/* Shimmer Placeholder */}

      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] bg-[#fffbfc]"
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
      )}

      <img
        key={`${product.id}-${packaging}-${variant?.id ?? "default"}-${image}`}
        src={image}
        alt={`${product.name} ${packaging}${
          variant ? ` ${variant.quantity}${variant.unit}` : ""
        }`}
        loading="eager"
        decoding="async"
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`relative z-[2] h-full w-full object-contain object-center transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default ProductCardImage;
