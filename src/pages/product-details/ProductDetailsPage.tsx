import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, ShieldCheck, Clock } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  getProductById,
  type Product,
  type ProductVariant,
} from "../../api/productApi";

import { useCartStore } from "../../store/cartStore";

import OtpAuthModal from "../../components/auth/OtpAuthModal";
import ProductDetailsImage from "../../components/product-details/ProductDetailsImage";
import ProductDetailsInfo from "../../components/product-details/ProductDetailsInfo";
import ProductPickerGuide from "../../components/product-details/ProductPickerGuide";
import CustomerReviews from "../../components/product-details/reviews/ProductReviews";
import RecommendedProducts from "../../components/product-details/RecommendedProducts";

// ─── Types ────────────────────────────────────────────────

type PackagingOption = "Plastic Box" | "Cardboard Box" | "Glass Jar";

interface ProductDetailsData {
  ingredients?: string | null;
  allergenInfo?: string | null;
  medicalDisclaimer?: string | null;
  benefits?: string | null;
  usageSuggestions?: string | null;
  storageInstructions?: string | null;
  shelfLife?: string | null;
}

type DetailedProduct = Product & ProductDetailsData;

interface ProductNavigationState {
  packaging?: unknown;
  selectedVariantId?: unknown;
  selectedVariantQuantity?: unknown;
}

// ─── Config ───────────────────────────────────────────────

const PACKAGING_ORDER: PackagingOption[] = [
  "Plastic Box",
  "Cardboard Box",
  "Glass Jar",
];

const ALLOWED_WEIGHTS: Record<PackagingOption, number[]> = {
  "Plastic Box": [250],
  "Cardboard Box": [500],
  "Glass Jar": [350, 500],
};

// ─── Helpers ──────────────────────────────────────────────

function isPackagingOption(p: unknown): p is PackagingOption {
  return (
    p === "Plastic Box" ||
    p === "Cardboard Box" ||
    p === "Glass Jar"
  );
}

function isAllowedVariant(v: ProductVariant): boolean {
  if (!isPackagingOption(v.packaging)) return false;

  return (
    v.unit === "g" &&
    ALLOWED_WEIGHTS[v.packaging].includes(v.quantity)
  );
}

function sortVariants(variants: ProductVariant[]): ProductVariant[] {
  return [...variants].sort((a, b) =>
    a.quantity !== b.quantity
      ? a.quantity - b.quantity
      : a.id - b.id
  );
}

function getAllowedVariants(product: Product): ProductVariant[] {
  return sortVariants(product.variants.filter(isAllowedVariant));
}

// ─── Initial Variant Selection ────────────────────────────

function pickInitialVariant(
  variants: ProductVariant[],
  requestedPackaging: PackagingOption | null,
  requestedVariantId: number | null,
  requestedVariantQuantity: number | null
): ProductVariant {
  // 1. Exact variant ID, with packaging validation.
  if (requestedVariantId !== null) {
    const match = variants.find(
      (v) =>
        v.id === requestedVariantId &&
        (!requestedPackaging || v.packaging === requestedPackaging)
    );

    if (match) return match;
  }

  // 2. Packaging and weight match.
  if (
    requestedPackaging &&
    requestedVariantQuantity !== null
  ) {
    const match = variants.find(
      (v) =>
        v.packaging === requestedPackaging &&
        v.quantity === requestedVariantQuantity
    );

    if (match) return match;
  }

  // 3. Packaging-only match.
  if (requestedPackaging) {
    const match = variants.find(
      (v) => v.packaging === requestedPackaging
    );

    if (match) return match;
  }

  // 4. Default priority: Plastic → Cardboard → Glass.
  for (const packaging of PACKAGING_ORDER) {
    const match = variants.find(
      (v) => v.packaging === packaging
    );

    if (match) return match;
  }

  return variants[0];
}

// ─── Product Detail Section ───────────────────────────────

const ICON_MAP = {
  book: BookOpen,
  shield: ShieldCheck,
  clock: Clock,
};

function ProductDetailSection({
  title,
  content,
  icon,
}: {
  title: string;
  content?: string | null;
  icon: "book" | "shield" | "clock";
}) {
  if (!content?.trim()) return null;

  const Icon = ICON_MAP[icon];

  return (
    <section className="rounded-xl border border-[#EFE3D2] bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBEEF1] text-[#B5697A]">
          <Icon size={16} strokeWidth={1.8} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-[12px] font-semibold text-gray-600 sm:text-[15px]">
            {title}
          </h3>

          <p className="mt-1 text-[11px] font-light leading-relaxed tracking-wide text-gray-600 sm:text-[12.5px] md:text-[13px]">
            {content}
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Back Button ──────────────────────────────────────────

function BackToHomeButton({
  onClick,
  size = 18,
  large = false,
}: {
  onClick: () => void;
  size?: number;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back to Home"
      className={
        large
          ? "group mb-6 inline-flex min-h-10 items-center gap-2 rounded-lg pr-3 text-sm font-medium text-[#28583B] transition-colors hover:text-[#B5697A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B5697A]/40 focus-visible:ring-offset-2"
          : "group inline-flex min-h-10 items-center gap-1 rounded-lg pr-3 text-[11px] text-[#B5697A] transition-colors duration-200 hover:underline focus:outline-none md:text-[12px]"
      }
    >
      <ArrowLeft
        size={size}
        strokeWidth={1.8}
        className="transition-transform duration-200 group-hover:-translate-x-1"
      />

      <span>Back to Home</span>
    </button>
  );
}

// ─── Product Details Page ──────────────────────────────────

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const navState = location.state as ProductNavigationState | null;

  // Parse navigation state.
  const requestedPackaging = isPackagingOption(navState?.packaging)
    ? navState.packaging
    : null;

  const requestedVariantId =
    typeof navState?.selectedVariantId === "number" &&
    Number.isInteger(navState.selectedVariantId)
      ? navState.selectedVariantId
      : null;

  const requestedVariantQuantity =
    typeof navState?.selectedVariantQuantity === "number" &&
    Number.isFinite(navState.selectedVariantQuantity)
      ? navState.selectedVariantQuantity
      : null;

  // ─── Local State ─────────────────────────────────────────

  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPackaging, setSelectedPackaging] =
    useState<PackagingOption>("Plastic Box");

  const [selectedVariantId, setSelectedVariantId] =
    useState<number | null>(null);

  const [quantity, setQuantity] = useState(1);

  // Authentication modal is only used when a review action requires login.
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // ─── Cart Store ──────────────────────────────────────────

  const addToCart = useCartStore((s) => s.addToCart);
  const openCartDrawer = useCartStore((s) => s.openCartDrawer);

  // ─── Fetch Product ───────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const productId = Number(id);

        if (!Number.isInteger(productId) || productId <= 0) {
          throw new Error("Invalid product ID.");
        }

        const data = await getProductById(productId);

        if (cancelled) return;

        const allowed = getAllowedVariants(data);

        if (allowed.length === 0) {
          setProduct(data as DetailedProduct);
          setSelectedPackaging("Plastic Box");
          setSelectedVariantId(null);
          setQuantity(1);
          return;
        }

        const initial = pickInitialVariant(
          allowed,
          requestedPackaging,
          requestedVariantId,
          requestedVariantQuantity
        );

        setProduct(data as DetailedProduct);
        setSelectedPackaging(initial.packaging as PackagingOption);
        setSelectedVariantId(initial.id);
        setQuantity(1);
      } catch (fetchError) {
        if (cancelled) return;

        console.error("Failed to fetch product:", fetchError);

        setProduct(null);
        setError("Unable to load this product right now.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [
    id,
    requestedPackaging,
    requestedVariantId,
    requestedVariantQuantity,
  ]);

  // ─── Allowed Variants ────────────────────────────────────

  const allowedVariants = useMemo(
    () => (product ? getAllowedVariants(product) : []),
    [product]
  );

  const availablePackagings = useMemo<PackagingOption[]>(
    () =>
      PACKAGING_ORDER.filter((packaging) =>
        allowedVariants.some(
          (variant) => variant.packaging === packaging
        )
      ),
    [allowedVariants]
  );

  // ─── Selected Packaging Variants ─────────────────────────

  const packagingVariants = useMemo(
    () =>
      allowedVariants.filter(
        (variant) => variant.packaging === selectedPackaging
      ),
    [allowedVariants, selectedPackaging]
  );

  const selectedVariant =
    packagingVariants.find(
      (variant) => variant.id === selectedVariantId
    ) ??
    packagingVariants[0] ??
    null;

  // Keep the selected variant valid when packaging changes.
  useEffect(() => {
    const exists = packagingVariants.some(
      (variant) => variant.id === selectedVariantId
    );

    if (!exists) {
      setSelectedVariantId(packagingVariants[0]?.id ?? null);
      setQuantity(1);
    }
  }, [packagingVariants, selectedVariantId]);

  // ─── Handlers ────────────────────────────────────────────

  const handlePackagingChange = (packaging: string) => {
    if (!isPackagingOption(packaging)) return;

    const matchingVariants = allowedVariants.filter(
      (variant) => variant.packaging === packaging
    );

    if (matchingVariants.length === 0) return;

    setSelectedPackaging(packaging);
    setSelectedVariantId(matchingVariants[0].id);
    setQuantity(1);
  };

  const handleVariantChange = (variant: ProductVariant) => {
    if (
      variant.packaging !== selectedPackaging ||
      !isAllowedVariant(variant) ||
      !packagingVariants.some((item) => item.id === variant.id)
    ) {
      return;
    }

    setSelectedVariantId(variant.id);
    setQuantity(1);
  };

  const handleQuantityChange = (nextQuantity: number) => {
    if (!Number.isFinite(nextQuantity)) return;

    setQuantity(Math.max(1, Math.floor(nextQuantity)));
  };

  // ─── Guest-Friendly Add to Cart ──────────────────────────

  const handleAddToCart = () => {
    if (!product || !selectedVariant || quantity <= 0) return;

    // Validate selected variant before adding it.
    if (
      selectedVariant.packaging !== selectedPackaging ||
      !isAllowedVariant(selectedVariant) ||
      !packagingVariants.some(
        (variant) => variant.id === selectedVariant.id
      )
    ) {
      return;
    }

    // Guests and authenticated customers can both add products.
    // No OTP modal should open from the Add to Cart action.
    addToCart(product, selectedVariant, quantity);

    // Open the cart drawer so the customer can review their items.
    openCartDrawer();
  };

  // Reviews may still request authentication independently.
  const handleReviewLoginRequired = () => {
    setIsAuthModalOpen(true);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // ─── Loading State ───────────────────────────────────────

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#FFFCF7] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <BackToHomeButton onClick={handleBackToHome} large />

          <div className="grid animate-pulse gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="min-h-[420px] rounded-2xl bg-[#F5EFE6]" />

            <div className="space-y-5 py-4">
              <div className="h-8 w-3/4 rounded bg-[#F5EFE6]" />
              <div className="h-5 w-full rounded bg-[#F5EFE6]" />
              <div className="h-5 w-5/6 rounded bg-[#F5EFE6]" />
              <div className="h-12 w-full rounded bg-[#F5EFE6]" />
              <div className="h-12 w-full rounded bg-[#F5EFE6]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Error State ─────────────────────────────────────────

  if (error || !product) {
    return (
      <main className="min-h-[70vh] bg-[#FFFCF7] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <BackToHomeButton onClick={handleBackToHome} large />

          <div className="mx-auto mt-10 flex max-w-xl flex-col items-center text-center">
            <h1 className="text-2xl font-semibold text-[#1F4A2E]">
              Product Not Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#8B7A6C]">
              {error ||
                "The product you are looking for is no longer available."}
            </p>

            <button
              type="button"
              onClick={handleBackToHome}
              className="mt-7 rounded-xl bg-[#B5697A] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#A55F70] focus:outline-none focus:ring-2 focus:ring-[#B5697A]/30 focus:ring-offset-2"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── Product Details Data ────────────────────────────────

  const details = product as DetailedProduct;

  const hasProductDetails = Boolean(
    details.ingredients ||
      details.allergenInfo ||
      details.medicalDisclaimer ||
      details.benefits ||
      details.usageSuggestions ||
      details.storageInstructions ||
      details.shelfLife
  );

  // ─── Page ─────────────────────────────────────────────────

  return (
    <>
      <main className="bg-white px-5 pb-10 pt-[85px] sm:px-8 sm:pb-12 sm:pt-24 lg:px-12 lg:pb-14 lg:pt-28">
        <div className="mx-auto w-full max-w-6xl">
          {/* Back to Home */}
          <div className="mb-2 sm:mb-4">
            <BackToHomeButton
              onClick={handleBackToHome}
              size={16}
            />
          </div>

          {/* Main Product Section */}
          <div className="overflow-hidden rounded-2xl border border-[#EFE3D2] bg-white shadow-sm">
            <div className="grid lg:grid-cols-[1fr_1fr]">
              <ProductDetailsImage
                product={product}
                packaging={selectedPackaging}
                variant={selectedVariant}
              />

              <ProductDetailsInfo
                product={product}
                availablePackagings={availablePackagings}
                selectedPackaging={selectedPackaging}
                variants={packagingVariants}
                selectedVariant={selectedVariant}
                quantity={quantity}
                onPackagingChange={handlePackagingChange}
                onVariantChange={handleVariantChange}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
                onViewCart={openCartDrawer}
              />
            </div>
          </div>

          {/* Product Information */}
          {hasProductDetails && (
            <section
              className="mt-8 sm:mt-10"
              aria-labelledby="product-details-heading"
            >
              <div className="mb-3 sm:mb-4">
                <h2
                  id="product-details-heading"
                  className="mt-2 text-[20px] font-semibold tracking-tight text-gray-700 sm:text-[26px]"
                >
                  Product Details
                </h2>

                <p className="mt-0 max-w-2xl text-[11px] leading-relaxed text-gray-500 md:text-[13px]">
                  Ingredients, allergen information, serving ideas and
                  storage guidance for {product.name}.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <ProductDetailSection
                  title="Ingredients"
                  content={details.ingredients}
                  icon="book"
                />

                <ProductDetailSection
                  title="Allergen Information"
                  content={details.allergenInfo}
                  icon="shield"
                />

                <ProductDetailSection
                  title="Benefits"
                  content={details.benefits}
                  icon="book"
                />

                <ProductDetailSection
                  title="Usage Suggestions"
                  content={details.usageSuggestions}
                  icon="book"
                />

                <ProductDetailSection
                  title="Storage Instructions"
                  content={details.storageInstructions}
                  icon="clock"
                />

                <ProductDetailSection
                  title="Shelf Life"
                  content={details.shelfLife}
                  icon="clock"
                />
              </div>

              {details.medicalDisclaimer && (
                <div className="mt-4 rounded-xl border border-[#E8D6B9] bg-[#FFFCF7] p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-600">
                    Medical Disclaimer
                  </h3>

                  <p className="text-justify text-[11.5px] font-light leading-relaxed tracking-wide text-gray-500 sm:text-[13.5px] md:text-[13px]">
                    {details.medicalDisclaimer}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Product Picker Guide */}
          <div className="px-0 py-6 sm:px-8 sm:py-7 lg:px-12 lg:py-8">
            <div className="mx-auto w-full max-w-2xl">
              <ProductPickerGuide />
            </div>
          </div>

          {/* Recommended Products */}
          <div className="pb-10 sm:pb-12 lg:pb-14">
            <div className="mx-auto w-full max-w-6xl">
              <RecommendedProducts currentProductId={product.id} />
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="pb-10 sm:pb-12 lg:pb-14">
            <div className="mx-auto w-full max-w-6xl">
              <CustomerReviews
                productId={product.id}
                productName={product.name}
                onLoginRequired={handleReviewLoginRequired}
              />
            </div>
          </div>
        </div>
      </main>

      {/* OTP Modal: Only for actions that explicitly require authentication,
          such as writing a customer review. It is not used for Add to Cart. */}
      {isAuthModalOpen && (
        <OtpAuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}

export default ProductDetailsPage;