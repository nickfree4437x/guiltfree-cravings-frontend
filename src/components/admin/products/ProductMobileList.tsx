import type { AdminProduct } from "./types";
import { formatPrice, getStartingPrice } from "./productUtils";
import { useNavigate } from "react-router-dom";

interface ProductMobileListProps {
  products: AdminProduct[];
}

function ProductMobileList({ products }: ProductMobileListProps) {
  const navigate = useNavigate();

  return (
    <div className="divide-y divide-[#EFE3D2] md:hidden">
      {products.map((product) => {
        const startingPrice = getStartingPrice(product.variants);

        return (
          <article
            key={product.id}
            onClick={() => navigate(`/admin/products/${product.id}`)}
            className="
              cursor-pointer
              bg-white
              p-5
              transition-colors
              hover:bg-[#fffbfc]
              sm:p-6
            "
          >
            <div className="flex gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#FBECEF] text-[#B5697A]">
                    <span className="text-lg font-medium">—</span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-[14px] font-semibold tracking-[-0.01em] text-[#3D3834]">
                      {product.name}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-slate-500">
                      {product.description}
                    </p>
                  </div>

                  <span
                    className={[
                      "shrink-0 rounded-full border px-2.5 py-1 text-[10px]",
                      product.isActive
                        ? "border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]"
                        : "border-[#E8E1D9] bg-[#F7F4F1] text-[#7B6D63]",
                    ].join(" ")}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#EFE3D2] bg-[#fffbfc] p-3.5">
                <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">Variants</p>
                <p className="mt-1 text-[14px] text-gray-700">{product.variants.length}</p>
              </div>

              <div className="rounded-lg border border-[#EFE3D2] bg-[#fffbfc] p-3.5">
                <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">Starting Price</p>
                <p className="mt-1 text-[14px] text-gray-700">
                  {startingPrice !== null ? formatPrice(startingPrice) : "—"}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProductMobileList;