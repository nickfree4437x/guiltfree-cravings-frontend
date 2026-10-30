import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BadgeCheck, CalendarDays, Clock3, Image as ImageIcon,
  Info, Leaf, Package, ShieldCheck, ShoppingBag, Sparkles, XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getAdminProductById } from "../../../api/adminProductsApi";
import type { AdminProduct, ProductVariant } from "../../../components/admin/products/types";

// ─── Helpers ──────────────────────────────────────────────
const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(price);

const formatDate = (value?: string | null): string => {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

const formatDateTime = (value?: string | null): string => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  }).format(date);
};

const cleanText = (value?: string | null): string => value?.trim() || "";
const getPackagingLabel = (packaging: string): string => packaging;
const getQuantityLabel = (variant: ProductVariant): string => `${variant.quantity} ${variant.unit}`;

const getImageList = (product: AdminProduct): string[] => {
  const images = [
    product.image,
    ...(product.images ?? []),
    ...(product.regularImages ?? []),
    product.glassJarImage ?? "",
    ...(product.glassJarImages ?? []),
    product.cardboardBoxImage ?? "",
    ...(product.cardboardBoxImages ?? []),
  ];
  return [...new Set(images.filter((img): img is string => typeof img === "string" && img.trim().length > 0))];
};

// ─── Reusable Components ──────────────────────────────────
function SectionCard({ title, description, children, className = "" }: { title: string; description?: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-[#F0DDE1] bg-white shadow-sm ${className}`}>
      <div className="flex items-start gap-3 border-b border-[#F5E7EA] px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h2 className="text-[14px] md:text-[16px] font-semibold text-gray-700">{title}</h2>
          {description && <p className="mt-0 text-[11px] md:text-[12px] leading-relaxed text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  const text = cleanText(value);
  return (
    <div className="rounded-xl border border-[#F2E5E8] bg-[#FFFBFC] p-4 transition-colors">
      <p className="text-xs uppercase tracking-[0.08em] text-slate-600">{label}</p>
      <p className="mt-2 whitespace-pre-line break-words text-[11px] md:text-[12px] leading-relaxed text-slate-600">
        {text || "Not provided"}
      </p>
    </div>
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

// ─── Main Page ────────────────────────────────────────────
export default function AdminProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Product
  const loadProduct = useCallback(async () => {
    if (!id || !Number.isSafeInteger(productId) || productId <= 0) {
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
      setSelectedImage((current) => {
        const available = getImageList(result);
        return current && available.includes(current) ? current : result.image || available[0] || "";
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load product details.");
    } finally {
      setLoading(false);
    }
  }, [id, productId]);

  useEffect(() => { void loadProduct(); }, [loadProduct]);

  // Memoized data
  const images = useMemo(() => (product ? getImageList(product) : []), [product]);

  const sortedVariants = useMemo(() => {
    if (!product) return [];
    return [...product.variants].sort((a, b) => {
      const pkg = a.packaging.localeCompare(b.packaging);
      return pkg || a.quantity - b.quantity;
    });
  }, [product]);

  const pricing = useMemo(() => {
    if (!sortedVariants.length) return { min: null as number | null, max: null as number | null };
    const prices = sortedVariants.map((v) => v.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [sortedVariants]);

  const packagingGroups = useMemo(() => {
    const groups = new Map<string, ProductVariant[]>();
    sortedVariants.forEach((v) => {
      const existing = groups.get(v.packaging) ?? [];
      existing.push(v);
      groups.set(v.packaging, existing);
    });
    return Array.from(groups.entries());
  }, [sortedVariants]);

  // ─── Loading & Error States ─────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFAFB] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl"><LoadingSkeleton /></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#FFFAFB] p-5">
        <div className="w-full max-w-md rounded-2xl border border-[#F0DDE1] bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F9ECEF] text-[#B5697A]">
            <XCircle size={28} />
          </div>
          <h1 className="mt-5 text-xl font-bold text-[#33252A]">Unable to load product</h1>
          <p className="mt-2 text-sm leading-6 text-[#8B737A]">{error || "The requested product could not be found."}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => navigate("/admin/products")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#EBD6DC] px-4 py-2.5 text-sm font-semibold text-[#76545E] transition hover:bg-[#FFF5F7]">
              <ArrowLeft size={16} /> Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Render ────────────────────────────────────────
  return (
    <main className="min-h-screen bg-white px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Back Button */}
        <button type="button" onClick={() => navigate("/admin/products")} className="inline-flex items-center gap-2 text-[13px] text-[#A85F70] transition hover:text-[#8F4E60] hover:underline">
          <ArrowLeft size={16} /> Back to Products
        </button>

        {/* Product Overview */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Gallery */}
          <section className="overflow-hidden rounded-2xl border border-[#F0DDE1] bg-white shadow-sm lg:col-span-2">
            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-white p-5 sm:min-h-[350px]">
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} className="relative z-10 max-h-[340px] w-full object-contain drop-shadow-sm" onError={() => setSelectedImage("")} />
              ) : (
                <div className="flex flex-col items-center gap-3 text-[#C69AA5]">
                  <ImageIcon size={48} strokeWidth={1.3} />
                  <span className="text-sm">No product image available</span>
                </div>
              )}
            </div>
            <div className="border-t border-[#F5E7EA] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Product Gallery</p>
                <span className="rounded-full bg-[#FFF1F4] px-2.5 py-1 text-xs text-[#A55D70]">{images.length} {images.length === 1 ? "image" : "images"}</span>
              </div>
              {images.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button type="button" key={`${image}-${index}`} onClick={() => setSelectedImage(image)} aria-label={`View product image ${index + 1}`} aria-pressed={selectedImage === image} className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-white p-1 transition sm:h-[72px] sm:w-[72px] ${selectedImage === image ? "border-[0.5px] border-[#B5697A]" : "border-[0.5px] border-[#F0DDE1] hover:border-[#D9A7B3]"}`}>
                      <img src={image} alt={`${product.name} ${index + 1}`} loading="lazy" className="h-full w-full rounded-lg object-contain" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#967D84]">No additional images available.</p>
              )}
            </div>
          </section>

          {/* Summary */}
          <section className="rounded-2xl border border-[#F0DDE1] bg-white p-5 shadow-sm sm:p-7 lg:col-span-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="mt-1 break-words text-[18px] font-semibold leading-tight text-gray-700 sm:text-[24px]">{product.name}</h2>
              <span className="rounded-lg border border-[#F0DDE1] bg-[#FFFAFB] px-3 py-1.5 text-xs text-[#9A6271]">#{product.id}</span>
            </div>
            <p className="mt-2 whitespace-pre-line text-[12px] md:text-[13.5px] leading-relaxed text-slate-500">
              {cleanText(product.description) || "No product description has been added."}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#F0DDE1] bg-gradient-to-br from-[#FFF9FA] to-[#FBEFF2] p-4">
                <p className="text-[12px] md:text-[14px] font-semibold text-[#A45C70]">Available Variants</p>
                <p className="mt-2 text-xl md:text-2xl font-semibold text-[#33252A]">{sortedVariants.length}</p>
                <p className="mt-1 text-xs text-slate-500">Configured product options</p>
              </div>
              <div className="rounded-xl border border-[#F0DDE1] bg-gradient-to-br from-[#FFFAFB] to-[#F8F0F2] p-4">
                <p className="text-[12px] md:text-[14px] font-semibold text-[#A45C70]">Packaging Options</p>
                <p className="mt-2 text-xl md:text-2xl font-semibold text-[#33252A]">{packagingGroups.length}</p>
                <p className="mt-1 text-xs text-slate-500">Unique packaging types</p>
              </div>
              <div className="rounded-xl border border-[#EBD6DC] bg-[#FFFAFB] p-4 sm:col-span-2">
                <p className="text-[12px] md:text-[14px] font-semibold text-[#A45C70]">
                  {pricing.min === null ? "Pricing" : pricing.min === pricing.max ? "Product Price" : "Price Range"}
                </p>
                <p className="mt-1 text-xl md:text-2xl font-semibold tracking-tight text-[#33252A]">
                  {pricing.min === null ? "Not configured" : pricing.min === pricing.max ? formatPrice(pricing.min) : `${formatPrice(pricing.min)} – ${formatPrice(pricing.max!)}`}
                </p>
                <p className="mt-1 text-xs text-[#967D84]">Based on configured variant prices</p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#F0DDE1] bg-white p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F9E9ED] text-[#B5697A]"><Info size={18} /></div>
              <div>
                <p className="text-sm font-bold text-gray-700">Product visibility</p>
                <p className="mt-0 text-[12px] md:text-[13px] leading-relaxed text-slate-500">
                  {product.isActive ? "This product is marked active in the database." : "This product is marked inactive in the database."}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Variants & Pricing */}
        <SectionCard title="Variants & Pricing" description="Configured quantities, packaging types and prices for this product." icon={<Package size={20} />}>
          {sortedVariants.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sortedVariants.map((variant) => (
                <article key={variant.id} className="group rounded-xl border border-[#F0DDE1] bg-white p-4">
                  <h3 className="mt-0 text-md md:text-lg font-semibold text-gray-700">{getQuantityLabel(variant)}</h3>
                  <p className="mt-1 text-[12px] md:text-[13px] text-slate-500">{getPackagingLabel(variant.packaging)}</p>
                  <div className="mt-2 flex items-end justify-between gap-3 border-t border-[#F5E7EA] pt-4">
                    <span className="text-xs text-slate-600">Variant Price</span>
                    <span className="text-lg md:text-xl font-semibold text-[#B5697A]">{formatPrice(variant.price)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#E4C6CE] bg-[#FFFAFB] px-5 py-10 text-center">
              <Package size={32} className="mx-auto text-[#C69AA5]" />
              <p className="mt-3 font-semibold text-gray-700">No variants configured</p>
              <p className="mt-1 text-sm text-[#967D84]">No pricing variants are available for this product.</p>
            </div>
          )}
        </SectionCard>

        {/* Packaging Options */}
        <SectionCard title="Packaging Options" description="Images configured for each packaging type." icon={<ShoppingBag size={20} />}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { title: "Regular Packaging", images: product.regularImages ?? [], fallbackImage: product.image },
              { title: "Glass Jar", images: [product.glassJarImage ?? "", ...(product.glassJarImages ?? [])].filter(Boolean), fallbackImage: "" },
              { title: "Cardboard Box", images: [product.cardboardBoxImage ?? "", ...(product.cardboardBoxImages ?? [])].filter(Boolean), fallbackImage: "" },
            ].map((group) => {
              const pkgImages = [...new Set(group.images.filter((img): img is string => typeof img === "string" && img.trim().length > 0))];
              const preview = pkgImages[0] || group.fallbackImage;
              return (
                <div key={group.title} className="overflow-hidden rounded-xl border border-[#F0DDE1] bg-white transition">
                  <div className="flex h-40 items-center justify-center bg-white p-4">
                    {preview ? (
                      <img src={preview} alt={group.title} loading="lazy" className="h-full w-full object-contain" />
                    ) : (
                      <div className="text-center text-[#C69AA5]">
                        <ImageIcon size={30} className="mx-auto" />
                        <p className="mt-2 text-xs">No image available</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-[12px] md:text-[14px] font-semibold text-gray-700">{group.title}</h3>
                    <p className="mt-0.5 text-[11px] md:text-[12px] text-slate-500">
                      {pkgImages.length ? `${pkgImages.length} image${pkgImages.length === 1 ? "" : "s"} configured` : preview ? "Using the main product image" : "No packaging image configured"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Product Information */}
        <SectionCard title="Product Information" description="Ingredients, product benefits and important customer information." icon={<Leaf size={20} />}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoItem label="Ingredients" value={product.ingredients} />
            <InfoItem label="Allergen Information" value={product.allergenInfo} />
            <InfoItem label="Benefits" value={product.benefits} />
            <InfoItem label="Usage Suggestions" value={product.usageSuggestions} />
          </div>
          <div className="mt-4 rounded-xl border border-[#EBD6DC] bg-[#FFF8F9] p-4">
            <p className="text-xs md:text-sm text-[#8D4C5E]">Medical Disclaimer</p>
            <p className="mt-1 whitespace-pre-line text-[11px] md:text-[12px] leading-relaxed text-slate-500">
              {cleanText(product.medicalDisclaimer) || "No medical disclaimer provided."}
            </p>
          </div>
        </SectionCard>

        {/* Storage & Shelf Life */}
        <SectionCard title="Storage & Shelf Life" description="Product storage guidance and shelf-life information." icon={<Package size={20} />}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoItem label="Storage Instructions" value={product.storageInstructions} />
            <InfoItem label="Shelf Life" value={product.shelfLife} />
          </div>
        </SectionCard>

        {/* Record Information */}
        <SectionCard title="Record Information" description="Creation and last-update timestamps from the database." icon={<CalendarDays size={20} />}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#F0DDE1] bg-[#FFFBFC] p-4">
              <p className="flex items-center gap-2 text-[12px] md:text-[13px] text-[#9A6B78]"><CalendarDays size={15} /> Created On</p>
              <p className="mt-2 font-semibold text-gray-700">{formatDate(product.createdAt)}</p>
              <p className="mt-1 text-xs text-slate-500">{formatDateTime(product.createdAt)}</p>
            </div>
            <div className="rounded-xl border border-[#F0DDE1] bg-[#FFFBFC] p-4">
              <p className="flex items-center gap-2 text-[12px] md:text-[13px] text-[#9A6B78]"><Clock3 size={15} /> Last Updated</p>
              <p className="mt-2 font-semibold text-gray-700">{formatDate(product.updatedAt)}</p>
              <p className="mt-1 text-xs text-slate-500">{formatDateTime(product.updatedAt)}</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}