
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import toast from "react-hot-toast";

import {
  X,
  Plus,
  Trash2,
  Upload,
  LoaderCircle,
  Package,
} from "lucide-react";

import {
  createAdminProduct,
  updateAdminProduct,
  type AdminProductImageFiles,
  type AdminProductInput,
  type AdminProductVariantInput,
} from "../../../api/adminProductsApi";

import type { AdminProduct, ProductVariant } from "./types";

// ─── Props ─────────────────────────────────────────────────

interface ProductFormModalProps {
  isOpen: boolean;
  product: AdminProduct | null;
  onClose: () => void;
  onSaved: (product: AdminProduct) => void;
}

// ─── Form Types ────────────────────────────────────────────

interface ProductFormState {
  name: string;
  description: string;
  ingredients: string;
  allergenInfo: string;
  medicalDisclaimer: string;
  benefits: string;
  usageSuggestions: string;
  storageInstructions: string;
  shelfLife: string;
  image: string;
  regularImages: string[];
  glassJarImage: string | null;
  glassJarImages: string[];
  cardboardBoxImage: string | null;
  cardboardBoxImages: string[];
  variants: AdminProductVariantInput[];
  isActive: boolean;
}

type GalleryField =
  | "regularImages"
  | "cardboardBoxImages";

type VariantWithImage = ProductVariant & {
  image?: string | null;
};

// ─── Constants ─────────────────────────────────────────────

const EMPTY_FORM: ProductFormState = {
  name: "",
  description: "",
  ingredients: "",
  allergenInfo: "",
  medicalDisclaimer: "",
  benefits: "",
  usageSuggestions: "",
  storageInstructions: "",
  shelfLife: "",
  image: "",
  regularImages: [],
  glassJarImage: null,
  glassJarImages: [],
  cardboardBoxImage: null,
  cardboardBoxImages: [],
  variants: [
    {
      quantity: 250,
      unit: "g",
      packaging: "Plastic Box",
      price: 0,
      image: null,
    },
  ],
  isActive: true,
};

const PACKAGING_OPTIONS = [
  "Plastic Box",
  "Glass Jar",
  "Cardboard Box",
];

const UNIT_OPTIONS = ["g", "kg", "ml", "l"];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#EADDE0] bg-white px-3.5 py-2.5 text-[12px] md:text-[13px] text-slate-600 outline-none transition placeholder:text-slate-500 focus:border-[#B5697A] disabled:cursor-not-allowed disabled:bg-slate-50";

const labelClass = "block text-[12px] md:text-[13px] text-slate-700";

const sectionClass =
  "rounded-xl border border-[#F0DDE1] bg-white p-4 sm:p-5";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

// ─── Helpers ──────────────────────────────────────────────

const textValue = (value?: string | null) => value ?? "";

const uniqueImages = (values: string[]) =>
  Array.from(
    new Set(
      values.filter(
        (value) =>
          typeof value === "string" && value.trim().length > 0
      )
    )
  );

const getVariantImageKey = (
  variant: AdminProductVariantInput,
  index: number
) => String(variant.id ?? index);

// ─── Create Form State ────────────────────────────────────

function createFormFromProduct(
  product: AdminProduct | null
): ProductFormState {
  if (!product) {
    return {
      ...EMPTY_FORM,
      variants: EMPTY_FORM.variants.map((variant) => ({
        ...variant,
      })),
    };
  }

  return {
    name: product.name ?? "",
    description: product.description ?? "",
    ingredients: textValue(product.ingredients),
    allergenInfo: textValue(product.allergenInfo),
    medicalDisclaimer: textValue(product.medicalDisclaimer),
    benefits: textValue(product.benefits),
    usageSuggestions: textValue(product.usageSuggestions),
    storageInstructions: textValue(product.storageInstructions),
    shelfLife: textValue(product.shelfLife),

    image:
      uniqueImages(product.regularImages ?? [])[0] ??
      product.image ??
      "",

    regularImages: uniqueImages(
      product.regularImages?.length
        ? product.regularImages
        : product.image
          ? [product.image]
          : []
    ),

    glassJarImage:
      product.glassJarImage ?? null,

    glassJarImages: [],

    cardboardBoxImage:
      uniqueImages(product.cardboardBoxImages ?? [])[0] ??
      product.cardboardBoxImage ??
      null,

    cardboardBoxImages: uniqueImages(
      product.cardboardBoxImages?.length
        ? product.cardboardBoxImages
        : product.cardboardBoxImage
          ? [product.cardboardBoxImage]
          : []
    ),

    variants: (product.variants ?? []).map(
      (variant: ProductVariant) => {
        const variantWithImage = variant as VariantWithImage;

        return {
          id: variant.id,
          quantity: variant.quantity,
          unit: variant.unit,
          packaging: variant.packaging,
          price: variant.price,
          image: variantWithImage.image ?? null,
        };
      }
    ),

    isActive: product.isActive,
  };
}

// ─── Saved Image Gallery ──────────────────────────────────

function ImageUrlList({
  title,
  images,
  onRemove,
}: {
  title: string;
  images: string[];
  onRemove: (image: string) => void;
}) {
  if (images.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="mb-2 text-xs font-medium text-slate-500">
        {title} · {images.length}
      </p>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="relative overflow-hidden rounded-xl border border-[#EADDE0] bg-white"
          >
            <img
              src={image}
              alt={`${title} ${index + 1}`}
              className="h-24 w-full object-contain p-2"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.visibility = "hidden";
              }}
            />

            <button
              type="button"
              onClick={() => onRemove(image)}
              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600 shadow-sm transition hover:bg-red-50"
              aria-label={`Remove image ${index + 1}`}
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── File Picker ──────────────────────────────────────────

function FilePicker({
  label,
  multiple = false,
  accept = "image/jpeg,image/png,image/webp",
  onChange,
  disabled,
  hint,
}: {
  label: string;
  multiple?: boolean;
  accept?: string;
  onChange: (files: File[]) => void;
  disabled: boolean;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    onChange(selectedFiles);

    event.target.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        className="hidden"
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#DDBDC5] bg-[#FFFAFB] px-3 py-3 text-sm font-medium text-[#9B596B] transition hover:bg-[#FFF1F4] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Upload size={16} />
        {label}
      </button>

      {hint && (
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────

function ProductFormModal({
  isOpen,
  product,
  onClose,
  onSaved,
}: ProductFormModalProps) {
  const isEditMode = product !== null;

  const [form, setForm] = useState<ProductFormState>(() =>
    createFormFromProduct(product)
  );

  const [files, setFiles] = useState<AdminProductImageFiles>({});

  const [saving, setSaving] = useState(false);

  // Reset form when opening or switching products.
  useEffect(() => {
    if (!isOpen) return;

    setForm(createFormFromProduct(product));
    setFiles({});
  }, [isOpen, product]);

  // Escape key closes the modal.
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  // ─── Form Updates ───────────────────────────────────────

  const updateField = <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateVariant = (
    index: number,
    field: keyof AdminProductVariantInput,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) => {
        if (variantIndex !== index) return variant;

        if (field === "quantity" || field === "price") {
          return {
            ...variant,
            [field]: value === "" ? 0 : Number(value),
          };
        }

        return {
          ...variant,
          [field]: value,
        };
      }),
    }));
  };

  const addVariant = () => {
    setForm((current) => ({
      ...current,
      variants: [
        ...current.variants,
        {
          quantity: 250,
          unit: "g",
          packaging: "Plastic Box",
          price: 0,
          image: null,
        },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    const variant = form.variants[index];

    if (!variant) return;

    const key = getVariantImageKey(variant, index);

    setFiles((current) => {
      const nextVariantImages = {
        ...current.variantImages,
      };

      delete nextVariantImages[key];

      return {
        ...current,
        variantImages: nextVariantImages,
      };
    });

    setForm((current) => ({
      ...current,
      variants: current.variants.filter(
        (_, variantIndex) => variantIndex !== index
      ),
    }));
  };

  // ─── Gallery Image Handling ────────────────────────────

  const addImageFiles = (
    field: GalleryField,
    selectedFiles: File[]
  ) => {
    const invalidType = selectedFiles.find(
      (file) => !ALLOWED_IMAGE_TYPES.includes(file.type)
    );

    if (invalidType) {
      toast.error("Images must be JPEG, PNG or WebP files.");
      return;
    }

    const tooBig = selectedFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE
    );

    if (tooBig) {
      toast.error("Each image must be 5 MB or smaller.");
      return;
    }

    setFiles((current) => {
      const existing = current[field] ?? [];

      const signature = (file: File) =>
        `${file.name.toLowerCase()}|${file.size}|${file.lastModified}|${file.type}`;

      const seen = new Set(existing.map(signature));

      const uniqueNewFiles = selectedFiles.filter((file) => {
        const key = signature(file);

        if (seen.has(key)) return false;

        seen.add(key);
        return true;
      });

      return {
        ...current,
        [field]: [...existing, ...uniqueNewFiles],
      };
    });
  };

  const removeNewImageFile = (
    field: GalleryField,
    index: number
  ) => {
    setFiles((current) => ({
      ...current,
      [field]: (current[field] ?? []).filter(
        (_, fileIndex) => fileIndex !== index
      ),
    }));
  };

  // ─── Variant Image Handling ───────────────────────────

  const addVariantImage = (
    variant: AdminProductVariantInput,
    index: number,
    selectedFiles: File[]
  ) => {
    const file = selectedFiles[0];

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Variant image must be JPEG, PNG or WebP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Variant image must be 5 MB or smaller.");
      return;
    }

    const key = getVariantImageKey(variant, index);

    setFiles((current) => ({
      ...current,
      variantImages: {
        ...current.variantImages,
        [key]: file,
      },
    }));
  };

  const removeVariantImage = (
    variant: AdminProductVariantInput,
    index: number
  ) => {
    const key = getVariantImageKey(variant, index);

    setFiles((current) => {
      const nextVariantImages = {
        ...current.variantImages,
      };

      delete nextVariantImages[key];

      return {
        ...current,
        variantImages: nextVariantImages,
      };
    });
  };

  // ─── Validation ────────────────────────────────────────

  const validateForm = (): string | null => {
    if (!form.name.trim()) {
      return "Please enter a product name.";
    }

    if (!form.description.trim()) {
      return "Please enter a product description.";
    }

    if (
      !form.image.trim() &&
      form.regularImages.length === 0 &&
      (files.regularImages ?? []).length === 0
    ) {
      return "Please add at least one image to the Regular Packaging gallery.";
    }

    if (form.variants.length === 0) {
      return "Please add at least one product variant.";
    }

    const combinations = new Set<string>();

    for (let index = 0; index < form.variants.length; index += 1) {
      const variant = form.variants[index];

      if (!Number.isFinite(variant.quantity) || variant.quantity <= 0) {
        return `Variant ${index + 1}: quantity must be greater than zero.`;
      }

      if (!variant.unit.trim()) {
        return `Variant ${index + 1}: please select a unit.`;
      }

      if (!variant.packaging.trim()) {
        return `Variant ${index + 1}: please select packaging.`;
      }

      if (!Number.isFinite(variant.price) || variant.price < 0) {
        return `Variant ${index + 1}: price cannot be negative.`;
      }

      if (variant.packaging === "Glass Jar") {
        const key = getVariantImageKey(variant, index);
        const hasExistingImage =
          typeof variant.image === "string" &&
          variant.image.trim().length > 0;

        const hasNewImage =
          files.variantImages?.[key] instanceof File;

        if (!hasExistingImage && !hasNewImage) {
          return `Variant ${index + 1}: please upload a Glass Jar image.`;
        }
      }

      const combination = [
        variant.quantity,
        variant.unit.trim().toLowerCase(),
        variant.packaging.trim().toLowerCase(),
      ].join("|");

      if (combinations.has(combination)) {
        return `Variant ${index + 1}: this quantity, unit and packaging combination already exists.`;
      }

      combinations.add(combination);
    }

    const galleryFiles = [
      ...(files.regularImages ?? []),
      ...(files.cardboardBoxImages ?? []),
    ];

    if (galleryFiles.some((file) => file.size > MAX_IMAGE_SIZE)) {
      return "Each image must be 5 MB or smaller.";
    }

    if (
      galleryFiles.some(
        (file) => !ALLOWED_IMAGE_TYPES.includes(file.type)
      )
    ) {
      return "Images must be JPEG, PNG or WebP files.";
    }

    if (galleryFiles.length > 15) {
      return "You can upload a maximum of 15 gallery images per request.";
    }

    const variantImageFiles = Object.values(
      files.variantImages ?? {}
    );

    if (
      variantImageFiles.some(
        (file) =>
          file.size > MAX_IMAGE_SIZE ||
          !ALLOWED_IMAGE_TYPES.includes(file.type)
      )
    ) {
      return "Each variant image must be JPEG, PNG or WebP and 5 MB or smaller.";
    }

    return null;
  };

  // ─── Submit ────────────────────────────────────────────

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(true);

    const loadingToast = toast.loading(
      isEditMode ? "Saving changes..." : "Creating product..."
    );

    try {
      const payload: AdminProductInput = {
        name: form.name.trim(),
        description: form.description.trim(),
        ingredients: form.ingredients.trim(),
        allergenInfo: form.allergenInfo.trim(),
        medicalDisclaimer: form.medicalDisclaimer.trim(),
        benefits: form.benefits.trim(),
        usageSuggestions: form.usageSuggestions.trim(),
        storageInstructions: form.storageInstructions.trim(),
        shelfLife: form.shelfLife.trim(),

        image: form.regularImages[0] ?? form.image,
        regularImages: uniqueImages(form.regularImages),

        // Glass Jar images are now stored per variant.
        // Do not submit or modify the legacy gallery here.
        glassJarImage: undefined,
        glassJarImages: undefined,

        cardboardBoxImage:
          form.cardboardBoxImages[0] ??
          form.cardboardBoxImage,

        cardboardBoxImages: uniqueImages(
          form.cardboardBoxImages
        ),

        variants: form.variants.map((variant) => ({
          ...variant,
          quantity: Number(variant.quantity),
          price: Number(variant.price),
          unit: variant.unit.trim(),
          packaging: variant.packaging.trim(),
          image: variant.image ?? null,
        })),

        isActive: form.isActive,
      };

      const variantImageUploads: Record<string, File> = {};

      form.variants.forEach((variant, index) => {
        if (variant.packaging !== "Glass Jar") return;

        const key = getVariantImageKey(variant, index);
        const file = files.variantImages?.[key];

        if (file instanceof File) {
          variantImageUploads[key] = file;
        }
      });

      const uploadFiles: AdminProductImageFiles = {
        ...(files.regularImages?.[0]
          ? { image: files.regularImages[0] }
          : {}),

        ...(files.regularImages?.length
          ? { regularImages: files.regularImages }
          : {}),

        ...(files.cardboardBoxImages?.[0]
          ? { cardboardBoxImage: files.cardboardBoxImages[0] }
          : {}),

        ...(files.cardboardBoxImages?.length
          ? { cardboardBoxImages: files.cardboardBoxImages }
          : {}),

        ...(Object.keys(variantImageUploads).length
          ? { variantImages: variantImageUploads }
          : {}),
      };

      const savedProduct = isEditMode
        ? await updateAdminProduct(product.id, payload, uploadFiles)
        : await createAdminProduct(payload, uploadFiles);

      toast.success(
        isEditMode
          ? "Product updated successfully."
          : "Product created successfully.",
        { id: loadingToast }
      );

      onSaved(savedProduct);
    } catch (submitError: unknown) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save product. Please try again.",
        { id: loadingToast }
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Gallery Section ───────────────────────────────────

  const renderGallerySection = (
    title: string,
    description: string,
    field: GalleryField,
    images: string[]
  ) => (
    <div className="rounded-xl border border-[#F0DDE1] p-4">
      <h3 className="text-[12px] md:text-[13px] font-semibold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 text-[9px] md:text-[10px] text-slate-500">
        {description}
      </p>

      <ImageUrlList
        title="Saved images"
        images={images}
        onRemove={(image) =>
          updateField(
            field,
            form[field].filter(
              (currentImage) => currentImage !== image
            )
          )
        }
      />

      {(files[field] ?? []).length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-slate-500">
            New uploads · {files[field]?.length}
          </p>

          {files[field]?.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-2 rounded-lg bg-[#FFFAFB] px-3 py-2 text-xs text-slate-600"
            >
              <span className="min-w-0 truncate">{file.name}</span>

              <button
                type="button"
                disabled={saving}
                onClick={() => removeNewImageFile(field, index)}
                className="shrink-0 text-red-600 hover:text-red-800"
                aria-label={`Remove ${file.name}`}
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2">
        <FilePicker
          label="Choose image files"
          multiple
          disabled={saving}
          onChange={(selectedFiles) =>
            addImageFiles(field, selectedFiles)
          }
          hint="JPEG, PNG or WebP. Maximum 5 MB per image."
        />
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        className="flex max-h-[95dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-[#FFFCFC] shadow-2xl sm:max-h-[92vh] sm:rounded-2xl"
      >
        {/* Modal Header */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#F0DDE1] bg-white px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <h2
                id="product-form-title"
                className="truncate text-lg font-semibold text-slate-800"
              >
                {isEditMode ? "Edit Product" : "Add New Product"}
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {isEditMode
                  ? `Update product #${product.id} and its details`
                  : "Add product details, images and pricing"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#EADDE0] text-slate-500 transition hover:bg-[#FFF1F4] hover:text-[#9B596B] disabled:opacity-50"
            aria-label="Close product form"
          >
            <X size={19} />
          </button>
        </header>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-5 p-4 sm:p-6">
            {/* Basic Information */}
            <section className={sectionClass}>
              <h3 className="mb-1 text-base font-semibold text-slate-800">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="e.g. Dry Fruit Sattu Laddoo"
                    maxLength={150}
                    required
                    disabled={saving}
                  />
                </label>

                <label className={labelClass}>
                  <select
                    className={inputClass}
                    value={form.isActive ? "active" : "inactive"}
                    onChange={(event) =>
                      updateField(
                        "isActive",
                        event.target.value === "active"
                      )
                    }
                    disabled={saving}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>

                <label className={`${labelClass} sm:col-span-2`}>
                  <textarea
                    className={inputClass}
                    rows={4}
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Describe the product..."
                    required
                    disabled={saving}
                  />
                </label>
              </div>
            </section>

            {/* Product Image Galleries */}
            <section className={sectionClass}>
              <h3 className="mb-0 text-base font-semibold text-slate-800">
                Product Image Galleries
              </h3>

              <p className="mb-2 text-xs leading-relaxed text-slate-500">
                Existing images stay; new ones upload on save.
              </p>

              <div className="space-y-4">
                {renderGallerySection(
                  "Regular Packaging",
                  "The first image is automatically used as the main product cover.",
                  "regularImages",
                  form.regularImages
                )}

                {renderGallerySection(
                  "Cardboard Box Gallery",
                  "Images for Cardboard Box packaging.",
                  "cardboardBoxImages",
                  form.cardboardBoxImages
                )}
              </div>
            </section>

            {/* Variants & Pricing */}
            <section className={sectionClass}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-[12px] md:text-[14px] font-semibold text-slate-700">
                    Variants & Pricing
                  </h3>

                  <p className="mt-0 text-xs text-slate-500">
                    Set quantity, packaging, price and individual Glass Jar images.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addVariant}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#A85F70] px-3.5 py-2.5 text-[11px] md:text-[12px] text-white transition hover:bg-[#8F4E60] disabled:opacity-50"
                >
                  <Plus size={16} />
                  Add Variant
                </button>
              </div>

              {form.variants.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#E4C6CE] px-4 py-8 text-center">
                  <Package
                    size={28}
                    className="mx-auto text-[#C69AA5]"
                  />

                  <p className="mt-2 text-sm font-medium text-slate-700">
                    No variants added
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Add at least one variant before saving.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {form.variants.map((variant, index) => {
                    const imageKey = getVariantImageKey(variant, index);
                    const selectedImage = files.variantImages?.[imageKey];

                    const imagePreview = selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : variant.image ?? null;

                    return (
                      <div
                        key={variant.id ?? `new-variant-${index}`}
                        className="rounded-xl border border-[#F0DDE1] bg-[#FFFCFC] p-3 sm:p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-[12px] md:text-[13px] font-semibold text-slate-700">
                            Variant {index + 1}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            aria-label={`Remove variant ${index + 1}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <label className={labelClass}>
                            Quantity

                            <input
                              className={inputClass}
                              type="text"
                              inputMode="decimal"
                              placeholder="e.g. 250"
                              value={variant.quantity}
                              onChange={(event) =>
                                updateVariant(
                                  index,
                                  "quantity",
                                  event.target.value
                                )
                              }
                              required
                              disabled={saving}
                            />
                          </label>

                          <label className={labelClass}>
                            Unit

                            <select
                              className={inputClass}
                              value={variant.unit}
                              onChange={(event) =>
                                updateVariant(
                                  index,
                                  "unit",
                                  event.target.value
                                )
                              }
                              disabled={saving}
                            >
                              {!UNIT_OPTIONS.includes(variant.unit) && (
                                <option value={variant.unit}>
                                  {variant.unit}
                                </option>
                              )}

                              {UNIT_OPTIONS.map((unit) => (
                                <option key={unit} value={unit}>
                                  {unit}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className={labelClass}>
                            Packaging

                            <select
                              className={inputClass}
                              value={variant.packaging}
                              onChange={(event) =>
                                updateVariant(
                                  index,
                                  "packaging",
                                  event.target.value
                                )
                              }
                              disabled={saving}
                            >
                              {!PACKAGING_OPTIONS.includes(
                                variant.packaging
                              ) && (
                                <option value={variant.packaging}>
                                  {variant.packaging}
                                </option>
                              )}

                              {PACKAGING_OPTIONS.map((packaging) => (
                                <option key={packaging} value={packaging}>
                                  {packaging}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className={labelClass}>
                            Price (₹)

                            <input
                              className={inputClass}
                              type="text"
                              inputMode="decimal"
                              placeholder="e.g. 499"
                              value={variant.price}
                              onChange={(event) =>
                                updateVariant(
                                  index,
                                  "price",
                                  event.target.value
                                )
                              }
                              required
                              disabled={saving}
                            />
                          </label>
                        </div>

                        {/* Glass Jar Variant Image */}
                        {variant.packaging === "Glass Jar" && (
                          <div className="mt-4 rounded-xl border border-[#EADDE0] bg-white p-3 sm:p-4">
                            <div className="mb-3">
                              <p className="text-sm font-semibold text-slate-700">
                                Glass Jar Variant Image
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Upload a separate image for this{" "}
                                {variant.quantity}
                                {variant.unit} Glass Jar variant.
                              </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt={`${variant.quantity}${variant.unit} Glass Jar`}
                                  className="h-28 w-28 shrink-0 rounded-xl border border-[#EADDE0] bg-white object-contain p-2"
                                />
                              ) : (
                                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#DDBDC5] bg-[#FFFAFB]">
                                  <Package
                                    size={30}
                                    className="text-[#C69AA5]"
                                  />
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <FilePicker
                                  label={
                                    selectedImage
                                      ? "Replace variant image"
                                      : "Upload variant image"
                                  }
                                  disabled={saving}
                                  onChange={(selectedFiles) =>
                                    addVariantImage(
                                      variant,
                                      index,
                                      selectedFiles
                                    )
                                  }
                                  hint="JPEG, PNG or WebP. Maximum 5 MB."
                                />

                                {selectedImage && (
                                  <p className="mt-2 truncate text-xs text-green-700">
                                    Selected: {selectedImage.name}
                                  </p>
                                )}

                                {!selectedImage && variant.image && (
                                  <p className="mt-2 text-xs text-green-700">
                                    Existing variant image will be preserved.
                                  </p>
                                )}

                                {selectedImage && (
                                  <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() =>
                                      removeVariantImage(variant, index)
                                    }
                                    className="mt-2 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                                  >
                                    <X size={13} />
                                    Keep existing image
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Product Information */}
            <section className={sectionClass}>
              <h3 className="mb-4 text-base font-semibold text-slate-800">
                Product Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Ingredients

                  <textarea
                    className={inputClass}
                    rows={3}
                    value={form.ingredients}
                    onChange={(event) =>
                      updateField("ingredients", event.target.value)
                    }
                    placeholder="List the ingredients..."
                    disabled={saving}
                  />
                </label>

                <label className={labelClass}>
                  Allergen Information

                  <textarea
                    className={inputClass}
                    rows={3}
                    value={form.allergenInfo}
                    onChange={(event) =>
                      updateField("allergenInfo", event.target.value)
                    }
                    placeholder="Allergen details..."
                    disabled={saving}
                  />
                </label>

                <label className={labelClass}>
                  Benefits

                  <textarea
                    className={inputClass}
                    rows={3}
                    value={form.benefits}
                    onChange={(event) =>
                      updateField("benefits", event.target.value)
                    }
                    placeholder="Product benefits..."
                    disabled={saving}
                  />
                </label>

                <label className={labelClass}>
                  Usage Suggestions

                  <textarea
                    className={inputClass}
                    rows={3}
                    value={form.usageSuggestions}
                    onChange={(event) =>
                      updateField(
                        "usageSuggestions",
                        event.target.value
                      )
                    }
                    placeholder="Suggested use..."
                    disabled={saving}
                  />
                </label>

                <label className={`${labelClass} sm:col-span-2`}>
                  Medical Disclaimer

                  <textarea
                    className={inputClass}
                    rows={3}
                    value={form.medicalDisclaimer}
                    onChange={(event) =>
                      updateField(
                        "medicalDisclaimer",
                        event.target.value
                      )
                    }
                    placeholder="Important product disclaimer..."
                    disabled={saving}
                  />
                </label>
              </div>
            </section>

            {/* Storage & Shelf Life */}
            <section className={sectionClass}>
              <h3 className="mb-4 text-base font-semibold text-slate-800">
                Storage & Shelf Life
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Storage Instructions

                  <textarea
                    className={inputClass}
                    rows={3}
                    value={form.storageInstructions}
                    onChange={(event) =>
                      updateField(
                        "storageInstructions",
                        event.target.value
                      )
                    }
                    placeholder="How should the product be stored?"
                    disabled={saving}
                  />
                </label>

                <label className={labelClass}>
                  Shelf Life

                  <textarea
                    className={inputClass}
                    rows={3}
                    value={form.shelfLife}
                    onChange={(event) =>
                      updateField("shelfLife", event.target.value)
                    }
                    placeholder="e.g. Best consumed within 30 days"
                    disabled={saving}
                  />
                </label>
              </div>
            </section>
          </div>

          {/* Modal Footer */}
          <footer className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[#F0DDE1] bg-white px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-[#EADDE0] px-5 py-2.5 text-[12px] md:text-[13px] text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A85F70] px-6 py-2.5 text-[12px] md:text-[13px] text-white shadow-sm transition hover:bg-[#8F4E60] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Saving...
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default ProductFormModal;
