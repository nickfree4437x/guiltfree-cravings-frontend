import { useCallback, useEffect, useState } from "react";

import {
  getAdminProducts,
  deleteAdminProduct,
  updateAdminProductStatus,
} from "../../../api/adminProductsApi";

import ProductsEmptyState from "../../../components/admin/products/ProductsEmptyState";
import ProductsPageError from "../../../components/admin/products/ProductsPageError";
import ProductsPageHeader from "../../../components/admin/products/ProductsPageHeader";
import ProductList from "../../../components/admin/products/ProductList";
import ProductFormModal from "../../../components/admin/products/ProductFormModal";
import ConfirmActionModal from "../../../components/admin/products/ConfirmActionModal"; // ✅ Import

import type { AdminProduct } from "../../../components/admin/products/types";

function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyProductId, setBusyProductId] = useState<number | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<AdminProduct | null>(null);

  // ✅ State for Confirmation Modal
  const [confirmAction, setConfirmAction] = useState<{
    product: AdminProduct;
    action: "delete" | "toggle";
    nextStatus?: boolean;
  } | null>(null);

  // ─── Load Products ──────────────────────────────────────
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setPageError("");

    try {
      const result = await getAdminProducts();

      let productList: AdminProduct[] = [];

      if (Array.isArray(result)) {
        productList = result;
      } else if (
        result &&
        typeof result === "object" &&
        Array.isArray((result as { products?: AdminProduct[] }).products)
      ) {
        productList = (result as { products: AdminProduct[] }).products;
      }

      setProducts(productList);
    } catch (error: unknown) {
      console.error("Failed to load admin products:", error);

      setProducts([]);

      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to load products right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  // ─── Open Add Product Modal ─────────────────────────────
  const handleAddProduct = () => {
    setActionError("");
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // ─── Open Edit Product Modal ────────────────────────────
  const handleEditProduct = (product: AdminProduct) => {
    setActionError("");
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  // ─── Close Modal ────────────────────────────────────────
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  // ─── Product Saved ──────────────────────────────────────
  const handleProductSaved = (savedProduct: AdminProduct) => {
    setProducts((current) => {
      const safeCurrent = Array.isArray(current) ? current : [];

      const exists = safeCurrent.some(
        (item) => item.id === savedProduct.id
      );

      if (exists) {
        return safeCurrent.map((item) =>
          item.id === savedProduct.id ? savedProduct : item
        );
      }

      return [savedProduct, ...safeCurrent];
    });

    handleCloseForm();
    setActionError("");
  };

  // ─── Initiate Delete ────────────────────────────────────
  const initiateDelete = (product: AdminProduct) => {
    setConfirmAction({ product, action: "delete" });
  };

  // ─── Initiate Toggle Status ─────────────────────────────
  const initiateToggle = (product: AdminProduct) => {
    setConfirmAction({
      product,
      action: "toggle",
      nextStatus: !product.isActive,
    });
  };

  // ─── Execute Confirmed Action ───────────────────────────
  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    const { product, action, nextStatus } = confirmAction;

    setActionError("");
    setBusyProductId(product.id);

    try {
      if (action === "delete") {
        await deleteAdminProduct(product.id);
        setProducts((current) =>
          current.filter((item) => item.id !== product.id)
        );
      } else if (action === "toggle") {
        const updatedProduct = await updateAdminProductStatus(
          product.id,
          nextStatus as boolean
        );
        setProducts((current) =>
          current.map((item) =>
            item.id === product.id
              ? { ...item, ...updatedProduct, isActive: nextStatus as boolean }
              : item
          )
        );
      }

      setConfirmAction(null); // Close modal on success
    } catch (error: unknown) {
      console.error(`Failed to ${action} product:`, error);

      setActionError(
        error instanceof Error
          ? error.message
          : `Unable to ${action} this product. Please try again.`
      );
      setConfirmAction(null); // Close modal on error too (or keep it open based on preference)
    } finally {
      setBusyProductId(null);
    }
  };

  // ─── Loading State ──────────────────────────────────────
  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-white px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-[18px] font-bold tracking-tight text-slate-700 md:text-[22px]">
            Products
          </h1>

          <p className="mt-1 text-[12px] font-[350] leading-relaxed text-slate-500">
            Manage your products and their basic information.
          </p>

          <div className="mt-8 rounded-2xl border border-[#eadfd3] bg-white p-12 text-center shadow-sm">
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#eadfd3] border-t-[#8b542f]"
              aria-hidden="true"
            />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading products...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ─── Main Render ────────────────────────────────────────
  return (
    <main className="min-h-[calc(100vh-80px)] bg-white px-5 py-2 sm:px-8 lg:px-10 lg:py-4">
      <div className="mx-auto max-w-7xl">
        <ProductsPageHeader onAddProduct={handleAddProduct} />

        {/* Page Error */}
        {pageError && (
          <div className="mt-4">
            <ProductsPageError message={pageError} />

            <button
              type="button"
              onClick={() => void loadProducts()}
              className="mt-3 rounded-lg bg-[#A85F70] px-4 py-2 text-sm font-semibold text-white hover:bg-[#8F4E60]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Action Error */}
        {actionError && (
          <div
            role="alert"
            className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p>{actionError}</p>

            <button
              type="button"
              onClick={() => setActionError("")}
              className="shrink-0 font-medium hover:text-red-900"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Busy State */}
        {busyProductId !== null && (
          <p className="mt-3 text-xs text-slate-500" role="status">
            Updating product...
          </p>
        )}

        {/* Empty State */}
        {!pageError && products.length === 0 && (
          <ProductsEmptyState onAddProduct={handleAddProduct} />
        )}

        {/* Product List */}
        {!pageError && products.length > 0 && (
          <ProductList
            products={products}
            onEditProduct={handleEditProduct}
            onDeleteProduct={initiateDelete} // ✅ Updated
            onToggleStatus={initiateToggle}  // ✅ Updated
          />
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        product={editingProduct}
        onClose={handleCloseForm}
        onSaved={handleProductSaved}
      />

      {/* ✅ Custom Confirmation Modal */}
      <ConfirmActionModal
        isOpen={!!confirmAction}
        action={confirmAction?.action || "delete"}
        productName={confirmAction?.product.name || ""}
        nextStatus={confirmAction?.nextStatus}
        isProcessing={busyProductId === confirmAction?.product.id}
        onConfirm={handleConfirmAction}
        onClose={() => !busyProductId && setConfirmAction(null)}
      />
    </main>
  );
}

export default AdminProductsPage;