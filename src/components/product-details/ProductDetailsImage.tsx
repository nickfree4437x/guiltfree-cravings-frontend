
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type {
  Product,
  ProductVariant,
} from "../../api/productApi";

type PackagingOption =
  | "Plastic Box"
  | "Cardboard Box"
  | "Glass Jar";

interface ProductDetailsImageProps {
  product: Product;
  packaging: string;
  variant?: ProductVariant | null;
}

const GLASS_JAR_IMAGES: Record<
  string,
  { 350: string; 500: string }
> = {
  "Dry Fruit Sattu Laddoo": {
    350: "https://res.cloudinary.com/zhwlhmt4/image/upload/v1792518318/WhatsApp_Image_2026-10-19_at_11.25.07_PM.jpg",
    500: "https://res.cloudinary.com/zhwlhmt4/image/upload/v1792518221/WhatsApp_Image_2026-10-19_at_11.25.03_PM.jpg",
  },
  "Sattu Dry Fruit Laddoo": {
    350: "https://res.cloudinary.com/zhwlhmt4/image/upload/v1792518318/WhatsApp_Image_2026-10-19_at_11.25.07_PM.jpg",
    500: "https://res.cloudinary.com/zhwlhmt4/image/upload/v1792518221/WhatsApp_Image_2026-10-19_at_11.25.03_PM.jpg",
  },
  "Dates Delight Laddoo": {
    350: "https://res.cloudinary.com/zhwlhmt4/image/upload/v1792518272/WhatsApp_Image_2026-10-19_at_11.25.06_PM.jpg",
    500: "https://res.cloudinary.com/zhwlhmt4/image/upload/v1792518159/WhatsApp_Image_2026-10-19_at_11.25.02_PM.jpg",
  },
};

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

  const isGlassJarVariant =
    selectedPackaging === "Glass Jar" &&
    variant?.unit === "g" &&
    (variant.quantity === 350 || variant.quantity === 500);

  const glassJarImageMap = GLASS_JAR_IMAGES[product.name];

  const selectedGlassJarImage =
    isGlassJarVariant && glassJarImageMap
      ? glassJarImageMap[
          variant.quantity as 350 | 500
        ]
      : null;

  const images = useMemo(() => {
    const packagingImages =
      selectedPackaging === "Glass Jar"
        ? product.glassJarImages
        : selectedPackaging === "Cardboard Box"
          ? product.cardboardBoxImages
          : product.regularImages;

    const legacyImage =
      selectedPackaging === "Glass Jar"
        ? product.glassJarImage
        : selectedPackaging === "Cardboard Box"
          ? product.cardboardBoxImage
          : product.image;

    const gallery = [
      ...(selectedGlassJarImage ? [selectedGlassJarImage] : []),
      ...(Array.isArray(packagingImages) ? packagingImages : []),
      legacyImage,
    ].filter(
      (image): image is string =>
        typeof image === "string" && image.trim().length > 0
    );

    return Array.from(new Set(gallery));
  }, [
    product.image,
    product.glassJarImage,
    product.cardboardBoxImage,
    product.regularImages,
    product.glassJarImages,
    product.cardboardBoxImages,
    selectedPackaging,
    selectedGlassJarImage,
  ]);

  useEffect(() => {
    setActiveIndex(0);
  }, [
    product.id,
    selectedPackaging,
    variant?.id,
    variant?.quantity,
    variant?.unit,
  ]);

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

  return (
    <div
      className="
        relative flex min-h-[300px]
        flex-col items-center
        overflow-hidden rounded-xl
        bg-white p-6
        sm:min-h-[400px] sm:p-12
        lg:sticky lg:top-[80px]
        lg:min-h-[600px] lg:self-start lg:p-12
      "
    >
      {currentImage ? (
        <img
          key={`${currentImage}-${selectedPackaging}-${variant?.id ?? "default"}`}
          src={currentImage}
          alt={`${product.name} - ${selectedPackaging}${
            variantLabel ? ` - ${variantLabel}` : ""
          } - Image ${activeIndex + 1}`}
          className="
            relative z-[1] block
            max-h-[330px] w-full
            object-contain
            sm:max-h-[430px]
            lg:max-h-[500px]
          "
          loading="eager"
          decoding="async"
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-center text-sm text-[#8B7A6C]">
          Image unavailable for {selectedPackaging}
        </div>
      )}

      {hasMultipleImages && (
        <div
          className="
            relative z-[2] mt-4
            flex w-full shrink-0
            items-center justify-center gap-4
          "
        >
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="View previous product image"
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-full border border-[#EFE3D2]
              bg-white text-[#B5697A] shadow-sm
              transition-colors
              hover:bg-[#B5697A] hover:text-white
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#B5697A]
            "
          >
            <ChevronLeft size={18} />
          </button>

          <span
            className="
              min-w-[64px] rounded-full
              border border-[#EFE3D2]
              bg-white px-3 py-2
              text-center text-xs
              text-[#8B7A6C] shadow-sm
            "
            aria-live="polite"
            aria-atomic="true"
          >
            {activeIndex + 1} / {images.length}
          </span>

          <button
            type="button"
            onClick={goToNext}
            aria-label="View next product image"
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-full border border-[#EFE3D2]
              bg-white text-[#B5697A] shadow-sm
              transition-colors
              hover:bg-[#B5697A] hover:text-white
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#B5697A]
            "
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductDetailsImage;
