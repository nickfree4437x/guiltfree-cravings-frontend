// src/components/admin/products/ProductList.tsx

import type { AdminProduct } from "./types";
import ProductMobileList from "./ProductMobileList";
import ProductTable from "./ProductTable";

// ─── Types ────────────────────────────────────────────────
interface ProductListProps {
  products: AdminProduct[];
  onEditProduct: (product: AdminProduct) => void;
  onDeleteProduct: (product: AdminProduct) => void;
  onToggleStatus: (product: AdminProduct) => void;
}

// ─── Component ────────────────────────────────────────────
function ProductList({
  products,
  onEditProduct,
  onDeleteProduct,
  onToggleStatus,
}: ProductListProps) {
  return (
    <section className="mt-2 overflow-hidden rounded-lg border border-[#eadfd3] bg-white shadow-sm">
      {/* Desktop Table */}
      <ProductTable
        products={products}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
        onToggleStatus={onToggleStatus}
      />

      {/* Mobile List */}
      <ProductMobileList
        products={products}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
        onToggleStatus={onToggleStatus}
      />
    </section>
  );
}

export default ProductList;