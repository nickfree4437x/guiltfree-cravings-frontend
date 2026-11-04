import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Image as ImageIcon,
  Info,
  Package,
  XCircle,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { getAdminProductById } from "../../../api/adminProductsApi";

import type {
  AdminProduct,
  ProductVariant,
} from "../../../components/admin/products/types";

// ======================================================
// HELPERS
// ======================================================

// API URL can contain /api, but uploaded images are served
// from the backend origin, not from the /api endpoint.
const getBackendOrigin = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL?.trim();

  if (!apiUrl) {
    return window.location.origin;
  }

  try {
    const url = new URL(apiUrl, window.location.origin);

    url.pathname = url.pathname.replace(/\/api\/?$/, "");
    url.search = "";
    url.hash = "";

    return url.origin + url.pathname.replace(/\/$/, "");
  } catch {
    return window.location.origin;
  }
};

const BACKEND_ORIGIN = getBackendOrigin();

/**
 * Supports:
 * - Cloudinary absolute URLs
 * - Other absolute image URLs
 * - Legacy /uploads/products/... paths
 * - Relative image paths
 */
const normalizeImageUrl = (
  value?: string | null,
): string => {
  if (typeof value !== "string") {
    return "";
  }

  const image = value.trim();

  if (!image) {
    return "";
  }

  // Preserve Cloudinary and other absolute URLs.
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  // Protocol-relative URLs.
  if (image.startsWith("//")) {
    return `${window.location.protocol}${image}`;
  }

  // Data URLs, if ever used.
  if (/^data:image\//i.test(image)) {
    return image;
  }

  // Legacy backend uploads and relative paths.
  if (image.startsWith("/")) {
    return `${BACKEND_ORIGIN}${image}`;
  }

  return `${BACKEND_ORIGIN}/${image.replace(/^\/+/, "")}`;
};

const uniqueImages = (
  values: Array<string | null | undefined>,
): string[] => {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const normalized = normalizeImageUrl(value);

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(normalized);
  }

  return result;
};

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);

const formatDate = (
  value?: string | null,
): string => {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (
  value?: string | null,
): string => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const cleanText = (
  value?: string | null,
): string => value?.trim() || "";

const getQuantityLabel = (
  variant: ProductVariant,
): string => `${variant.quantity} ${variant.unit}`;

const getImageList = (
  product: AdminProduct,
): string[] => {
  return uniqueImages([
    product.image,
    ...(product.images ?? []),
    ...(product.regularImages ?? []),
    product.glassJarImage,
    ...(product.glassJarImages ?? []),
    product.cardboardBoxImage,
    ...(product.cardboardBoxImages ?? []),
  ]);
};

// ======================================================
// REUSABLE COMPONENTS
// ======================================================

function SectionCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-[#F0DDE1] bg-white shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3 border-b border-[#F5E7EA] px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold text-gray-700 md:text-[16px]">
            {title}
          </h2>

          {description && (
            <p className="text-[11px] leading-relaxed text-slate-500 md:text-[12px]">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  const text = cleanText(value);

  return (
    <div className="rounded-xl border border-[#F2E5E8] bg-[#FFFBFC] p-4 transition-colors">
      <p className="text-xs uppercase tracking-[0.08em] text-slate-600">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-line break-words text-[11px] leading-relaxed text-slate-600 md:text-[12px]">
        {text || "Not provided"}
      </p>
    </div>
  );
}

function ProductImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  onClick?: () => void;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#C69AA5]">
        <ImageIcon size={25} strokeWidth={1.4} />
        <span className="text-[10px]">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onClick={onClick}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-9 w-52 rounded-xl bg-[#F0DDE1]" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="h-80 rounded-2xl bg-[#F5E7EA] lg:col-span-2" />
        <div className="h-80 rounded-2xl bg-[#F5E7EA] lg:col-span-3" />
      </div>

      <div className="h-64 rounded-2xl bg-[#F5E7EA]" />
      <div className="h-64 rounded-2xl bg-[#F5E7EA]" />
    </div>
  );
}

// ======================================================
// MAIN PAGE
// ======================================================

export default function AdminProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const productId = Number(id);

  const [product, setProduct] =
    useState<AdminProduct | null>(null);

  const [selectedImage, setSelectedImage] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // FETCH PRODUCT
  // --------------------------------------------------

  const loadProduct = useCallback(async () => {
    if (
      !id ||
      !Number.isSafeInteger(productId) ||
      productId <= 0
    ) {
      setError("The product ID is invalid.");
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await getAdminProductById(productId);

      setProduct(result);

      const availableImages = getImageList(result);

      setSelectedImage(
        normalizeImageUrl(result.image) ||
          availableImages[0] ||
          "",
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load product details.",
      );

      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id, productId]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  // --------------------------------------------------
  // MEMOIZED DATA
  // --------------------------------------------------

  const images = useMemo(
    () => (product ? getImageList(product) : []),
    [product],
  );

  const sortedVariants = useMemo(() => {
    if (!product) {
      return [];
    }

    return [...(product.variants ?? [])].sort(
      (a, b) => {
        const packagingComparison =
          a.packaging.localeCompare(b.packaging);

        return (
          packagingComparison ||
          a.quantity - b.quantity
        );
      },
    );
  }, [product]);

  const pricing = useMemo(() => {
    if (!sortedVariants.length) {
      return {
        min: null as number | null,
        max: null as number | null,
      };
    }

    const prices = sortedVariants.map(
      (variant) => Number(variant.price),
    );

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [sortedVariants]);

  const packagingGroups = useMemo(() => {
    const groups = new Map<string, ProductVariant[]>();

    sortedVariants.forEach((variant) => {
      const existing =
        groups.get(variant.packaging) ?? [];

      existing.push(variant);
      groups.set(variant.packaging, existing);
    });

    return Array.from(groups.entries());
  }, [sortedVariants]);

  // --------------------------------------------------
  // PACKAGING IMAGE GROUPS
  // Keep each packaging type independent.
  // --------------------------------------------------

  const packagingImages = useMemo(() => {
    if (!product) {
      return [];
    }

    return [
      {
        title: "Regular Packaging",
        images: uniqueImages([
          ...(product.regularImages ?? []),
        ]),
        fallbackImage: normalizeImageUrl(product.image),
      },
      {
        title: "Glass Jar",
        images: uniqueImages([
          product.glassJarImage,
          ...(product.glassJarImages ?? []),
        ]),
        fallbackImage: "",
      },
      {
        title: "Cardboard Box",
        images: uniqueImages([
          product.cardboardBoxImage,
          ...(product.cardboardBoxImages ?? []),
        ]),
        fallbackImage: "",
      },
    ];
  }, [product]);

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFAFB] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------

  if (error || !product) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#FFFAFB] p-5">
        <div className="w-full max-w-md rounded-2xl border border-[#F0DDE1] bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F9ECEF] text-[#B5697A]">
            <XCircle size={28} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-[#33252A]">
            Unable to load product
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#8B737A]">
            {error ||
              "The requested product could not be found."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#EBD6DC] px-4 py-2.5 text-sm font-semibold text-[#76545E] transition hover:bg-[#FFF5F7]"
            >
              <ArrowLeft size={14} />
              Back to Products
            </button>

            <button
              type="button"
              onClick={() => void loadProduct()}
              className="rounded-xl bg-[#B5697A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#985568]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-white px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="inline-flex items-center gap-1 text-[12px] md:text-[13px] text-[#A85F70] transition hover:text-[#8F4E60] hover:underline"
        >
          <ArrowLeft size={14} />
          Back to Products
        </button>

        {/* PRODUCT OVERVIEW */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* PRODUCT GALLERY */}

          <section className="overflow-hidden rounded-xl border border-[#F0DDE1] bg-white shadow-sm lg:col-span-2">
            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-white p-5 sm:min-h-[350px]">
              {selectedImage ? (
                <ProductImage
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  loading="eager"
                  className="relative z-10 max-h-[340px] w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-[#C69AA5]">
                  <ImageIcon
                    size={48}
                    strokeWidth={1.3}
                  />

                  <span className="text-sm">
                    No product image available
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-[#F5E7EA] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[12px] md:text-[13px] font-semibold text-gray-700">
                  Product Gallery
                </p>

                <span className="shrink-0 rounded-full bg-[#FFF1F4] px-2.5 py-1 text-[10px] text-[#A55D70]">
                  {images.length}{" "}
                  {images.length === 1 ? "image" : "images"}
                </span>
              </div>

              {images.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      type="button"
                      key={image}
                      onClick={() =>
                        setSelectedImage(image)
                      }
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={
                        selectedImage === image
                      }
                      className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-1 transition-all duration-200 sm:h-[72px] sm:w-[72px] ${
                        selectedImage === image
                          ? "border-[#B5697A]"
                          : "border-[#F0DDE1] hover:border-[#D9A7B3]"
                      }`}
                    >
                      <ProductImage
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full rounded-lg object-contain"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#967D84]">
                  No product images available.
                </p>
              )}
            </div>
          </section>

          {/* PRODUCT SUMMARY */}

          <section className="rounded-xl border border-[#F0DDE1] bg-white p-5 shadow-sm sm:p-7 lg:col-span-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="mt-1 break-words text-[16px] font-semibold leading-tight text-gray-700 sm:text-[20px]">
                {product.name}
              </h2>

              <span className="rounded-lg border border-[#F0DDE1] bg-[#FFFAFB] px-3 py-1.5 text-[11px] md:text-[12px] text-[#9A6271]">
                #{product.id}
              </span>
            </div>

            <p className="mt-2 whitespace-pre-line text-[12px] leading-relaxed text-slate-500 md:text-[13.5px]">
              {cleanText(product.description) ||
                "No product description has been added."}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#F0DDE1] bg-gradient-to-br from-[#FFF9FA] to-[#FBEFF2] p-4">
                <p className="text-[12px] font-semibold text-[#A45C70] md:text-[14px]">
                  Available Variants
                </p>

                <p className="mt-2 text-xl font-semibold text-[#33252A] md:text-2xl">
                  {sortedVariants.length}
                </p>
              </div>

              <div className="rounded-xl border border-[#F0DDE1] bg-gradient-to-br from-[#FFFAFB] to-[#F8F0F2] p-4">
                <p className="text-[12px] font-semibold text-[#A45C70] md:text-[14px]">
                  Packaging Options
                </p>

                <p className="mt-2 text-xl font-semibold text-[#33252A] md:text-2xl">
                  {packagingGroups.length}
                </p>
              </div>

              <div className="rounded-xl border border-[#EBD6DC] bg-[#FFFAFB] p-4 sm:col-span-2">
                <p className="text-[12px] font-semibold text-[#A45C70] md:text-[14px]">
                  {pricing.min === null
                    ? "Pricing"
                    : pricing.min === pricing.max
                      ? "Product Price"
                      : "Price Range"}
                </p>

                <p className="mt-1 text-lg font-semibold tracking-tight text-gray-700 md:text-xl">
                  {pricing.min === null
                    ? "Not configured"
                    : pricing.min === pricing.max
                      ? formatPrice(pricing.min)
                      : `${formatPrice(pricing.min)} – ${formatPrice(pricing.max!)}`}
                </p>

                <p className="mt-1 text-xs text-[#967D84]">
                  Based on configured variant prices
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#F0DDE1] bg-white p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F9E9ED] text-[#B5697A]">
                <Info size={18} />
              </div>

              <div>
                <p className="text-[12px] md:text-[13px] font-semibold text-gray-700">
                  Product visibility
                </p>

                <p className="mt-0 text-[11px] leading-relaxed text-slate-500 md:text-[12px]">
                  {product.isActive
                    ? "This product is marked active in the database."
                    : "This product is marked inactive in the database."}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* VARIANTS & PRICING */}

        <SectionCard
          title="Variants & Pricing"
          description="Configured quantities, packaging types and prices for this product."
        >
          {sortedVariants.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sortedVariants.map((variant) => (
                <article
                  key={variant.id}
                  className="rounded-xl border border-[#F0DDE1] bg-white p-4"
                >
                  <h3 className="text-md font-semibold text-gray-700 md:text-lg">
                    {getQuantityLabel(variant)}
                  </h3>

                  <p className="mt-1 text-[12px] text-slate-500 md:text-[13px]">
                    {variant.packaging}
                  </p>

                  <div className="mt-2 flex items-end justify-between gap-3 border-t border-[#F5E7EA] pt-4">
                    <span className="text-xs text-slate-600">
                      Variant Price
                    </span>

                    <span className="text-lg font-semibold text-[#B5697A] md:text-xl">
                      {formatPrice(Number(variant.price))}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#E4C6CE] bg-[#FFFAFB] px-5 py-10 text-center">
              <Package
                size={32}
                className="mx-auto text-[#C69AA5]"
              />

              <p className="mt-3 font-semibold text-gray-700">
                No variants configured
              </p>

              <p className="mt-1 text-sm text-[#967D84]">
                No pricing variants are available for this
                product.
              </p>
            </div>
          )}
        </SectionCard>

        {/* PACKAGING OPTIONS */}

        <SectionCard
          title="Packaging Options"
          description="Images configured for each packaging type."
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {packagingImages.map((group) => {
              const packageImageList = group.images;

              const preview =
                packageImageList[0] ||
                group.fallbackImage;

              return (
                <article
                  key={group.title}
                  className="overflow-hidden rounded-xl border border-[#F0DDE1] bg-white transition"
                >
                  {/* Packaging Preview */}

                  <div className="flex h-44 items-center justify-center overflow-hidden bg-white p-4 sm:h-52">
                    {preview ? (
                      <ProductImage
                        src={preview}
                        alt={group.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-[#C69AA5]">
                        <ImageIcon
                          size={30}
                          className="mx-auto"
                        />

                        <p className="mt-2 text-xs">
                          No image available
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#F5E7EA] p-4">
                    <h3 className="text-[12px] font-semibold text-gray-700 md:text-[14px]">
                      {group.title}
                    </h3>

                    <p className="mt-1 text-[11px] text-slate-500 md:text-[12px]">
                      {packageImageList.length > 0
                        ? `${packageImageList.length} image${packageImageList.length === 1 ? "" : "s"} configured`
                        : preview
                          ? "Using the main product image"
                          : "No packaging image configured"}
                    </p>

                    {/* Individual Packaging Thumbnails */}

                    {packageImageList.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {packageImageList.map(
                          (image, index) => (
                            <button
                              key={image}
                              type="button"
                              onClick={() =>
                                setSelectedImage(image)
                              }
                              aria-label={`View ${group.title} image ${index + 1}`}
                              aria-pressed={
                                selectedImage === image
                              }
                              className={`flex h-[66px] w-[66px] items-center justify-center overflow-hidden rounded-xl border bg-white p-1 transition-all duration-200 ${
                                selectedImage === image
                                  ? "border-[#B5697A]"
                                  : "border-[#F0DDE1] hover:border-[#D9A7B3]"
                              }`}
                            >
                              <ProductImage
                                src={image}
                                alt={`${group.title} ${index + 1}`}
                                className="h-full w-full rounded-lg object-contain"
                              />
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </SectionCard>

        {/* PRODUCT INFORMATION */}

        <SectionCard
          title="Product Information"
          description="Ingredients, product benefits and important customer information."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoItem
              label="Ingredients"
              value={product.ingredients}
            />

            <InfoItem
              label="Allergen Information"
              value={product.allergenInfo}
            />

            <InfoItem
              label="Benefits"
              value={product.benefits}
            />

            <InfoItem
              label="Usage Suggestions"
              value={product.usageSuggestions}
            />
          </div>

          <div className="mt-4 rounded-xl border border-[#EBD6DC] bg-[#FFF8F9] p-4">
            <p className="text-xs text-[#8D4C5E] md:text-sm">
              Medical Disclaimer
            </p>

            <p className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-500 md:text-[12px]">
              {cleanText(product.medicalDisclaimer) ||
                "No medical disclaimer provided."}
            </p>
          </div>
        </SectionCard>

        {/* STORAGE & SHELF LIFE */}

        <SectionCard
          title="Storage & Shelf Life"
          description="Product storage guidance and shelf-life information."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoItem
              label="Storage Instructions"
              value={product.storageInstructions}
            />

            <InfoItem
              label="Shelf Life"
              value={product.shelfLife}
            />
          </div>
        </SectionCard>

        {/* RECORD INFORMATION */}

        <SectionCard
          title="Record Information"
          description="Creation and last-update timestamps from the database."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#F0DDE1] bg-[#FFFBFC] p-4">
              <p className="flex items-center gap-2 text-[12px] text-[#9A6B78] md:text-[13px]">
                <CalendarDays size={15} />
                Created On
              </p>

              <p className="mt-2 font-semibold text-gray-700">
                {formatDate(product.createdAt)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatDateTime(product.createdAt)}
              </p>
            </div>

            <div className="rounded-xl border border-[#F0DDE1] bg-[#FFFBFC] p-4">
              <p className="flex items-center gap-2 text-[12px] text-[#9A6B78] md:text-[13px]">
                <Clock3 size={15} />
                Last Updated
              </p>

              <p className="mt-2 font-semibold text-gray-700">
                {formatDate(product.updatedAt)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatDateTime(product.updatedAt)}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}