
import {
  X,
  Users,
  UserRound,
  Percent,
  IndianRupee,
  CalendarDays,
  Loader2,
  CheckCircle2,
  Search,
  Package,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import toast from "react-hot-toast";

import {
  createOffer,
  updateOffer,
  type CreateOfferPayload,
  type DiscountType,
  type Offer,
  type OfferAudience,
} from "../../../api/offerApi";

import {
  getProducts,
  type Product,
} from "../../../api/productApi";

// ============================================================
// TYPES
// ============================================================

interface CreateOfferModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  offer?: Offer | null;
}

type ProductSelectionMode = "ALL" | "SELECTED";

// ============================================================
// HELPERS
// ============================================================

const toDateTimeLocal = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
};

const getDefaultStartDate = () => toDateTimeLocal(new Date());

const formatDateTimeLocal = (
  value: string | null | undefined
) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return toDateTimeLocal(date);
};

const formatPrice = (price: number) =>
  `₹${Number(price).toLocaleString("en-IN")}`;

// ============================================================
// SHARED CLASSES
// ============================================================

const INPUT_CLASS =
  "w-full rounded-lg border border-[#E8DED3] bg-white px-4 py-2.5 text-[11px] md:text-[12px] text-slate-500 outline-none placeholder:text-slate-500 hover:border-[#D9C8BA] focus:border-[#B5697A] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60";

// ============================================================
// MAIN COMPONENT
// ============================================================

function CreateOfferModal({
  open,
  onClose,
  onCreated,
  offer,
}: CreateOfferModalProps) {
  const isEditMode = Boolean(offer);

  // ----------------------------------------------------------
  // FORM STATE
  // ----------------------------------------------------------

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [audience, setAudience] =
    useState<OfferAudience>("PUBLIC");

  const [customerPhone, setCustomerPhone] = useState("");

  const [discountType, setDiscountType] =
    useState<DiscountType>("PERCENTAGE");

  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [perCustomerLimit, setPerCustomerLimit] =
    useState("1");

  const [startsAt, setStartsAt] =
    useState(getDefaultStartDate());

  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------------
  // PRODUCT / VARIANT STATE
  // ----------------------------------------------------------

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const [selectionMode, setSelectionMode] =
    useState<ProductSelectionMode>("ALL");

  const [selectedVariantIds, setSelectedVariantIds] =
    useState<number[]>([]);

  const [productSearch, setProductSearch] = useState("");

  // ----------------------------------------------------------
  // FETCH PRODUCTS
  // ----------------------------------------------------------

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setProductsLoading(true);

        const result = await getProducts();

        if (!cancelled) {
          setProducts(
            Array.isArray(result) ? result : []
          );
        }
      } catch (error: any) {
        console.error("OFFER PRODUCTS ERROR:", error);

        if (!cancelled) {
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Unable to load products."
          );
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [open]);

  // ----------------------------------------------------------
  // POPULATE FORM ON OPEN
  // ----------------------------------------------------------

  useEffect(() => {
    if (!open) return;

    setLoading(false);
    setProductSearch("");

    if (offer) {
      setName(offer.name);
      setCode(offer.code);
      setAudience(offer.audience);
      setCustomerPhone(offer.customerPhone ?? "");

      setDiscountType(offer.discountType);
      setDiscountValue(String(offer.discountValue));

      setMinOrderValue(
        offer.minOrderValue != null
          ? String(offer.minOrderValue)
          : ""
      );

      setMaxDiscount(
        offer.maxDiscount != null
          ? String(offer.maxDiscount)
          : ""
      );

      setUsageLimit(
        offer.usageLimit != null
          ? String(offer.usageLimit)
          : ""
      );

      setPerCustomerLimit(
        offer.perCustomerLimit != null
          ? String(offer.perCustomerLimit)
          : "1"
      );

      setStartsAt(
        formatDateTimeLocal(offer.startsAt) ||
          getDefaultStartDate()
      );

      setExpiresAt(
        formatDateTimeLocal(offer.expiresAt)
      );

      setIsActive(offer.isActive);

      const existingVariantIds =
        offer.variantIds ??
        offer.offerVariants?.map(
          (item) => item.variantId
        ) ??
        [];

      if (existingVariantIds.length > 0) {
        setSelectionMode("SELECTED");
        setSelectedVariantIds(existingVariantIds);
      } else {
        // Existing offers without variant mappings
        // continue to apply to all products.
        setSelectionMode("ALL");
        setSelectedVariantIds([]);
      }

      return;
    }

    // CREATE MODE RESET

    setName("");
    setCode("");
    setAudience("PUBLIC");
    setCustomerPhone("");

    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setMinOrderValue("");
    setMaxDiscount("");
    setUsageLimit("");
    setPerCustomerLimit("1");

    setStartsAt(getDefaultStartDate());
    setExpiresAt("");
    setIsActive(true);

    setSelectionMode("ALL");
    setSelectedVariantIds([]);
  }, [open, offer]);

  // ----------------------------------------------------------
  // FILTER PRODUCTS
  // ----------------------------------------------------------

  const filteredProducts = useMemo(() => {
    const search = productSearch.trim().toLowerCase();

    if (!search) return products;

    return products
      .map((product) => {
        const productMatches =
          product.name.toLowerCase().includes(search);

        if (productMatches) return product;

        const matchingVariants =
          product.variants.filter((variant) => {
            const variantText = [
              variant.quantity,
              variant.unit,
              variant.packaging,
              variant.price,
            ]
              .join(" ")
              .toLowerCase();

            return variantText.includes(search);
          });

        if (matchingVariants.length > 0) {
          return {
            ...product,
            variants: matchingVariants,
          };
        }

        return null;
      })
      .filter((product): product is Product => product !== null);
  }, [products, productSearch]);

  // ----------------------------------------------------------
  // VARIANT COUNTS
  // ----------------------------------------------------------

  const allVariantIds = useMemo(
    () =>
      products.flatMap((product) =>
        product.variants.map((variant) => variant.id)
      ),
    [products]
  );

  const visibleVariantIds = useMemo(
    () =>
      filteredProducts.flatMap((product) =>
        product.variants.map((variant) => variant.id)
      ),
    [filteredProducts]
  );

  const selectedCount = selectedVariantIds.length;

  // ----------------------------------------------------------
  // SELECTION HANDLERS
  // ----------------------------------------------------------

  const handleSelectionMode = (
    mode: ProductSelectionMode
  ) => {
    setSelectionMode(mode);

    if (mode === "ALL") {
      setSelectedVariantIds([]);
    }
  };

  const toggleVariant = (variantId: number) => {
    setSelectionMode("SELECTED");

    setSelectedVariantIds((previous) =>
      previous.includes(variantId)
        ? previous.filter((id) => id !== variantId)
        : [...previous, variantId]
    );
  };

  const handleSelectAll = () => {
    setSelectionMode("SELECTED");

    setSelectedVariantIds((previous) =>
      Array.from(
        new Set([...previous, ...visibleVariantIds])
      )
    );
  };

  const handleClearSelection = () => {
    setSelectionMode("SELECTED");
    setSelectedVariantIds([]);
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  // ----------------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------------

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    // Basic validation

    if (!name.trim()) {
      return toast.error("Offer name is required.");
    }

    if (!code.trim()) {
      return toast.error("Offer code is required.");
    }

    if (
      audience === "SPECIFIC_CUSTOMER" &&
      !customerPhone.trim()
    ) {
      return toast.error(
        "Customer phone number is required."
      );
    }

    // Discount validation

    const numericDiscount = Number(discountValue);

    if (
      !Number.isInteger(numericDiscount) ||
      numericDiscount <= 0
    ) {
      return toast.error(
        "Enter a valid discount value."
      );
    }

    if (
      discountType === "PERCENTAGE" &&
      numericDiscount > 100
    ) {
      return toast.error(
        "Percentage discount cannot exceed 100%."
      );
    }

    // Optional number validation

    if (
      minOrderValue &&
      (
        !Number.isInteger(Number(minOrderValue)) ||
        Number(minOrderValue) < 0
      )
    ) {
      return toast.error(
        "Enter a valid minimum order value."
      );
    }

    if (
      discountType === "PERCENTAGE" &&
      maxDiscount &&
      (
        !Number.isInteger(Number(maxDiscount)) ||
        Number(maxDiscount) <= 0
      )
    ) {
      return toast.error(
        "Enter a valid maximum discount."
      );
    }

    if (
      usageLimit &&
      (
        !Number.isInteger(Number(usageLimit)) ||
        Number(usageLimit) <= 0
      )
    ) {
      return toast.error(
        "Enter a valid usage limit."
      );
    }

    if (
      !perCustomerLimit ||
      !Number.isInteger(Number(perCustomerLimit)) ||
      Number(perCustomerLimit) <= 0
    ) {
      return toast.error(
        "Enter a valid per-customer limit."
      );
    }

    // Variant validation

    if (
      selectionMode === "SELECTED" &&
      selectedVariantIds.length === 0
    ) {
      return toast.error(
        "Please select at least one product variant."
      );
    }

    if (
      selectionMode === "SELECTED" &&
      allVariantIds.length > 0 &&
      selectedVariantIds.some(
        (id) => !allVariantIds.includes(id)
      )
    ) {
      return toast.error(
        "Some selected variants are no longer available. Please refresh your selection."
      );
    }

    // Date validation

    if (!startsAt) {
      return toast.error("Start date is required.");
    }

    const parsedStart = new Date(startsAt);

    if (Number.isNaN(parsedStart.getTime())) {
      return toast.error("Enter a valid start date.");
    }

    let parsedExpiry: Date | null = null;

    if (expiresAt) {
      parsedExpiry = new Date(expiresAt);

      if (Number.isNaN(parsedExpiry.getTime())) {
        return toast.error("Enter a valid expiry date.");
      }

      if (
        parsedExpiry.getTime() <= parsedStart.getTime()
      ) {
        return toast.error(
          "Expiry date must be after the start date."
        );
      }
    }

    // Build payload

    const payload: CreateOfferPayload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),

      audience,

      customerPhone:
        audience === "SPECIFIC_CUSTOMER"
          ? customerPhone.trim()
          : null,

      discountType,
      discountValue: numericDiscount,

      minOrderValue: minOrderValue
        ? Number(minOrderValue)
        : null,

      maxDiscount:
        discountType === "PERCENTAGE" && maxDiscount
          ? Number(maxDiscount)
          : null,

      usageLimit: usageLimit
        ? Number(usageLimit)
        : null,

      perCustomerLimit: Number(perCustomerLimit),

      startsAt: parsedStart.toISOString(),

      expiresAt: parsedExpiry
        ? parsedExpiry.toISOString()
        : null,

      isActive,

      // Empty array = all products.
      // Non-empty array = selected variants only.
      variantIds:
        selectionMode === "ALL"
          ? []
          : selectedVariantIds,
    };

    // API request

    try {
      setLoading(true);

      if (offer) {
        await updateOffer(offer.id, payload);

        toast.success("Offer updated successfully.");
      } else {
        await createOffer(payload);

        toast.success("Offer created successfully.");
      }

      onCreated();
      onClose();
    } catch (err: any) {
      console.error("SAVE OFFER ERROR:", err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          (offer
            ? "Unable to update offer."
            : "Unable to create offer.")
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // MODAL VISIBILITY
  // ----------------------------------------------------------

  if (!open) return null;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1F2937]/45 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#EFE3D2] bg-white shadow-sm sm:rounded-3xl">

        {/* HEADER */}

        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#EFE3D2] bg-white px-5 py-5 sm:px-7 sm:py-6">
          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-gray-600 sm:text-[16px]">
              {isEditMode ? "Edit Offer" : "Create Offer"}
            </h2>

            <p className="mt-0 text-[11px] leading-relaxed text-gray-500 md:text-[12px]">
              {isEditMode
                ? "Update offer details, product selection and settings."
                : "Create a public or customer-specific offer."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close offer modal"
            title="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBECEF] text-[#A99B90] hover:text-[#B5697A] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="min-h-0 overflow-y-auto"
        >
          <div className="space-y-5 p-5 sm:p-7">

            {/* AUDIENCE */}

            <div className="grid gap-3 sm:grid-cols-2">
              <AudienceButton
                icon={
                  <Users
                    className="h-5 w-5"
                    strokeWidth={1.8}
                  />
                }
                title="Public Offer"
                subtitle="Available to eligible customers"
                isActive={audience === "PUBLIC"}
                onClick={() => setAudience("PUBLIC")}
                disabled={loading}
              />

              <AudienceButton
                icon={
                  <UserRound
                    className="h-5 w-5"
                    strokeWidth={1.8}
                  />
                }
                title="Specific Customer"
                subtitle="Assign by phone number"
                isActive={
                  audience === "SPECIFIC_CUSTOMER"
                }
                onClick={() =>
                  setAudience("SPECIFIC_CUSTOMER")
                }
                disabled={loading}
              />
            </div>

            {/* BASIC DETAILS */}

            <div>

              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field
                  value={name}
                  onChange={setName}
                  placeholder="Enter offer name"
                  disabled={loading}
                />

                <Field
                  value={code}
                  onChange={(value) =>
                    setCode(
                      value.toUpperCase().replace(/\s/g, "")
                    )
                  }
                  placeholder="Enter offer code"
                  disabled={loading}
                />

                {audience === "SPECIFIC_CUSTOMER" && (
                  <div className="sm:col-span-2">
                    <Field
                      value={customerPhone}
                      onChange={setCustomerPhone}
                      placeholder="Enter customer phone number"
                      type="tel"
                      disabled={loading}
                    />

                    <p className="mt-1.5 text-[11px] leading-5 text-[#A99B90]">
                      The offer will be linked to this phone
                      number, even if the customer creates an
                      account later.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCT & VARIANT SELECTION */}

            <div className="rounded-xl border border-[#EFE3D2] bg-[#fffbfc] p-4 sm:p-5">

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">

                    <h3 className="text-[13px] font-medium text-gray-700">
                      Products & Variants
                    </h3>
                  </div>

                  <p className="mt-0 text-[11px] leading-relaxed text-slate-500">
                    Choose which products are eligible for
                    this offer.
                  </p>
                </div>

                <span className="rounded-full bg-[#FBECEF] px-3 py-1 text-[10px] text-[#A85F70]">
                  {products.length} Products
                </span>
              </div>

              {/* MODE SELECTION */}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleSelectionMode("ALL")
                  }
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    selectionMode === "ALL"
                      ? "border-[#B5697A] bg-white shadow-sm"
                      : "border-[#EFE3D2] bg-white hover:border-[#D9B8C1]"
                  }`}
                >
                  <p
                    className={`text-[12px] font-medium ${
                      selectionMode === "ALL"
                        ? "text-[#A85F70]"
                        : "text-gray-600"
                    }`}
                  >
                    All Products
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Apply discount to every product
                  </p>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleSelectionMode("SELECTED")
                  }
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    selectionMode === "SELECTED"
                      ? "border-[#B5697A] bg-white shadow-sm"
                      : "border-[#EFE3D2] bg-white hover:border-[#D9B8C1]"
                  }`}
                >
                  <p
                    className={`text-[12px] font-medium ${
                      selectionMode === "SELECTED"
                        ? "text-[#A85F70]"
                        : "text-gray-600"
                    }`}
                  >
                    Selected Variants
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Choose specific product variants
                  </p>
                </button>
              </div>

              {selectionMode === "SELECTED" && (
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-[11px] text-[#A85F70]">
                    {selectedCount} variants selected
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={
                        loading ||
                        productsLoading ||
                        visibleVariantIds.length === 0
                      }
                      onClick={handleSelectAll}
                      className="text-[11px] text-[#A85F70] hover:underline disabled:opacity-50"
                    >
                      Select All
                    </button>

                    <button
                      type="button"
                      disabled={
                        loading || selectedCount === 0
                      }
                      onClick={handleClearSelection}
                      className="text-[11px] text-slate-500 hover:text-red-500 disabled:opacity-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* SEARCH */}

              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A99B90]" />

                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) =>
                    setProductSearch(e.target.value)
                  }
                  placeholder="Search product, quantity or packaging..."
                  disabled={loading || productsLoading}
                  className="h-10 w-full rounded-lg border border-[#E8DED3] bg-white pl-9 pr-4 text-[11px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-[#B5697A] disabled:opacity-60"
                />
              </div>

              {/* PRODUCT LIST */}

              <div className="mt-3 max-h-[320px] space-y-3 overflow-y-auto pr-1">

                {productsLoading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-[#B5697A]" />

                    <p className="text-[11px] text-slate-500">
                      Loading products and variants...
                    </p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-10 text-center">
                    <Package className="mx-auto h-7 w-7 text-[#C9B9AC]" />

                    <p className="mt-2 text-[12px] text-slate-500">
                      No products available.
                    </p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-10 text-center">
                    <Search className="mx-auto h-6 w-6 text-[#C9B9AC]" />

                    <p className="mt-2 text-[12px] text-slate-500">
                      No matching products found.
                    </p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="overflow-hidden rounded-xl border border-[#EFE3D2] bg-white"
                    >
                      {/* PRODUCT HEADER */}

                      <div className="flex items-center justify-between gap-3 border-b border-[#F1E9E1] px-3 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FBECEF]">
                            <Package className="h-4 w-4 text-[#B5697A]" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-medium text-gray-700">
                              {product.name}
                            </p>

                            <p className="text-[10px] text-slate-400">
                              {product.variants.length} variants
                            </p>
                          </div>
                        </div>

                        {selectionMode === "SELECTED" && (
                          <span className="shrink-0 text-[10px] text-slate-400">
                            {
                              product.variants.filter((variant) =>
                                selectedVariantIds.includes(
                                  variant.id
                                )
                              ).length
                            }{" "}
                            selected
                          </span>
                        )}
                      </div>

                      {/* VARIANTS */}

                      {product.variants.length === 0 ? (
                        <p className="px-3 py-4 text-[11px] text-slate-400">
                          No variants available.
                        </p>
                      ) : (
                        <div className="divide-y divide-[#F5EEE7]">
                          {product.variants.map((variant) => {
                            const isSelected =
                              selectedVariantIds.includes(
                                variant.id
                              );

                            return (
                              <label
                                key={variant.id}
                                className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-3 transition ${
                                  selectionMode === "SELECTED" &&
                                  isSelected
                                    ? "bg-[#FDF4F6]"
                                    : "hover:bg-[#FFFCF9]"
                                } ${
                                  loading
                                    ? "cursor-not-allowed opacity-60"
                                    : ""
                                }`}
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectionMode === "ALL" ||
                                      isSelected
                                    }
                                    disabled={
                                      loading ||
                                      selectionMode === "ALL"
                                    }
                                    onChange={() =>
                                      toggleVariant(variant.id)
                                    }
                                    className="h-4 w-4 shrink-0 cursor-pointer accent-[#B5697A]"
                                  />

                                  <div className="min-w-0">
                                    <p className="text-[11px] font-medium text-gray-700">
                                      {variant.quantity}{" "}
                                      {variant.unit}
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                      {variant.packaging}
                                    </p>
                                  </div>
                                </div>

                                <div className="shrink-0 text-right">
                                  <p className="text-[12px] font-medium text-gray-700">
                                    {formatPrice(variant.price)}
                                  </p>

                                  {selectionMode === "ALL" && (
                                    <span className="text-[9px] text-[#A85F70]">
                                      Included
                                    </span>
                                  )}

                                  {selectionMode === "SELECTED" &&
                                    isSelected && (
                                      <span className="text-[9px] text-[#A85F70]">
                                        Selected
                                      </span>
                                    )}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* SELECTION SUMMARY */}

              <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#B5697A]" />

                  <p className="text-[11px] text-slate-600">
                    {selectionMode === "ALL"
                      ? "All products are eligible"
                      : `${selectedCount} variants selected`}
                  </p>
                </div>

                <span className="text-[10px] text-slate-400">
                  {selectionMode === "ALL"
                    ? `${allVariantIds.length} variants`
                    : `of ${allVariantIds.length}`}
                </span>
              </div>
            </div>

            {/* DISCOUNT SETTINGS */}

            <div>

              <div className="mt-2 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[12px] text-slate-500">
                    Discount Type
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <DiscountTypeButton
                      icon={
                        <Percent
                          className="h-4 w-4"
                          strokeWidth={1.8}
                        />
                      }
                      label="Percentage"
                      isActive={
                        discountType === "PERCENTAGE"
                      }
                      onClick={() =>
                        setDiscountType("PERCENTAGE")
                      }
                      disabled={loading}
                    />

                    <DiscountTypeButton
                      icon={
                        <IndianRupee
                          className="h-4 w-4"
                          strokeWidth={1.8}
                        />
                      }
                      label="Fixed"
                      isActive={discountType === "FIXED"}
                      onClick={() =>
                        setDiscountType("FIXED")
                      }
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[12px] text-slate-500">
                    {discountType === "PERCENTAGE"
                      ? "Discount Percentage"
                      : "Discount Amount"}
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={discountValue}
                    onChange={(e) =>
                      setDiscountValue(e.target.value)
                    }
                    placeholder={
                      discountType === "PERCENTAGE"
                        ? "Enter percentage"
                        : "Enter amount"
                    }
                    disabled={loading}
                    className="h-[42px] w-full rounded-xl border border-[#E8DED3] bg-white px-4 text-[12px] text-slate-500 outline-none placeholder:text-slate-500 hover:border-[#D9C8BA] focus:border-[#B5697A] disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* CONDITIONS */}

            <div>
              <SectionLabel>Offer Conditions</SectionLabel>

              <div className="mt-1 grid gap-4 sm:grid-cols-2">
                <Field
                  value={minOrderValue}
                  onChange={setMinOrderValue}
                  placeholder="Minimum order value"
                  type="number"
                  min="0"
                  disabled={loading}
                />

                {discountType === "PERCENTAGE" && (
                  <Field
                    value={maxDiscount}
                    onChange={setMaxDiscount}
                    placeholder="Maximum Discount"
                    type="number"
                    min="1"
                    disabled={loading}
                  />
                )}

                <Field
                  label="Overall Usage Limit"
                  value={usageLimit}
                  onChange={setUsageLimit}
                  placeholder="Unlimited"
                  type="number"
                  min="1"
                  disabled={loading}
                />

                <Field
                  label="Per Customer Limit"
                  value={perCustomerLimit}
                  onChange={setPerCustomerLimit}
                  placeholder="1"
                  type="number"
                  min="1"
                  disabled={loading}
                />
              </div>
            </div>

            {/* DATES */}

            <div>
              <SectionLabel>Offer Validity</SectionLabel>

              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <DateField
                  label="Starts At"
                  value={startsAt}
                  onChange={setStartsAt}
                  disabled={loading}
                />

                <DateField
                  label="Expires At"
                  value={expiresAt}
                  onChange={setExpiresAt}
                  disabled={loading}
                />
              </div>
            </div>

            {/* ACTIVE TOGGLE */}

            <label
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#EFE3D2] bg-white p-3 transition-colors hover:border-[#D9B8C1] ${
                loading
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
            >
              <div>
                <p className="text-[13px] text-slate-500">
                  Activate offer
                </p>

                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  Customers can use the offer when it is active.
                </p>
              </div>

              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) =>
                  setIsActive(e.target.checked)
                }
                disabled={loading}
                className="h-5 w-5 shrink-0 cursor-pointer accent-[#B5697A]"
              />
            </label>
          </div>

          {/* FOOTER */}

          <div className="sticky bottom-0 grid shrink-0 grid-cols-2 gap-3 border-t border-[#EFE3D2] bg-white px-5 py-4 sm:px-7">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl border border-[#E8DED3] bg-white px-5 py-2.5 text-[14px] text-slate-500 hover:border-[#D9B8C1] hover:bg-[#FDF4F6] hover:text-[#A85F70] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || productsLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B5697A] px-5 py-2.5 text-[14px] text-white shadow-sm transition-all duration-200 hover:bg-[#A85F70] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditMode
                    ? "Updating..."
                    : "Creating..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {isEditMode
                    ? "Update Offer"
                    : "Create Offer"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// SUB COMPONENTS
// ============================================================

interface AudienceButtonProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}

function AudienceButton({
  icon,
  title,
  subtitle,
  isActive,
  onClick,
  disabled,
}: AudienceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border p-4 text-left focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
        isActive
          ? "border-[#B5697A] bg-[#FDF4F6] shadow-sm"
          : "border-[#EFE3D2] bg-white hover:bg-[#FFFCF8]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isActive
              ? "bg-[#B5697A] text-white"
              : "bg-[#FBECEF] text-[#B5697A]"
          }`}
        >
          {icon}
        </div>

        <div>
          <p className="text-[12px] text-gray-700 md:text-[13px]">
            {title}
          </p>

          <p className="mt-0 text-[11px] leading-relaxed text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>
    </button>
  );
}

interface DiscountTypeButtonProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}

function DiscountTypeButton({
  icon,
  label,
  isActive,
  onClick,
  disabled,
}: DiscountTypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[42px] items-center justify-center gap-2 rounded-xl border px-3 text-[12px] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
        isActive
          ? "border-[#B5697A] bg-[#FBECEF] text-[#A85F70]"
          : "border-[#EFE3D2] bg-white text-[#8B7A6C] hover:border-[#D9B8C1]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

interface SectionLabelProps {
  children: ReactNode;
}

function SectionLabel({ children }: SectionLabelProps) {
  return (
    <label className="mb-0 block text-[11px] font-[350] tracking-[-0.01em] text-gray-600 md:text-[12px]">
      {children}
    </label>
  );
}

interface FieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  disabled?: boolean;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  disabled = false,
}: FieldProps) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-[12px] text-slate-500">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        min={min}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
    </div>
  );
}

interface DateFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function DateField({
  label,
  value,
  onChange,
  disabled = false,
}: DateFieldProps) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-[12px] text-slate-500">
        <CalendarDays
          className="h-3.5 w-3.5 text-[#B5697A]"
          strokeWidth={1.8}
        />
        {label}
      </label>

      <input
        type="datetime-local"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLASS}
      />
    </div>
  );
}

export default CreateOfferModal;
