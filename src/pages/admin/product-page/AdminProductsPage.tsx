// src/pages/admin/products/AdminProductsPage.tsx

import {
  useEffect,
  useState,
} from "react";

import {
  getAdminProducts,
} from "../../../api/adminProductsApi";

import ProductsEmptyState from "../../../components/admin/products/ProductsEmptyState";
import ProductsPageError from "../../../components/admin/products/ProductsPageError";
import ProductsPageHeader from "../../../components/admin/products/ProductsPageHeader";
import ProductList from "../../../components/admin/products/ProductList";

import type {
  AdminProduct,
} from "../../../components/admin/products/types";

/*
 * =========================================================
 * ADMIN PRODUCTS PAGE
 * =========================================================
 */

function AdminProductsPage() {
  const [products, setProducts] =
    useState<AdminProduct[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  /*
   * =======================================================
   * LOAD PRODUCTS
   * =======================================================
   */

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setPageError("");

        const result =
          await getAdminProducts();

        if (mounted) {
          setProducts(result);
        }
      } catch (error: any) {
        console.error(
          "Failed to load admin products:",
          error
        );

        if (mounted) {
          setPageError(
            error?.response?.data?.message ||
              error?.message ||
              "Unable to load products right now. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * =======================================================
   * ADD PRODUCT
   * =======================================================
   */

  const handleAddProduct = () => {
    // Add Product flow will be connected here.
  };

  /*
   * =======================================================
   * LOADING STATE
   * =======================================================
   */

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#fffaf5] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b542f]">
              Catalogue
            </span>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Products
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your products and their basic
              information.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-[#eadfd3] bg-white p-12 text-center shadow-sm">
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

  /*
   * =======================================================
   * PAGE
   * =======================================================
   */

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#fffaf5] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <ProductsPageHeader
          onAddProduct={
            handleAddProduct
          }
        />

        {/* =================================================
            PAGE ERROR
        ================================================= */}

        {pageError && (
          <ProductsPageError
            message={pageError}
          />
        )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!pageError &&
          products.length === 0 && (
            <ProductsEmptyState
              onAddProduct={
                handleAddProduct
              }
            />
          )}

        {/* =================================================
            PRODUCT LIST
        ================================================= */}

        {products.length > 0 && (
          <ProductList
            products={products}
          />
        )}

      </div>
    </main>
  );
}

export default AdminProductsPage;