import type { Product } from "../../../../api/productApi";
import ProductGrid from "./ProductGrid";

// ─── Types ────────────────────────────────────────────────
interface GlassJarCollectionProps {
  products: Product[];
}

// ─── Component ────────────────────────────────────────────
function GlassJarCollection({ products }: GlassJarCollectionProps) {
  return (
    <section className="mt-12 border-t border-[#E8E1D8] pt-8 sm:mt-14 sm:pt-16">
      {/* Section intro */}
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-2 text-[20px] font-semibold leading-snug tracking-wide text-[#C9788B] sm:text-[24px] md:whitespace-nowrap md:text-[28px]">
          Traditional Glass Jars
        </h2>
        <p className="mx-auto max-w-[580px] text-[12.5px] leading-relaxed tracking-wide text-[#2c2c2c] sm:text-[13.5px] md:text-[14px]">
          Beautifully packed in reusable glass jars, keeping the same honest goodness inside.
        </p>
      </div>

      {/* Products */}
      <ProductGrid products={products} packaging="Glass Jar" />
    </section>
  );
}

export default GlassJarCollection;