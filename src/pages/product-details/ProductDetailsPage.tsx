
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getProductById,
  type Product,
  type ProductVariant,
} from "../../api/productApi";

import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

import OtpAuthModal from "../../components/auth/OtpAuthModal";

import ProductDetailsImage from "../../components/product-details/ProductDetailsImage";
import ProductDetailsInfo from "../../components/product-details/ProductDetailsInfo";
import ProductPickerGuide from "../../components/product-details/ProductPickerGuide";
import CustomerStories from "../../components/product-details/CustomerStories";
import CustomerReviews from "../../components/product-details/reviews/ProductReviews";
import RecommendedProducts from "../../components/product-details/RecommendedProducts";

type PackagingOption =
  | "Plastic Box"
  | "Cardboard Box"
  | "Glass Jar";

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Packaging passed from the product listing card.
   * Invalid or missing navigation state is ignored.
   */
  const packagingFromNavigation: unknown = (
    location.state as { packaging?: unknown } | null
  )?.packaging;

  const requestedPackaging: PackagingOption | null =
    packagingFromNavigation === "Plastic Box" ||
    packagingFromNavigation === "Cardboard Box" ||
    packagingFromNavigation === "Glass Jar"
      ? packagingFromNavigation
      : null;

  /* =========================================================
     PRODUCT STATE
  ========================================================= */

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     PRODUCT SELECTION STATE
  ========================================================= */

  const [selectedPackaging, setSelectedPackaging] =
    useState<PackagingOption>("Plastic Box");

  const [selectedVariantId, setSelectedVariantId] =
    useState<number | null>(null);

  const [quantity, setQuantity] = useState(1);

  /* =========================================================
     AUTH STATE
  ========================================================= */

  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  /* =========================================================
     CART STORE
  ========================================================= */

  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  const setPendingCartItem = useCartStore(
    (state) => state.setPendingCartItem
  );

  const addPendingCartItem = useCartStore(
    (state) => state.addPendingCartItem
  );

  /*
   * Existing right-side cart drawer.
   * The /cart page remains available separately.
   */
  const openCartDrawer = useCartStore(
    (state) => state.openCartDrawer
  );

  /* =========================================================
     FETCH PRODUCT
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const productId = Number(id);

        if (
          !Number.isInteger(productId) ||
          productId <= 0
        ) {
          throw new Error("Invalid product ID.");
        }

        const data = await getProductById(productId);

        if (cancelled) {
          return;
        }

        setProduct(data);

        /*
         * INITIAL VARIANT SELECTION
         *
         * Priority:
         * 1. Packaging requested from the product card,
         *    if a matching variant exists.
         * 2. Plastic Box
         * 3. Cardboard Box
         * 4. Glass Jar
         *
         * Within each packaging type, the smallest
         * quantity is selected first.
         */

        const sortedVariants = [...data.variants].sort(
          (a, b) => {
            if (a.quantity !== b.quantity) {
              return a.quantity - b.quantity;
            }

            return a.id - b.id;
          }
        );

        const requestedVariant = requestedPackaging
          ? sortedVariants.find(
              (variant) =>
                variant.packaging === requestedPackaging
            )
          : undefined;

        const firstPlasticBoxVariant =
          sortedVariants.find(
            (variant) =>
              variant.packaging === "Plastic Box"
          );

        const firstCardboardBoxVariant =
          sortedVariants.find(
            (variant) =>
              variant.packaging === "Cardboard Box"
          );

        const firstGlassJarVariant =
          sortedVariants.find(
            (variant) =>
              variant.packaging === "Glass Jar"
          );

        const initialVariant =
          requestedVariant ??
          firstPlasticBoxVariant ??
          firstCardboardBoxVariant ??
          firstGlassJarVariant;

        if (initialVariant) {
          setSelectedPackaging(
            initialVariant.packaging as PackagingOption
          );

          setSelectedVariantId(initialVariant.id);
        } else {
          setSelectedPackaging("Plastic Box");
          setSelectedVariantId(null);
        }

        setQuantity(1);
      } catch (fetchError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to fetch product:",
          fetchError
        );

        setProduct(null);
        setError(
          "Unable to load this product right now."
        );
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
  }, [id, requestedPackaging]);

  /* =========================================================
     AVAILABLE PACKAGING OPTIONS
  ========================================================= */

  const availablePackagings =
    useMemo<PackagingOption[]>(() => {
      if (!product) {
        return [];
      }

      const options: PackagingOption[] = [];

      const hasPlasticBox = product.variants.some(
        (variant) =>
          variant.packaging === "Plastic Box"
      );

      const hasCardboardBox = product.variants.some(
        (variant) =>
          variant.packaging === "Cardboard Box"
      );

      const hasGlassJar = product.variants.some(
        (variant) =>
          variant.packaging === "Glass Jar"
      );

      if (hasPlasticBox) {
        options.push("Plastic Box");
      }

      if (hasCardboardBox) {
        options.push("Cardboard Box");
      }

      if (hasGlassJar) {
        options.push("Glass Jar");
      }

      return options;
    }, [product]);

  /* =========================================================
     VARIANTS FOR SELECTED PACKAGING

     Plastic Box:
       Plastic Box + Cardboard Box variants

     Cardboard Box:
       Plastic Box + Cardboard Box variants

     Glass Jar:
       Glass Jar variants only
  ========================================================= */

  const packagingVariants = useMemo(() => {
    if (!product || !selectedPackaging) {
      return [];
    }

    return product.variants
      .filter((variant) => {
        if (selectedPackaging === "Glass Jar") {
          return variant.packaging === "Glass Jar";
        }

        return (
          variant.packaging === "Plastic Box" ||
          variant.packaging === "Cardboard Box"
        );
      })
      .sort((a, b) => {
        if (a.quantity !== b.quantity) {
          return a.quantity - b.quantity;
        }

        return a.id - b.id;
      });
  }, [product, selectedPackaging]);

  /* =========================================================
     SELECTED VARIANT
  ========================================================= */

  const selectedVariant =
    packagingVariants.find(
      (variant) => variant.id === selectedVariantId
    ) ??
    packagingVariants[0] ??
    null;

  /* =========================================================
     CHANGE PACKAGING
  ========================================================= */

  const handlePackagingChange = (packaging: string) => {
    if (
      packaging !== "Plastic Box" &&
      packaging !== "Cardboard Box" &&
      packaging !== "Glass Jar"
    ) {
      return;
    }

    if (!product) {
      return;
    }

    /*
     * Find variants available for the selected
     * packaging group.
     */
    const matchingVariants = product.variants
      .filter((variant) => {
        if (packaging === "Glass Jar") {
          return variant.packaging === "Glass Jar";
        }

        return (
          variant.packaging === "Plastic Box" ||
          variant.packaging === "Cardboard Box"
        );
      })
      .sort((a, b) => {
        if (a.quantity !== b.quantity) {
          return a.quantity - b.quantity;
        }

        return a.id - b.id;
      });

    setSelectedPackaging(packaging);

    /*
     * Prefer the exact packaging variant when available.
     * This avoids selecting a Plastic Box variant while
     * the Cardboard Box option is selected.
     */
    const preferredVariant = matchingVariants.find(
      (variant) => variant.packaging === packaging
    );

    setSelectedVariantId(
      (preferredVariant ?? matchingVariants[0])?.id ?? null
    );

    setQuantity(1);
  };

  /* =========================================================
     CHANGE VARIANT
  ========================================================= */

  const handleVariantChange = (
    variant: ProductVariant
  ) => {
    setSelectedVariantId(variant.id);
    setQuantity(1);
  };

  /* =========================================================
     QUANTITY
  ========================================================= */

  const handleQuantityChange = (nextQuantity: number) => {
    setQuantity(Math.max(1, nextQuantity));
  };

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      return;
    }

    if (quantity <= 0) {
      return;
    }

    /*
     * Authenticated user:
     * directly add item to cart.
     */
    if (isAuthenticated) {
      addToCart(product, selectedVariant, quantity);
      return;
    }

    /*
     * Guest user:
     * save pending cart item, then open OTP auth modal.
     */
    setPendingCartItem(
      product,
      selectedVariant,
      quantity
    );

    setIsAuthModalOpen(true);
  };

  /* =========================================================
     AUTH SUCCESS
  ========================================================= */

  const handleAuthSuccess = () => {
    addPendingCartItem();
    setIsAuthModalOpen(false);
  };

  /* =========================================================
     REVIEW LOGIN
  ========================================================= */

  const handleReviewLoginRequired = () => {
    /*
     * Reuse the existing OTP authentication modal.
     */
    setIsAuthModalOpen(true);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#FFFCF7] px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid animate-pulse gap-8 lg:grid-cols-2 lg:gap-14">
            {/* Image Skeleton */}
            <div className="min-h-[420px] rounded-2xl bg-[#F5EFE6]" />

            {/* Info Skeleton */}
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

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !product) {
    return (
      <main className="min-h-[70vh] bg-[#FFFCF7] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <h1 className="text-2xl font-semibold text-[#1F4A2E]">
            Product Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#8B7A6C]">
            {error ||
              "The product you are looking for is no longer available."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              mt-7
              rounded-xl
              bg-[#B5697A]
              px-6
              py-3
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-[#A55F70]
              focus:outline-none
              focus:ring-2
              focus:ring-[#B5697A]/30
              focus:ring-offset-2
            "
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <>
      <main className="bg-white px-5 py-28 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="mx-auto w-full max-w-6xl">
          {/* PRODUCT SECTION */}
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-[#EFE3D2]
              bg-white
              shadow-sm
            "
          >
            <div className="grid lg:grid-cols-[1fr_1fr]">
              {/* LEFT: PRODUCT IMAGES */}
              <ProductDetailsImage
                product={product}
                packaging={selectedPackaging}
              />

              {/* RIGHT: PRODUCT INFORMATION */}
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

          {/* PRODUCT PICKER GUIDE */}
          <div
            className="
              px-5
              py-6
              sm:px-8
              sm:py-7
              lg:px-12
              lg:py-8
            "
          >
            <div className="mx-auto w-full max-w-2xl">
              <ProductPickerGuide />
            </div>
          </div>

          {/* CUSTOMER STORIES */}
          <div
            className="
              px-5
              pb-8
              sm:px-8
              sm:pb-10
              lg:px-12
              lg:pb-12
            "
          >
            <div className="mx-auto w-full max-w-6xl">
              <CustomerStories productName={product.name} />
            </div>
          </div>

          {/* RECOMMENDED PRODUCTS */}
          <div
            className="
              px-5
              pb-10
              sm:px-8
              sm:pb-12
              lg:px-12
              lg:pb-14
            "
          >
            <div className="mx-auto w-full max-w-6xl">
              <RecommendedProducts
                currentProductId={product.id}
              />
            </div>
          </div>

          {/* CUSTOMER REVIEWS */}
          <div
            className="
              px-5
              pb-10
              sm:px-8
              sm:pb-12
              lg:px-12
              lg:pb-14
            "
          >
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

      {/* EXISTING OTP AUTH MODAL */}
      {isAuthModalOpen && (
        <OtpAuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}

export default ProductDetailsPage;
