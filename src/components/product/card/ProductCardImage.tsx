import { PackageX } from "lucide-react";
import { useState } from "react";

import type { Product } from "../../../api/productApi";
// import { useWishlistStore } from "../../../store/wishlistStore";

interface ProductCardImageProps {
  product: Product;
  packaging?: "Plastic Box" | "Glass Jar" | "Cardboard Box";
}

function ProductCardImage({
  product,
  packaging = "Plastic Box",
}: ProductCardImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  // const [isToggling, setIsToggling] = useState(false);

  // const toggleWishlist = useWishlistStore(
  //   (state) => state.toggleWishlist
  // );

  // const isInWishlist = useWishlistStore((state) =>
  //   state.items.some((item) => item.id === product.id)
  // );

  // const handleWishlistToggle = () => {
  //   setIsToggling(true);
  //   toggleWishlist(product);
  //   window.setTimeout(() => setIsToggling(false), 400);
  // };

  const image =
    packaging === "Glass Jar"
      ? product.glassJarImage
      : packaging === "Cardboard Box"
        ? product.cardboardBoxImage
        : product.image;

  /*
   * =========================================================
   * WISHLIST BUTTON — COMMENTED OUT
   * =========================================================
   */
  // const WishlistButton = (
  //   <button
  //     type="button"
  //     onClick={(event) => {
  //       event.stopPropagation();
  //       handleWishlistToggle();
  //     }}
  //     aria-label={
  //       isInWishlist
  //         ? `Remove ${product.name} from wishlist`
  //         : `Add ${product.name} to wishlist`
  //     }
  //     aria-pressed={isInWishlist}
  //     title={
  //       isInWishlist
  //         ? "Remove from wishlist"
  //         : "Add to wishlist"
  //     }
  //     className={`
  //       absolute right-3.5 top-3.5 z-10
  //       flex h-9 w-9 items-center justify-center
  //       rounded-full border bg-white/95 backdrop-blur-sm
  //       transition-all duration-300
  //       focus:outline-none focus-visible:ring-2
  //       focus-visible:ring-[#B5697A] focus-visible:ring-offset-2
  //       active:scale-90
  //       ${
  //         isInWishlist
  //           ? "border-[#B5697A]/40 bg-[#B5697A]/10 text-[#B5697A] shadow-[0_4px_12px_-4px_rgba(181,105,122,0.35)]"
  //           : "border-[#EFE3D2] text-[#8B7A6C] hover:-translate-y-0.5 hover:border-[#B5697A]/50 hover:bg-[#B5697A]/5 hover:text-[#B5697A]"
  //       }
  //     `}
  //   >
  //     <Heart
  //       className={`
  //         h-4 w-4 transition-transform duration-300
  //         ${isToggling ? "scale-125" : "scale-100"}
  //       `}
  //       fill={isInWishlist ? "currentColor" : "none"}
  //       strokeWidth={2}
  //       aria-hidden="true"
  //     />
  //   </button>
  // );

  /*
   * =========================================================
   * EMPTY STATE (no image)
   * =========================================================
   */
  if (!image) {
    return (
      <div
        className="
          relative flex h-[140px] items-center justify-center
          overflow-hidden rounded-t-xl bg-[#F9F5F0] p-3
          sm:h-[220px] sm:p-5
          md:h-[260px] md:p-6
        "
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm sm:h-12 sm:w-12">
            <PackageX
              className="h-4 w-4 text-[#B5697A]/60 sm:h-5 sm:w-5"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </span>

          <span className="text-[10px] font-medium text-[#8B7A6C] sm:text-[11px]">
            Image coming soon
          </span>
        </div>

        {/* {WishlistButton} */}
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
      className="
        group/image relative flex h-[140px]
        items-center justify-center
        overflow-hidden rounded-t-xl
        bg-white p-3
        sm:h-[220px] sm:p-5
        md:h-[260px] md:p-6
      "
    >
      {/* ===== Skeleton shimmer (before load) ===== */}
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="
            absolute inset-0 z-[1]
            bg-gradient-to-br from-[#FBF6EE] via-[#F9F2E8] to-[#FBF6EE]
          "
        >
          <div
            className="
              absolute inset-0 -translate-x-full
              bg-gradient-to-r from-transparent via-white/60 to-transparent
              animate-[shimmer_1.6s_ease-in-out_infinite]
            "
          />
        </div>
      )}

      {/* ===== Image ===== */}
      <img
        src={image}
        alt={`${product.name} ${packaging}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`
          relative z-[2]
          h-full w-full object-contain object-center
          transition-all duration-700 ease-out
          ${isLoaded ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* ===== Hover gradient (subtle) ===== */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-1/3
          bg-gradient-to-t from-[#B5697A]/[0.05] to-transparent
          opacity-0 transition-opacity duration-500
          group-hover:opacity-100
        "
      />

      {/* ===== Wishlist Button ===== */}
      {/* {WishlistButton} */}
    </div>
  );
}

export default ProductCardImage;