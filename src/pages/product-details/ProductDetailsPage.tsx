
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
// import CustomerStories from "../../components/product-details/CustomerStories";
import CustomerReviews from "../../components/product-details/reviews/ProductReviews";
import RecommendedProducts from "../../components/product-details/RecommendedProducts";

type PackagingOption =
  | "Plastic Box"
  | "Cardboard Box"
  | "Glass Jar";

function isPackagingOption(
  packaging: unknown
): packaging is PackagingOption {
  return (
    packaging === "Plastic Box" ||
    packaging === "Cardboard Box" ||
    packaging === "Glass Jar"
  );
}

function sortVariants(variants: ProductVariant[]) {
  return [...variants].sort((a, b) => {
    if (a.quantity !== b.quantity) {
      return a.quantity - b.quantity;
    }

    return a.id - b.id;
  });
}

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Read packaging selected on the landing/product listing page.
   */
  const navigationState = location.state as {
    packaging?: unknown;
  } | null;

  const requestedPackaging = isPackagingOption(
    navigationState?.packaging
  )
    ? navigationState.packaging
    : null;

  /* =========================================================
     PRODUCT STATE
  ========================================================= */

  const [product, setProduct] = useState<Product | null>(null);
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
         * Initial selection priority:
         * 1. Packaging requested from navigation, if available.
         * 2. Plastic Box.
         * 3. Cardboard Box.
         * 4. Glass Jar.
         *
         * Smallest available size is selected first.
         */

        const sortedVariants = sortVariants(data.variants);

        const initialVariant =
          (
            requestedPackaging
              ? sortedVariants.find(
                  (variant) =>
                    variant.packaging === requestedPackaging
                )
              : undefined
          ) ??
          sortedVariants.find(
            (variant) => variant.packaging === "Plastic Box"
          ) ??
          sortedVariants.find(
            (variant) => variant.packaging === "Cardboard Box"
          ) ??
          sortedVariants.find(
            (variant) => variant.packaging === "Glass Jar"
          );

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
  }, [id, requestedPackaging]);

  /* =========================================================
     AVAILABLE PACKAGING OPTIONS
  ========================================================= */

  const availablePackagings = useMemo<PackagingOption[]>(() => {
    if (!product) {
      return [];
    }

    const options: PackagingOption[] = [];

    const hasPackaging = (packaging: PackagingOption) =>
      product.variants.some(
        (variant) => variant.packaging === packaging
      );

    if (hasPackaging("Plastic Box")) {
      options.push("Plastic Box");
    }

    if (hasPackaging("Cardboard Box")) {
      options.push("Cardboard Box");
    }

    if (hasPackaging("Glass Jar")) {
      options.push("Glass Jar");
    }

    return options;
  }, [product]);

  /* =========================================================
     VARIANTS FOR SELECTED PACKAGING

     Only variants matching the selected packaging are shown.
  ========================================================= */

  const packagingVariants = useMemo(() => {
    if (!product) {
      return [];
    }

    return sortVariants(
      product.variants.filter(
        (variant) => variant.packaging === selectedPackaging
      )
    );
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

  /*
   * Keep selection valid if the packaging changes or the
   * current variant is no longer available.
   */
  useEffect(() => {
    const currentVariantExists = packagingVariants.some(
      (variant) => variant.id === selectedVariantId
    );

    if (!currentVariantExists) {
      setSelectedVariantId(packagingVariants[0]?.id ?? null);
      setQuantity(1);
    }
  }, [packagingVariants, selectedVariantId]);

  /* =========================================================
     CHANGE PACKAGING
  ========================================================= */

  const handlePackagingChange = (packaging: string) => {
    if (!isPackagingOption(packaging) || !product) {
      return;
    }

    const matchingVariants = sortVariants(
      product.variants.filter(
        (variant) => variant.packaging === packaging
      )
    );

    setSelectedPackaging(packaging);
    setSelectedVariantId(matchingVariants[0]?.id ?? null);
    setQuantity(1);
  };

  /* =========================================================
     CHANGE VARIANT
  ========================================================= */

  const handleVariantChange = (variant: ProductVariant) => {
    if (variant.packaging !== selectedPackaging) {
      return;
    }

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
    if (!product || !selectedVariant || quantity <= 0) {
      return;
    }

    if (selectedVariant.packaging !== selectedPackaging) {
      return;
    }

    if (isAuthenticated) {
      addToCart(product, selectedVariant, quantity);
      return;
    }

    setPendingCartItem(product, selectedVariant, quantity);
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
              mt-7 rounded-xl bg-[#B5697A] px-6 py-3
              text-sm font-medium text-white transition-colors
              hover:bg-[#A55F70] focus:outline-none
              focus:ring-2 focus:ring-[#B5697A]/30 focus:ring-offset-2
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
          <div className="overflow-hidden rounded-2xl border border-[#EFE3D2] bg-white shadow-sm">
            <div className="grid lg:grid-cols-[1fr_1fr]">
              <ProductDetailsImage
                product={product}
                packaging={selectedPackaging}
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

          {/* PRODUCT PICKER GUIDE */}
          <div className="px-5 py-6 sm:px-8 sm:py-7 lg:px-12 lg:py-8">
            <div className="mx-auto w-full max-w-2xl">
              <ProductPickerGuide />
            </div>
          </div>

          {/* CUSTOMER STORIES - PRESERVED AS COMMENTED IN YOUR CODE */}
          {/* <div className="px-5 pb-8 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
            <div className="mx-auto w-full max-w-6xl">
              <CustomerStories productName={product.name} />
            </div>
          </div> */}

          {/* RECOMMENDED PRODUCTS */}
          <div className="px-5 pb-10 sm:px-8 sm:pb-12 lg:px-12 lg:pb-14">
            <div className="mx-auto w-full max-w-6xl">
              <RecommendedProducts currentProductId={product.id} />
            </div>
          </div>

          {/* CUSTOMER REVIEWS */}
          <div className="px-5 pb-10 sm:px-8 sm:pb-12 lg:px-12 lg:pb-14">
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
