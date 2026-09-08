// src/components/admin/products/ProductsPageError.tsx

interface ProductsPageErrorProps {
  message: string;
}

function ProductsPageError({
  message,
}: ProductsPageErrorProps) {
  return (
    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
          !
        </div>

        <div>
          <p className="text-sm font-semibold text-red-800">
            Unable to load products
          </p>

          <p className="mt-1 text-xs leading-5 text-red-700">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductsPageError;