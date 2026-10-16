
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Product } from "../../api/productApi";

type PackagingOption =
  | "Plastic Box"
  | "Cardboard Box"
  | "Glass Jar";

interface ProductDetailsImageProps {
  product: Product;
  packaging: string;
}

function ProductDetailsImage({
  product,
  packaging,
}: ProductDetailsImageProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  /* =========================================================
     SELECT PACKAGING
  ========================================================= */

  const selectedPackaging: PackagingOption =
    packaging === "Glass Jar"
      ? "Glass Jar"
      : packaging === "Cardboard Box"
        ? "Cardboard Box"
        : "Plastic Box";

  /* =========================================================
     PACKAGING-SPECIFIC IMAGES
  ========================================================= */

  const packagingImages =
    selectedPackaging === "Glass Jar"
      ? product.glassJarImages
      : selectedPackaging === "Cardboard Box"
        ? product.cardboardBoxImages
        : product.regularImages;

  /* =========================================================
     LEGACY IMAGE FALLBACK
  ========================================================= */

  const legacyImage =
    selectedPackaging === "Glass Jar"
      ? product.glassJarImage
      : selectedPackaging === "Cardboard Box"
        ? product.cardboardBoxImage
        : product.image;

  /* =========================================================
     BUILD IMAGE GALLERY
  ========================================================= */

  const images = Array.from(
    new Set(
      [
        ...(Array.isArray(packagingImages)
          ? packagingImages
          : []),
        legacyImage,
      ].filter(
        (image): image is string =>
          typeof image === "string" &&
          image.trim().length > 0
      )
    )
  );

  /* =========================================================
     RESET GALLERY ON PRODUCT OR PACKAGING CHANGE
  ========================================================= */

  useEffect(() => {
    setActiveIndex(0);
  }, [product.id, selectedPackaging]);

  /* =========================================================
     KEEP ACTIVE INDEX VALID
  ========================================================= */

  useEffect(() => {
    setActiveIndex((current) => {
      if (images.length === 0) {
        return 0;
      }

      return Math.min(current, images.length - 1);
    });
  }, [images.length, product.id, selectedPackaging]);

  /* =========================================================
     GALLERY NAVIGATION
  ========================================================= */

  const goToPrevious = () => {
    if (images.length <= 1) {
      return;
    }

    setActiveIndex((current) =>
      current <= 0 ? images.length - 1 : current - 1
    );
  };

  const goToNext = () => {
    if (images.length <= 1) {
      return;
    }

    setActiveIndex((current) =>
      current >= images.length - 1 ? 0 : current + 1
    );
  };

  const hasMultipleImages = images.length > 1;
  const currentImage = images[activeIndex];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        relative flex min-h-[300px]
        flex-col items-center
        overflow-hidden
        rounded-xl
        bg-white
        p-6
        sm:min-h-[400px]
        sm:p-12
        lg:sticky
        lg:top-[80px]
        lg:min-h-[600px]
        lg:self-start
        lg:p-12
      "
    >
      {/* PRODUCT IMAGE */}
      {currentImage ? (
        <img
          key={currentImage}
          src={currentImage}
          alt={`${product.name} - ${selectedPackaging} - Image ${
            activeIndex + 1
          }`}
          className="
            relative z-[1]
            block
            max-h-[330px]
            w-full
            object-contain
            drop-shadow-[0_20px_25px_rgba(80,50,30,0.08)]
            sm:max-h-[430px]
            lg:max-h-[500px]
          "
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-[#8B7A6C]">
          Image unavailable for {selectedPackaging}
        </div>
      )}

      {/* IMAGE NAVIGATION BELOW IMAGE */}
      {hasMultipleImages && (
        <div
          className="
            relative z-[2]
            mt-4
            flex w-full
            shrink-0
            items-center
            justify-center
            gap-4
          "
        >
          {/* PREVIOUS IMAGE */}
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="View previous product image"
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-full
              border border-[#EFE3D2]
              bg-white
              text-[#B5697A]
              shadow-sm
              transition-colors
              hover:bg-[#B5697A]
              hover:text-white
              focus:outline-none
            "
          >
            <ChevronLeft size={18} />
          </button>

          {/* IMAGE COUNTER */}
          <span
            className="
              min-w-[64px]
              rounded-full
              border border-[#EFE3D2]
              bg-white
              px-3 py-2
              text-center
              text-xs
              text-[#8B7A6C]
              shadow-sm
            "
            aria-live="polite"
            aria-atomic="true"
          >
            {activeIndex + 1} / {images.length}
          </span>

          {/* NEXT IMAGE */}
          <button
            type="button"
            onClick={goToNext}
            aria-label="View next product image"
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-full
              border border-[#EFE3D2]
              bg-white
              text-[#B5697A]
              shadow-sm
              transition-colors
              hover:bg-[#B5697A]
              hover:text-white
              focus:outline-none
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
