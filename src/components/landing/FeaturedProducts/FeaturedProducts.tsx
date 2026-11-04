
import { useEffect, useMemo, useState } from "react";
import { Search, ShieldCheck, Heart, Droplets } from "lucide-react";

import { getProducts, type Product } from "../../../api/productApi";
import { getPublicOffers, type Offer } from "../../../api/offerApi";

import FeaturedProductsHeader from "./sections/FeaturedProductsHeader";
import ProductGrid from "./sections/ProductGrid";
import ProductSkeletonGrid from "./sections/ProductSkeletonGrid";
import ProductErrorState from "./sections/ProductErrorState";
import ProductEmptyState from "./sections/ProductEmptyState";

// ─── Types ────────────────────────────────────────────────

type PackagingType = "Plastic Box" | "Cardboard Box" | "Glass Jar";

// ─── Static Data ──────────────────────────────────────────

const TABS: { label: string; value: PackagingType }[] = [
  { label: "Regular", value: "Plastic Box" },
  { label: "Cardboard Boxes", value: "Cardboard Box" },
  { label: "Glass Jars", value: "Glass Jar" },
];

const TRUST_BADGES = [
  { icon: Heart, label: "Made with Love" },
  { icon: ShieldCheck, label: "No Preservatives" },
  { icon: Droplets, label: "No Palm Oil" },
  { icon: ShieldCheck, label: "No Refined Sugar" },
];

// ─── Helpers ──────────────────────────────────────────────

function hasPackagingImage(
  product: Product,
  packaging: PackagingType
): boolean {
  if (packaging === "Plastic Box") {
    return Boolean(
      product.image ||
        product.regularImages?.some(Boolean) ||
        product.images?.some(Boolean)
    );
  }

  if (packaging === "Glass Jar") {
    return Boolean(
      product.glassJarImage ||
        product.glassJarImages?.some(Boolean)
    );
  }

  return Boolean(
    product.cardboardBoxImage ||
      product.cardboardBoxImages?.some(Boolean)
  );
}

function hasPackagingVariant(
  product: Product,
  packaging: PackagingType
): boolean {
  return (
    Array.isArray(product.variants) &&
    product.variants.some(
      (variant) => variant.packaging === packaging
    )
  );
}

// ─── Component ────────────────────────────────────────────

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [activePackaging, setActivePackaging] =
    useState<PackagingType>("Plastic Box");

  // ─── Public Offer State ─────────────────────────────────

  const [discountedVariantIds, setDiscountedVariantIds] =
    useState<number[]>([]);

  const [discountPercentage, setDiscountPercentage] =
    useState(0);

  // ─── Fetch Active Products ─────────────────────────────

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);

        if (isMounted) {
          setError(
            "Unable to load products right now. Please try again later."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── Fetch Public Offers ────────────────────────────────

  useEffect(() => {
    let isMounted = true;

    const fetchPublicOffers = async () => {
      try {
        const offers: Offer[] = await getPublicOffers();

        if (!isMounted) return;

        // Only percentage offers can currently be displayed
        // by the ProductGrid/ProductCardPricing props.
        const percentageOffers = offers.filter(
          (offer) =>
            offer.audience === "PUBLIC" &&
            offer.isActive &&
            offer.discountType === "PERCENTAGE" &&
            offer.discountValue > 0 &&
            offer.discountValue <= 100
        );

        // API returns offers ordered by newest first.
        // Use the first eligible percentage offer for now.
        const selectedOffer = percentageOffers[0];

        if (!selectedOffer) {
          setDiscountedVariantIds([]);
          setDiscountPercentage(0);
          return;
        }

        setDiscountedVariantIds(
          Array.isArray(selectedOffer.variantIds)
            ? selectedOffer.variantIds
            : []
        );

        setDiscountPercentage(selectedOffer.discountValue);
      } catch (err) {
        console.error("Failed to fetch public offers:", err);

        if (isMounted) {
          // Product browsing should continue even if offers fail.
          setDiscountedVariantIds([]);
          setDiscountPercentage(0);
        }
      }
    };

    void fetchPublicOffers();

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── Filter by Packaging + Search Query ─────────────────

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      // Do not display inactive products.
      if (product.isActive === false) {
        return false;
      }

      // Require a matching variant and an available packaging image.
      const matchesPackaging =
        hasPackagingVariant(product, activePackaging) &&
        hasPackagingImage(product, activePackaging);

      if (!matchesPackaging) {
        return false;
      }

      if (!query) {
        return true;
      }

      // Search by name, description, flavour, category and variants.
      const searchableText = [
        product.name,
        product.description,
        (product as Product & { flavour?: string }).flavour ?? "",
        (product as Product & { category?: string }).category ?? "",
        ...(product.variants ?? []).map(
          (variant) =>
            (variant as typeof variant & { flavour?: string }).flavour ?? ""
        ),
      ]
        .filter(
          (value): value is string => typeof value === "string"
        )
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [products, activePackaging, searchQuery]);

  // ─── Render ─────────────────────────────────────────────

  return (
    <section
      id="products"
      className="scroll-mt-12 overflow-hidden bg-white px-4 py-10 sm:px-8 sm:py-12 lg:px-12"
    >
      <div className="mx-auto w-full max-w-6xl">
        <FeaturedProductsHeader />

        {/* Search + Packaging Tabs */}
        {!loading && !error && products.length > 0 && (
          <div className="mx-auto mt-5 w-full sm:mt-7 lg:mt-8">
            {/* Packaging Tabs */}
            <div className="flex w-full justify-center">
              <div className="scrollbar-hide inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-[#EADBD0] bg-white p-1 shadow-sm">
                {TABS.map((tab) => {
                  const isActive = activePackaging === tab.value;

                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setActivePackaging(tab.value)}
                      aria-pressed={isActive}
                      className={`shrink-0 rounded-lg px-3 py-2 text-[11px] tracking-wide transition-all duration-300 sm:px-5 sm:text-[13px] ${
                        isActive
                          ? "bg-[#B5697A] text-white shadow-sm"
                          : "text-gray-600 hover:bg-[#F8E8EC] hover:text-[#B5697A]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mx-auto mt-4 w-full max-w-md sm:mt-5">
              <div className="group flex h-9 w-full items-center gap-2.5 rounded-xl border border-[#EADBD0] bg-white px-3.5 shadow-sm transition-all duration-200 focus-within:border-[#B5697A] sm:h-10 sm:px-4">
                <Search
                  size={17}
                  strokeWidth={1.8}
                  className="shrink-0 text-[#9A887B] transition-colors group-focus-within:text-[#B5697A]"
                  aria-hidden="true"
                />

                <input
                  id="featured-product-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search by name or flavour..."
                  autoComplete="off"
                  className="h-full min-w-0 flex-1 border-0 bg-transparent text-[12px] text-gray-600 outline-none placeholder:font-[400] placeholder:text-gray-500 focus:outline-none sm:text-[13px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && <ProductSkeletonGrid />}

        {/* Error */}
        {!loading && error && (
          <ProductErrorState message={error} />
        )}

        {/* Filtered Products */}
        {!loading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length > 0 && (
            <ProductGrid
              products={filteredProducts}
              packaging={activePackaging}
              discountedVariantIds={discountedVariantIds}
              discountPercentage={discountPercentage}
            />
          )}

        {/* No Matches */}
        {!loading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <div className="mx-auto max-w-md py-12 text-center sm:py-16">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FBEEF1] text-[#B5697A]">
                <Search size={21} strokeWidth={1.8} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-[#1F4A2E]">
                {searchQuery.trim()
                  ? "No products found"
                  : "No products available"}
              </h3>

              <p className="mt-2 text-[12px] leading-relaxed text-slate-500 md:text-[13px]">
                {searchQuery.trim()
                  ? `We couldn't find any products matching "${searchQuery.trim()}" in this packaging. Try another search or clear your search.`
                  : `No products are currently available in ${activePackaging}. Please check another packaging option.`}
              </p>

              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#B5697A]/30 px-5 py-2 text-[12px] text-[#B5697A] transition-colors hover:bg-[#FBEEF1] md:text-[13px]"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

        {/* No Products */}
        {!loading && !error && products.length === 0 && (
          <ProductEmptyState />
        )}

        {/* Bottom Trust Bar */}
        <div className="relative mt-6 overflow-hidden rounded-lg border border-[#C9788B]/20 bg-white px-3 py-4 sm:mt-10 sm:px-6 sm:py-6 md:px-8">
          <div className="relative grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-6 md:grid-cols-4 md:gap-5">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon;

              return (
                <div
                  key={badge.label}
                  className="flex min-w-0 items-center justify-start gap-2 sm:justify-center sm:gap-3 md:gap-2.5 lg:gap-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FBEEF1] transition-colors duration-300 sm:h-8 sm:w-8">
                    <Icon
                      className="h-3 w-3 text-[#C9788B] sm:h-[16px] sm:w-[16px]"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="min-w-0 [overflow-wrap:anywhere] text-left text-[11px] font-normal leading-snug text-gray-600 sm:text-[12.5px] md:text-center lg:text-left">
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
