import { Link } from "react-router-dom";
import type { Product } from "../../api/productApi";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const regularVariants = product.variants.filter(
    (variant) => variant.packaging === "Regular"
  );

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#eadfd3] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-[#f5eadf] sm:h-[300px]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Product Content */}
      <div className="p-6 sm:p-7">

        {/* Product Name */}
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
          {product.description}
        </p>

        {/* Pricing + CTA */}
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-[#eee4dc] pt-5">

          {/* Pricing */}
          <div className="flex items-center gap-4">

            {regularVariants.map((variant, index) => (
              <div
                key={variant.id}
                className="flex items-center gap-4"
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {variant.quantity}
                    {variant.unit}
                  </p>

                  <p className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
                    ₹{variant.price}
                  </p>
                </div>

                {index < regularVariants.length - 1 && (
                  <div className="h-7 w-px bg-[#e3d7cd]" />
                )}
              </div>
            ))}

          </div>

          {/* View Product */}
          <Link
            to={`/products/${product.id}`}
            aria-label={`View ${product.name}`}
            className="shrink-0 rounded-full bg-[#8b542f] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 sm:px-5 sm:text-sm"
          >
            View Product
          </Link>

        </div>

      </div>
    </article>
  );
}

export default ProductCard;