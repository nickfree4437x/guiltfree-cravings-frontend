// src/components/admin/products/ProductsPageHeader.tsx
interface ProductsPageHeaderProps {
  onAddProduct: () => void;
}

function ProductsPageHeader({
}: ProductsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="mt-1 text-[18px] font-semibold tracking-tight text-slate-700 md:text-[22px]">
          Products
        </h1>

        <p className="mt-0 max-w-xl text-[11px] md:text-[12px] font-[350] leading-relaxed text-slate-500">
          Manage your products and their basic
          information.
        </p>
      </div>
    </div>
  );
}

export default ProductsPageHeader;