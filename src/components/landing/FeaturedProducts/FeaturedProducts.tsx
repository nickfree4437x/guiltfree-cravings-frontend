
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import {
  getProducts,
  type Product,
} from "../../../api/productApi";

import FeaturedProductsHeader from "./sections/FeaturedProductsHeader";
import ProductGrid from "./sections/ProductGrid";
import ProductSkeletonGrid from "./sections/ProductSkeletonGrid";
import ProductErrorState from "./sections/ProductErrorState";
import ProductEmptyState from "./sections/ProductEmptyState";

type PackagingType =
  | "Plastic Box"
  | "Cardboard Box"
  | "Glass Jar";

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [activePackaging, setActivePackaging] =
    useState<PackagingType>("Plastic Box");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);

        setError(
          "Unable to load products right now. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  const tabs: {
    label: string;
    value: PackagingType;
  }[] = [
    { label: "Regular", value: "Plastic Box" },
    { label: "Cardboard Boxes", value: "Cardboard Box" },
    { label: "Glass Jars", value: "Glass Jar" },
  ];

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesPackaging =
        product.variants.some(
          (variant) => variant.packaging === activePackaging
        ) &&
        (activePackaging === "Plastic Box"
          ? true
          : activePackaging === "Glass Jar"
            ? Boolean(product.glassJarImage)
            : Boolean(product.cardboardBoxImage));

      if (!matchesPackaging) return false;
      if (!query) return true;

      const searchableText = [
        product.name,
        "description" in product ? product.description : "",
        "category" in product ? product.category : "",
      ]
        .filter(
          (value): value is string =>
            typeof value === "string"
        )
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [products, activePackaging, searchQuery]);

  return (
    <section
      id="products"
      className="
        scroll-mt-12 overflow-hidden
        bg-[#FFF9F5]
        px-4 py-6
        sm:px-8 sm:py-8
        lg:px-12
      "
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* SECTION HEADER */}
        <FeaturedProductsHeader />

        {/* SEARCH BAR + PACKAGING TABS */}
        {!loading && !error && products.length > 0 && (
          <div className="relative mx-auto mt-5 w-full sm:mt-7 lg:mt-8">
            {/* SEARCH BAR
                Mobile: Full width, above tabs
                Desktop: Compact, right side
            */}
            <div
              className="
                relative mx-auto mb-4 w-64
                sm:mb-5 sm:max-w-md
                lg:absolute lg:right-0 lg:top-1/2
                lg:mb-0 lg:mx-0 lg:w-64
                lg:-translate-y-1/2
                xl:w-72
              "
            >

              <div
                className="
                  group flex h-[36px] w-full items-center gap-2.5
                  rounded-xl border border-[#EADBD0]
                  bg-white px-3.5
                  shadow-sm
                  transition-all duration-200
                  focus-within:border-[#B5697A]
                  sm:h-10 sm:px-4
                  lg:h-11 lg:rounded-xl lg:px-3
                "
              >
                <Search
                  size={17}
                  strokeWidth={1.8}
                  className="
                    shrink-0 text-[#9A887B]
                    transition-colors
                    group-focus-within:text-[#B5697A]
                  "
                  aria-hidden="true"
                />

                <input
                  id="featured-product-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search laddoos and products..."
                  autoComplete="off"
                  className="
                    h-full min-w-0 flex-1
                    border-0 bg-transparent
                    text-[12px] text-[#2C2C2C]
                    outline-none
                    placeholder:text-[#B6A99D]
                    placeholder:font-[350]
                    focus:outline-none
                    sm:text-[13px]
                  "
                />

              </div>
            </div>

            {/* PACKAGING TABS — ALWAYS CENTERED */}
            <div className="flex w-full justify-center">
              <div
                className="
                  inline-flex max-w-full items-center gap-1
                  overflow-x-auto rounded-xl
                  border border-[#EADBD0]
                  bg-white p-1 shadow-sm
                  scrollbar-hide
                "
              >
                {tabs.map((tab) => {
                  const isActive =
                    activePackaging === tab.value;

                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() =>
                        setActivePackaging(tab.value)
                      }
                      aria-pressed={isActive}
                      className={`
                        shrink-0 rounded-lg
                        px-3 py-2
                        text-[11px] tracking-wide
                        transition-all duration-300
                        sm:px-5 sm:text-[13px]
                        ${
                          isActive
                            ? "bg-[#B5697A] text-white shadow-sm"
                            : "text-[#6F6259] hover:bg-[#F8E8EC] hover:text-[#B5697A]"
                        }
                      `}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && <ProductSkeletonGrid />}

        {/* ERROR */}
        {!loading && error && (
          <ProductErrorState message={error} />
        )}

        {/* FILTERED PRODUCTS */}
        {!loading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length > 0 && (
            <ProductGrid
              products={filteredProducts}
              packaging={activePackaging}
            />
          )}

        {/* NO MATCHES */}
        {!loading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length === 0 &&
          searchQuery.trim() && (
            <div className="mx-auto max-w-md py-12 text-center sm:py-16">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FBEEF1] text-[#B5697A]">
                <Search size={21} strokeWidth={1.8} />
              </div>

              <h3 className="mt-4text-lg font-semibold text-[#1F4A2E]">
                No products found
              </h3>

              <p className="mt-2 text-[12px] md:text-[13px] leading-relaxed text-slate-500">
                We couldn&apos;t find any products matching
                &quot;{searchQuery.trim()}&quot; in this packaging.
                Try another search or clear your search.
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="
                  mt-5 inline-flex items-center gap-2
                  rounded-full border border-[#B5697A]/30
                  px-5 py-2 text-[12px] md:text-[13px]
                  text-[#B5697A] transition-colors
                  hover:bg-[#FBEEF1]
                "
              >
                Clear search
              </button>
            </div>
          )}

        {/* NO PRODUCTS AT ALL */}
        {!loading &&
          !error &&
          products.length === 0 && <ProductEmptyState />}
      </div>
    </section>
  );
}

export default FeaturedProducts;
