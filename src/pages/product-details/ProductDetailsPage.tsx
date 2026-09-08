import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProductById } from "../../api/productApi";
import type {
  Product,
  ProductVariant,
} from "../../api/productApi";

import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";

import ProductDetailsSkeleton from "../../components/product-details/ProductDetailsSkeleton";
import ProductNotFound from "../../components/product-details/ProductNotFound";
import ProductImage from "../../components/product-details/ProductImage";
import ProductInfo from "../../components/product-details/ProductInfo";
import OtpAuthModal from "../../components/auth/OtpAuthModal";

function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addedToCart, setAddedToCart] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);

  const [pendingCartItem, setPendingCartItem] =
    useState<{
      product: Product;
      variant: ProductVariant;
      quantity: number;
    } | null>(null);

  const { isAuthenticated } = useAuthStore();

  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  const parsedId = Number(id);

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        setError("Invalid product.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getProductById(parsedId);

        if (!mounted) return;

        setProduct(response);

        const firstVariant =
          response.variants?.[0] ?? null;

        setSelectedVariant(firstVariant);
        setQuantity(1);
      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this product."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [parsedId]);

  const variants = useMemo(() => {
    if (!product?.variants) return [];

    return [...product.variants].sort((a, b) => {
      if (a.quantity !== b.quantity) {
        return a.quantity - b.quantity;
      }

      return a.packaging.localeCompare(
        b.packaging
      );
    });
  }, [product]);

  const hasVariants = variants.length > 0;

  const formatQuantity = (
    variant: ProductVariant
  ) => {
    return `${variant.quantity}${variant.unit}`;
  };

  const handleVariantChange = (
    variant: ProductVariant
  ) => {
    setSelectedVariant(variant);
    setQuantity(1);
    setAddedToCart(false);
    setPendingCartItem(null);
  };

  const handleIncreaseQuantity = () => {
    setQuantity((current) => current + 1);
    setAddedToCart(false);
    setPendingCartItem(null);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );

    setAddedToCart(false);
    setPendingCartItem(null);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    if (!isAuthenticated) {
      setPendingCartItem({
        product,
        variant: selectedVariant,
        quantity,
      });

      setIsAuthModalOpen(true);
      return;
    }

    addToCart(
      product,
      selectedVariant,
      quantity
    );

    setAddedToCart(true);
  };

  const handleAuthSuccess = () => {
    if (
      pendingCartItem?.product &&
      pendingCartItem.variant
    ) {
      addToCart(
        pendingCartItem.product,
        pendingCartItem.variant,
        pendingCartItem.quantity
      );

      setAddedToCart(true);
      setPendingCartItem(null);
    }

    setIsAuthModalOpen(false);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    setPendingCartItem(null);
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return <ProductNotFound error={error} />;
  }

  return (
    <>
      <main className="min-h-screen bg-[#fffaf5] px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">

          {/* Back navigation */}
          <Link
            to="/#products"
            className="group inline-flex items-center gap-2 px-3.5 py-2 hover:underline text-sm text-slate-600 shadow-[0_2px_8px_rgba(117,69,39,0.04)] transition-all duration-200"
          >
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8eee4] text-[#8b542f] transition-all duration-200 group-hover:-translate-x-0.5 group-hover:bg-[#f3e4d3]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </span>

            <span>Back to Products</span>
          </Link>

          {/* Product layout */}
          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-16 xl:gap-20">

            {/* Image */}
            <ProductImage
              image={
                product.image
              }
              name={product.name}
            />

            {/* Information */}
            <ProductInfo
              product={product}
              variants={variants}
              selectedVariant={
                selectedVariant
              }
              quantity={quantity}
              hasVariants={
                hasVariants
              }
              addedToCart={
                addedToCart
              }
              formatQuantity={
                formatQuantity
              }
              onVariantChange={
                handleVariantChange
              }
              onIncreaseQuantity={
                handleIncreaseQuantity
              }
              onDecreaseQuantity={
                handleDecreaseQuantity
              }
              onAddToCart={
                handleAddToCart
              }
            />
          </div>
        </div>
      </main>

      {isAuthModalOpen && (
        <OtpAuthModal
          onClose={
            handleAuthModalClose
          }
          onSuccess={
            handleAuthSuccess
          }
        />
      )}
    </>
  );
}

export default ProductDetailsPage;