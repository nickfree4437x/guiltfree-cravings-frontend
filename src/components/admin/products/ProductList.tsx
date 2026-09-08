// src/components/admin/products/ProductList.tsx

import type { AdminProduct } from "./types";
import ProductMobileList from "./ProductMobileList";
import ProductTable from "./ProductTable";

interface ProductListProps {
  products: AdminProduct[];
}

function ProductList({
  products,
}: ProductListProps) {
  return (
    <section className="mt-5 overflow-hidden rounded-3xl border border-[#eadfd3] bg-white shadow-sm">
      <ProductTable
        products={products}
      />

      <ProductMobileList
        products={products}
      />
    </section>
  );
}

export default ProductList;