import type { Product } from "../../../../api/productApi";

import ProductGrid from "./ProductGrid";

interface CardboardBoxCollectionProps {
  products: Product[];
}

function CardboardBoxCollection({
  products,
}: CardboardBoxCollectionProps) {
  return (
    <section
      className="
        mt-12
        border-t border-[#E8E1D8]
        pt-8
        sm:mt-14
        sm:pt-16
      "
    >
      {/* SECTION INTRO */}
      <div
        className="
          mx-auto max-w-3xl
          text-center
        "
      >
        <h2
          className="
            mb-2
            text-[20px]
            font-semibold
            leading-snug
            tracking-wide
            text-[#C9788B]
            sm:text-[24px]
            md:whitespace-nowrap
            md:text-[28px]
          "
        >
          Classic Cardboard Boxes
        </h2>

        <p
          className="
            mx-auto
            max-w-[580px]
            text-[12.5px]
            leading-relaxed
            tracking-wide
            text-[#2c2c2c]
            sm:text-[13.5px]
            md:text-[14px]
          "
        >
          Thoughtfully packed in sturdy cardboard
          boxes, made for everyday goodness.
        </p>
      </div>

      {/* CARDBOARD BOX PRODUCTS */}
      <ProductGrid
        products={products}
        packaging="Cardboard Box"
      />
    </section>
  );
}

export default CardboardBoxCollection;