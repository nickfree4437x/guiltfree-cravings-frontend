// src/components/admin/products/ProductsEmptyState.tsx

interface ProductsEmptyStateProps {
  onAddProduct: () => void;
}

function ProductsEmptyState({
  onAddProduct,
}: ProductsEmptyStateProps) {
  return (
    <section className="mt-5 rounded-3xl border border-[#eadfd3] bg-white p-10 text-center shadow-sm sm:p-14">

      <h2 className="mt-5 text-lg font-bold text-slate-900">
        No products yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Products added to your catalogue will
        appear here.
      </p>

      <button
        type="button"
        onClick={onAddProduct}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#8b542f] px-5 py-2.5 text-sm  text-white transition hover:bg-[#744324] focus:outline-none"
      >
        Add Product
      </button>
    </section>
  );
}

export default ProductsEmptyState;