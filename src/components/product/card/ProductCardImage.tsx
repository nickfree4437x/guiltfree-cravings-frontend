
import { PackageX } from "lucide-react";
import { useEffect, useState } from "react";

import type {
  Product,
  ProductVariant,
} from "../../../api/productApi";

interface ProductCardImageProps {
  product: Product;
  packaging?: "Plastic Box" | "Glass Jar" | "Cardboard Box";
  variant?: ProductVariant | null;
  compact?: boolean;
}

const GLASS_JAR_IMAGES: Record<
  string,
  { 350: string; 500: string }
> = {
  "dry fruit sattu laddoo": {
    350: "https://res.cloudinary.com/zhwlhmt4/image/upload/v1792518318/WhatsApp_Image_2026-10-19_at_11.25.07_PM.jpg",
    500: "https://res.cloudinary.com/zhwlhmt4/image/upload/v1792518221/WhatsApp_Image_2026-10-19_at_11.25.03_PM.jpg",
  },
  "sattu dry fruit laddoo": {
    350: "https://res.cloudinary.com/zhwlhmt4/image/upload/v1792518318/WhatsApp_Image_2026-10-19_at_11.25.07_PM.jpg",
    500: "https://res.cloudinary.com/zhwlhmt4/image/upload/v1792518221/WhatsApp_Image_2026-10-19_at_11.25.03_PM.jpg",
  },
  "dates delight laddoo": {
    350: "https://res.cloudinary.com/zhwlhmt4/image/upload/v1792518272/WhatsApp_Image_2026-10-19_at_11.25.06_PM.jpg",
    500: "https://res.cloudinary.com/zhwlhmt4/image/upload/v1792518159/WhatsApp_Image_2026-10-19_at_11.25.02_PM.jpg",
  },
};

function normalizeProductName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

function ProductCardImage({
  product,
  packaging = "Plastic Box",
  variant = null,
  compact = false,
}: ProductCardImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const normalizedProductName = normalizeProductName(product.name);

  const glassJarImageMap =
    GLASS_JAR_IMAGES[normalizedProductName];

  const isValidGlassJarVariant =
    packaging === "Glass Jar" &&
    variant?.packaging === "Glass Jar" &&
    variant.unit.toLowerCase() === "g" &&
    (variant.quantity === 350 || variant.quantity === 500);

  const variantGlassJarImage = isValidGlassJarVariant
    ? glassJarImageMap?.[
        variant!.quantity as 350 | 500
      ] ?? null
    : null;

  const image =
    variantGlassJarImage ??
    (packaging === "Glass Jar"
      ? product.glassJarImage
      : packaging === "Cardboard Box"
        ? product.cardboardBoxImage
        : product.image);

  useEffect(() => {
    setIsLoaded(false);
  }, [image]);

  if (!image) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-[#F9F5F0] ${
          compact
            ? "h-full w-full rounded-lg p-2"
            : "h-[140px] w-full rounded-xl p-3 sm:h-[220px] sm:p-5 md:h-[260px] md:p-6"
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
                compact ? "h-4 w-4" : "h-4 w-4 sm:h-5 sm:w-5"
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

  return (
    <div
      className={`group/image relative flex items-center justify-center overflow-hidden bg-white ${
        compact
          ? "h-full w-full rounded-xl p-1.5"
          : "h-[140px] w-full rounded-xl p-3 sm:h-[220px] sm:p-5 md:h-[200px] md:p-6"
      }`}
    >
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] bg-gradient-to-br from-[#FBF6EE] via-[#F9F2E8] to-[#FBF6EE]"
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
      )}

      <img
        key={image}
        src={image}
        alt={`${product.name} ${packaging}${
          variant ? ` ${variant.quantity}${variant.unit}` : ""
        }`}
        loading={compact ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        className={`relative z-[2] h-full w-full object-contain object-center transition-all duration-700 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {!compact && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-1/3 bg-gradient-to-t from-[#B5697A]/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
    </div>
  );
}

export default ProductCardImage;
