import { PackageX } from "lucide-react";
import { useState } from "react";

import type { Product } from "../../../api/productApi";

interface ProductCardImageProps {
  product: Product;
  packaging?: "Plastic Box" | "Glass Jar" | "Cardboard Box";
  compact?: boolean;
}

function ProductCardImage({
  product,
  packaging = "Plastic Box",
  compact = false,
}: ProductCardImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  /*
   * =========================================================
   * IMAGE SELECTION
   * =========================================================
   */

  const image =
    packaging === "Glass Jar"
      ? product.glassJarImage
      : packaging === "Cardboard Box"
        ? product.cardboardBoxImage
        : product.image;

  /*
   * =========================================================
   * EMPTY STATE
   * =========================================================
   */

  if (!image) {
    return (
      <div
        className={`
          relative
          flex
          items-center
          justify-center
          overflow-hidden
          bg-[#F9F5F0]
          ${
            compact
              ? "h-full w-full rounded-lg p-2"
              : `
                h-[140px]
                w-full
                rounded-xl
                p-3
                sm:h-[220px]
                sm:p-5
                md:h-[260px]
                md:p-6
              `
          }
        `}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            className={`
              flex
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-sm
              ${
                compact
                  ? "h-8 w-8"
                  : "h-10 w-10 sm:h-12 sm:w-12"
              }
            `}
          >
            <PackageX
              className={`
                text-[#B5697A]/60
                ${
                  compact
                    ? "h-4 w-4"
                    : "h-4 w-4 sm:h-5 sm:w-5"
                }
              `}
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

  /*
   * =========================================================
   * MAIN IMAGE
   * =========================================================
   */

  return (
    <div
      className={`
        group/image
        relative
        flex
        items-center
        justify-center
        overflow-hidden
        bg-white
        ${
          compact
            ? "h-full w-full rounded-lg p-1.5"
            : `
              h-[140px]
              w-full
              rounded-md
              p-3
              sm:h-[220px]
              sm:p-5
              md:h-[200px]
              md:p-6
            `
        }
      `}
    >
      {/* =====================================================
          SKELETON
      ===================================================== */}

      {!isLoaded && (
        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            z-[1]
            bg-gradient-to-br
            from-[#FBF6EE]
            via-[#F9F2E8]
            to-[#FBF6EE]
          "
        >
          <div
            className="
              absolute
              inset-0
              -translate-x-full
              bg-gradient-to-r
              from-transparent
              via-white/60
              to-transparent
              animate-[shimmer_1.6s_ease-in-out_infinite]
            "
          />
        </div>
      )}

      {/* =====================================================
          IMAGE
      ===================================================== */}

      <img
        src={image}
        alt={`${product.name} ${packaging}`}
        loading={compact ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        className={`
          relative
          z-[2]
          h-full
          w-full
          object-contain
          object-center
          transition-all
          duration-700
          ease-out
          ${
            isLoaded
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      />

      {/* =====================================================
          SUBTLE HOVER GRADIENT
      ===================================================== */}

      {!compact && (
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-[3]
            h-1/3
            bg-gradient-to-t
            from-[#B5697A]/[0.05]
            to-transparent
            opacity-0
            transition-opacity
            duration-500
            group-hover:opacity-100
          "
        />
      )}
    </div>
  );
}

export default ProductCardImage;