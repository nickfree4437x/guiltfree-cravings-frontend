import type { Product } from "../../../../api/productApi";

import ProductGrid from "./ProductGrid";

interface GlassJarCollectionProps {
  products: Product[];
}

function GlassJarCollection({
  products,
}: GlassJarCollectionProps) {
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
            text-[20px] sm:text-[24px] md:text-[28px] font-semibold tracking-wide text-[#C9788B] mb-2 leading-snug md:whitespace-nowrap
          "
        >
          Traditional Glass Jars
        </h2>

        <p
          className="
            text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-relaxed text-[#2c2c2c] tracking-wide max-w-[580px] mx-auto
          "
        >
          Beautifully packed in
          reusable glass jars,
          keeping the same honest
          goodness inside.
        </p>
      </div>

      {/* GLASS JAR PRODUCTS */}

      <ProductGrid
        products={products}
        packaging="Glass Jar"
      />
    </section>
  );
}

export default GlassJarCollection;