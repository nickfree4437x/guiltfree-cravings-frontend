import {
  X,
  Leaf,
  ShieldCheck,
  Droplet,
  Award,
  Truck,
} from "lucide-react";

import type { Product } from "../../api/productApi";

interface ProductQuickViewModalProps {
  product: Product;
  packaging?: "Regular" | "Glass Jar";
  onClose: () => void;
}

function ProductQuickViewModal({
  product,
  packaging = "Regular",
  onClose,
}: ProductQuickViewModalProps) {
  const image =
    packaging === "Glass Jar"
      ? product.glassJarImage
      : product.image;

  const variants = product.variants.filter(
    (variant) => variant.packaging === packaging
  );

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  /*
   * =========================================================
   * TRUST FEATURES — displayed at bottom
   * =========================================================
   */
  const trustFeatures = [
    { icon: Leaf, label: "No Refined Sugar" },
    { icon: ShieldCheck, label: "No Preservatives" },
    { icon: Droplet, label: "No Plam Oil" },
  ];

  return (
    <>
      {/* ================= STYLES ================= */}
      <style>
        {`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.96) translateY(8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes backdropFadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          .modal-fade { animation: modalFadeIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .backdrop-fade { animation: backdropFadeIn 0.2s ease-out both; }

          @media (prefers-reduced-motion: reduce) {
            .modal-fade, .backdrop-fade { animation: none !important; }
          }
        `}
      </style>

      {/* ================= BACKDROP ================= */}
      <div
        className="
          backdrop-fade fixed inset-0 z-[100]
          flex items-center justify-center
          bg-black/50 px-4 py-6
          backdrop-blur-md
          sm:px-6 sm:py-8
        "
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} product details`}
        onMouseDown={handleBackdropClick}
      >
        {/* ================= MODAL ================= */}
        <div
          className="
            modal-fade relative
            max-h-[92vh] w-full max-w-5xl
            overflow-hidden
            rounded-2xl sm:rounded-2xl
            bg-white
            shadow-[0_25px_80px_rgba(0,0,0,0.28)]
          "
        >

          {/* =====================================================
              CLOSE BUTTON
          ====================================================== */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="
              absolute right-3 top-3 z-30
              flex h-9 w-9 items-center justify-center
              rounded-full
              border border-[#EFE3D2]
              bg-white/95
              text-[#8B7A6C]
              shadow-sm
              backdrop-blur-md
              transition-all duration-200
              hover:bg-[#B5697A]/5
              hover:text-[#B5697A]
              focus-visible:ring-[#B5697A] focus-visible:ring-offset-2
              sm:right-4 sm:top-4 sm:h-10 sm:w-10
            "
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
          </button>

          {/* =====================================================
              SCROLLABLE CONTENT
          ====================================================== */}
          <div className="max-h-[92vh] overflow-y-auto">
            <div className="grid lg:grid-cols-[1fr_1.15fr]">

              {/* =================================================
                  LEFT — IMAGE
              ================================================== */}
              <div
                className="
                  relative flex items-center justify-center
                  bg-gradient-to-br from-[#FBF6EE] via-[#F9F2E8] to-[#FBF6EE]
                  p-6
                  min-h-[240px]
                  sm:min-h-[320px] sm:p-10
                  lg:min-h-[560px] lg:p-12
                "
              >
                {/* Decorative blob */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute -left-20 -top-20 h-56 w-56
                    rounded-full bg-[#FBEEF1]/50 blur-[80px]
                  "
                />

                {/* Packaging badge (image pe) */}
                <div
                  className="
                    absolute left-4 top-4 z-10
                    inline-flex items-center gap-1.5
                    rounded-full border border-[#EFE3D2]
                    bg-white/90 px-3 py-1
                    backdrop-blur-sm
                    sm:left-6 sm:top-6
                  "
                >
                  
                  <span
                    className="
                      text-[10px] uppercase tracking-[0.14em]
                      text-[#8B6F5C]
                    "
                  >
                    {packaging}
                  </span>
                </div>

                {/* Image */}
                {image ? (
                  <img
                    src={image}
                    alt={
                      packaging === "Glass Jar"
                        ? `${product.name} Traditional Glass Jar`
                        : product.name
                    }
                    className="
                      relative z-[2]
                      max-h-[280px] w-full object-contain
                      sm:max-h-[380px]
                      lg:max-h-[460px]
                    "
                  />
                ) : (
                  <span className="text-sm text-[#8B7A6C]">
                    Image unavailable
                  </span>
                )}
              </div>

              {/* =================================================
                  RIGHT — DETAILS
              ================================================== */}
              <div className="flex flex-col p-6 sm:p-8 lg:p-10">

                {/* Product Name */}
                <h2
                  className="
                    text-[18px] font-semibold leading-[1.15]
                    tracking-[-0.01em]
                    text-[#1F4A2E]
                    sm:text-[20px]
                    lg:text-[24px]
                  "
                >
                  {product.name}
                </h2>

                {/* Small meta row */}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span
                    className="
                      flex items-center gap-1
                      text-[11px] text-[#B5697A]
                    "
                  >
                    <Award className="h-3.5 w-3.5" strokeWidth={2} />
                    Handcrafted
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#EFE3D2]" />
                  <span
                    className="
                      flex items-center gap-1
                      text-[11px] text-[#B5697A]
                    "
                  >
                    <Truck className="h-3.5 w-3.5" strokeWidth={2} />
                    Fresh Batch
                  </span>
                </div>

                {/* Divider */}
                <div className="mt-5 h-px w-full bg-[#EFE3D2]" />

                {/* Description */}
                <div className="mt-5">
                  <h3
                    className="
                      text-[10px] uppercase tracking-[0.18em]
                      text-[#8B7A6C]
                    "
                  >
                    About This Laddoo
                  </h3>

                  <p
                    className="
                      mt-2.5
                      text-[13px] leading-[1.75]
                      text-[#2c2c2c]
                      sm:text-[14px] sm:leading-[1.6]
                    "
                  >
                    {product.description}
                  </p>
                </div>

                {/* Trust chips */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {trustFeatures.map((f) => {
                    const Icon = f.icon;
                    return (
                      <span
                        key={f.label}
                        className="
                          inline-flex items-center gap-1.5
                          rounded-full border border-[#EFE3D2] bg-[#FBF6EE]
                          px-2.5 py-1.5
                          text-[10px] tracking-wide
                          text-[#2c2c2c]
                        "
                      >
                        <Icon
                          className="h-3 w-3 text-[#B5697A]"
                          strokeWidth={2}
                        />
                        {f.label}
                      </span>
                    );
                  })}
                </div>

                {/* Available Sizes */}
                {variants.length > 0 && (
                  <div className="mt-6">
                    <h3
                      className="
                        text-[10px] uppercase tracking-[0.18em]
                        text-[#8B7A6C]
                      "
                    >
                      Available Sizes
                    </h3>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="
                            group/variant flex items-center justify-between
                            gap-3
                            rounded-xl border border-[#EFE3D2] bg-white
                            px-4 py-3
                          "
                        >
                          {/* Size chip */}
                          <span
                            className="
                              flex h-8 min-w-[60px] items-center justify-center
                              rounded-lg bg-[#FBEEF1] px-2
                              text-[11px] font-semibold uppercase tracking-wider
                              text-[#B5697A]
                            "
                          >
                            {variant.quantity}
                            {variant.unit}
                          </span>

                          {/* Price */}
                          <span
                            className="
                              text-[15px] font-semibold leading-none
                              text-[#1F4A2E]
                            "
                          >
                            ₹{variant.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom trust line */}
                <div
                  className="
                    mt-auto pt-6
                    border-t border-[#EFE3D2]
                    flex items-center gap-2
                    text-[10.5px] leading-[1.6] text-[#8B7A6C]
                  "
                >
                  <ShieldCheck
                    className="h-3.5 w-3.5 shrink-0 text-[#B5697A]"
                    strokeWidth={2}
                  />
                  <span>
                    Crafted with care using thoughtfully selected ingredients.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductQuickViewModal;