import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPackaging, setSelectedPackaging] =
    useState<string>("");

  const [selectedVariantId, setSelectedVariantId] =
    useState<number | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  const setPendingCartItem = useCartStore(
    (state) => state.setPendingCartItem
  );

  const addPendingCartItem = useCartStore(
    (state) => state.addPendingCartItem
  );

  /* =========================================================
     FETCH PRODUCT
  ========================================================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const productId = Number(id);

        if (!Number.isInteger(productId) || productId <= 0) {
          throw new Error("Invalid product ID.");
        }

        const data = await getProductById(productId);

        setProduct(data);

        const firstVariant = data.variants[0];

        if (firstVariant) {
          setSelectedPackaging(firstVariant.packaging);
          setSelectedVariantId(firstVariant.id);
        }
      } catch (fetchError) {
        console.error(
          "Failed to fetch product:",
          fetchError
        );

        setError(
          "Unable to load this product right now."
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchProduct();
  }, [id]);

  /* =========================================================
     AVAILABLE PACKAGING
  ========================================================= */
  const availablePackagings = useMemo(() => {
    if (!product) return [];

    return Array.from(
      new Set(
        product.variants.map(
          (variant) => variant.packaging
        )
      )
    );
  }, [product]);

  /* =========================================================
     VARIANTS FOR SELECTED PACKAGING
  ========================================================= */
  const packagingVariants = useMemo(() => {
    if (!product || !selectedPackaging) {
      return [];
    }

    return product.variants
      .filter(
        (variant) =>
          variant.packaging === selectedPackaging
      )
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
      (variant) =>
        variant.id === selectedVariantId
    ) ??
    packagingVariants[0] ??
    null;

  /* =========================================================
     CHANGE PACKAGING
  ========================================================= */
  const handlePackagingChange = (
    packaging: string
  ) => {
    setSelectedPackaging(packaging);

    const firstVariant = product?.variants.find(
      (variant) =>
        variant.packaging === packaging
    );

    setSelectedVariantId(
      firstVariant?.id ?? null
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
  const handleQuantityChange = (
    nextQuantity: number
  ) => {
    setQuantity(Math.max(1, nextQuantity));
  };

  /* =========================================================
     ADD TO CART
  ========================================================= */
  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    if (quantity <= 0) return;

    if (isAuthenticated) {
      addToCart(
        product,
        selectedVariant,
        quantity
      );

      return;
    }

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
              mt-7 rounded-xl
              bg-[#B5697A]
              px-6 py-3
              text-sm font-medium
              text-white
              transition-colors
              hover:bg-[#A55F70]
            "
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="bg-[#FFFCF7] px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="mx-auto w-full max-w-6xl">

          {/* ================= BREADCRUMB ================= */}
          {/* <div className="mb-6 flex items-center gap-2 text-xs text-[#8B7A6C]">
            <Link
              to="/"
              className="transition-colors hover:text-[#B5697A]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to="/#products"
              className="transition-colors hover:text-[#B5697A]"
            >
              Products
            </Link>

            <span>/</span>

            <span className="truncate text-[#2C2C2C]">
              {product.name}
            </span>
          </div> */}

          {/* ================= PRODUCT ================= */}
          <div
            className="
              grid
              rounded-2xl
              border border-[#EFE3D2]
            bg-white
              shadow-[0_8px_40px_-18px_rgba(139,111,92,0.18)]
              lg:grid-cols-[1fr_1fr]
            "
          >
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
              onPackagingChange={
                handlePackagingChange
              }
              onVariantChange={
                handleVariantChange
              }
              onQuantityChange={
                handleQuantityChange
              }
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </main>

      {/* ================= AUTH ================= */}
      {isAuthModalOpen && (
        <OtpAuthModal
          onClose={() =>
            setIsAuthModalOpen(false)
          }
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}

export default ProductDetailsPage;