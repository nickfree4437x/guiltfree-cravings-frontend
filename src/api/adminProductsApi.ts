
import axios from "axios";
import type { AdminProduct } from "../components/admin/products/types";

// ─── Configuration ─────────────────────────────────────────

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://guiltfreecravings.com/api"
).replace(/\/+$/, "");

const ADMIN_TOKEN_KEY = "guiltfree_admin_token";

const MAX_VARIANT_IMAGES = 5;

// ─── Types ─────────────────────────────────────────────────

export interface AdminProductVariantInput {
  id?: number;
  quantity: number;
  unit: string;
  packaging: string;
  price: number;

  // Legacy single image compatibility
  image?: string | null;

  // Multiple images for individual Glass Jar variants
  images?: string[];
}

export interface AdminProductInput {
  name: string;
  description: string;
  ingredients?: string;
  allergenInfo?: string;
  medicalDisclaimer?: string;
  benefits?: string;
  usageSuggestions?: string;
  storageInstructions?: string;
  shelfLife?: string;

  image?: string;
  images?: string[];
  regularImages?: string[];
  glassJarImages?: string[];
  cardboardBoxImages?: string[];

  glassJarImage?: string | null;
  cardboardBoxImage?: string | null;

  variants: AdminProductVariantInput[];
  isActive?: boolean;
}

export type AdminProductUpdateInput =
  Partial<AdminProductInput>;

export interface AdminProductImageFiles {
  image?: File;
  images?: File[];
  regularImages?: File[];
  glassJarImages?: File[];
  cardboardBoxImages?: File[];

  glassJarImage?: File;
  cardboardBoxImage?: File;

  // Multiple files per variant ID or new variant index
  variantImages?: Record<string, File[]>;
}

interface AdminProductsResponse {
  success: boolean;
  message?: string;
  data?: {
    products?: AdminProduct[];
  };
}

interface AdminProductResponse {
  success: boolean;
  message?: string;
  data?: {
    product: AdminProduct;
    id?: number;
  };
}

interface AdminActionResponse {
  success: boolean;
  message?: string;
  data?: {
    id?: number;
    product?: AdminProduct;
  };
}

// ─── Authentication ───────────────────────────────────────

const getAdminHeaders = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  if (!token) {
    throw new Error(
      "Admin session expired. Please log in again."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ─── Error Handling ───────────────────────────────────────

const getErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (error.response?.status === 401) {
      return "Admin session expired. Please log in again.";
    }

    if (error.response?.status === 403) {
      return "You do not have permission to perform this action.";
    }

    if (error.response?.status === 404) {
      return "The requested product could not be found.";
    }

    if (error.response?.status === 409) {
      return (
        "This product cannot be changed because it has linked records."
      );
    }

    if (!error.response) {
      return (
        "Unable to connect to the server. Please check your API URL and connection."
      );
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

// ─── Validation ───────────────────────────────────────────

const validateProductId = (id: number) => {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid product ID.");
  }
};

const validateVariantImageFiles = (
  variantImages?: Record<string, File[]>
) => {
  if (!variantImages) {
    return;
  }

  Object.entries(variantImages).forEach(([key, files]) => {
    if (!/^\d+$/.test(key)) {
      throw new Error(
        `Invalid variant image key "${key}". Use a numeric variant ID or index.`
      );
    }

    if (!Array.isArray(files)) {
      throw new Error(
        `Variant image uploads for "${key}" must be an array.`
      );
    }

    if (files.length > MAX_VARIANT_IMAGES) {
      throw new Error(
        `A maximum of ${MAX_VARIANT_IMAGES} images is allowed per Glass Jar variant.`
      );
    }

    files.forEach((file) => {
      if (!(file instanceof File)) {
        throw new Error(
          `Invalid image file supplied for variant "${key}".`
        );
      }

      if (
        ![
          "image/jpeg",
          "image/png",
          "image/webp",
        ].includes(file.type)
      ) {
        throw new Error(
          "Only JPG, PNG and WebP images are allowed."
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error(
          "Each variant image must be smaller than 5 MB."
        );
      }
    });
  });
};

// ─── Multipart Form Data Helpers ──────────────────────────

const appendString = (
  formData: FormData,
  key: string,
  value: unknown
) => {
  if (value === undefined || value === null) {
    return;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    formData.append(key, String(value));
  }
};

const appendStringArray = (
  formData: FormData,
  key: string,
  values?: string[]
) => {
  if (values === undefined) {
    return;
  }

  formData.append(key, JSON.stringify(values));
};

const appendImageFiles = (
  formData: FormData,
  key: string,
  files?: File[]
) => {
  files?.forEach((file) => {
    if (file instanceof File) {
      formData.append(key, file);
    }
  });
};

// ─── Build Product Form Data ──────────────────────────────

const buildProductFormData = (
  product: AdminProductUpdateInput,
  files?: AdminProductImageFiles
): FormData => {
  validateVariantImageFiles(files?.variantImages);

  const formData = new FormData();

  // Basic product fields
  appendString(formData, "name", product.name);
  appendString(formData, "description", product.description);

  appendString(formData, "ingredients", product.ingredients);
  appendString(formData, "allergenInfo", product.allergenInfo);
  appendString(formData, "medicalDisclaimer", product.medicalDisclaimer);
  appendString(formData, "benefits", product.benefits);
  appendString(formData, "usageSuggestions", product.usageSuggestions);
  appendString(formData, "storageInstructions", product.storageInstructions);
  appendString(formData, "shelfLife", product.shelfLife);

  // Main and packaging-specific image URLs
  appendString(formData, "image", product.image);
  appendString(formData, "glassJarImage", product.glassJarImage);
  appendString(formData, "cardboardBoxImage", product.cardboardBoxImage);

  // Product image galleries
  appendStringArray(formData, "images", product.images);
  appendStringArray(formData, "regularImages", product.regularImages);
  appendStringArray(formData, "glassJarImages", product.glassJarImages);
  appendStringArray(
    formData,
    "cardboardBoxImages",
    product.cardboardBoxImages
  );

  // Variant data
  if (product.variants !== undefined) {
    formData.append(
      "variants",
      JSON.stringify(product.variants)
    );
  }

  // Active status
  if (product.isActive !== undefined) {
    formData.append(
      "isActive",
      String(product.isActive)
    );
  }

  // Main product image file
  if (files?.image instanceof File) {
    formData.append("image", files.image);
  }

  // Product gallery image files
  appendImageFiles(formData, "images", files?.images);
  appendImageFiles(
    formData,
    "regularImages",
    files?.regularImages
  );
  appendImageFiles(
    formData,
    "glassJarImages",
    files?.glassJarImages
  );
  appendImageFiles(
    formData,
    "cardboardBoxImages",
    files?.cardboardBoxImages
  );

  // Packaging-specific image files
  if (files?.glassJarImage instanceof File) {
    formData.append(
      "glassJarImage",
      files.glassJarImage
    );
  }

  if (files?.cardboardBoxImage instanceof File) {
    formData.append(
      "cardboardBoxImage",
      files.cardboardBoxImage
    );
  }

  // Variant-specific multiple image files
  if (files?.variantImages) {
    Object.entries(files.variantImages).forEach(
      ([key, variantFiles]) => {
        variantFiles.forEach((file) => {
          formData.append(
            `variantImage_${key}`,
            file
          );
        });
      }
    );
  }

  return formData;
};

// ─── Get All Admin Products ───────────────────────────────

export const getAdminProducts = async (): Promise<
  AdminProduct[]
> => {
  try {
    const response = await axios.get<AdminProductsResponse>(
      `${API_BASE_URL}/admin/products`,
      {
        headers: getAdminHeaders(),
      }
    );

    const responseData = response.data;

    if (!responseData?.success) {
      throw new Error(
        responseData?.message || "Unable to load products."
      );
    }

    // Support both backend response formats:
    // 1. { success: true, data: [...] }
    // 2. { success: true, data: { products: [...] } }

    const products = Array.isArray(responseData.data)
      ? responseData.data
      : responseData.data?.products;

    if (!Array.isArray(products)) {
      console.error(
        "Invalid admin products API response:",
        responseData
      );

      throw new Error(
        "Invalid products response received from server."
      );
    }

    return products;
  } catch (error) {
    console.error("getAdminProducts API error:", error);

    throw new Error(
      getErrorMessage(error, "Unable to load products.")
    );
  }
};

// ─── Get Product By ID ────────────────────────────────────

export const getAdminProductById = async (
  id: number
): Promise<AdminProduct> => {
  validateProductId(id);

  try {
    const response = await axios.get<AdminProductResponse>(
      `${API_BASE_URL}/admin/products/${id}`,
      {
        headers: getAdminHeaders(),
      }
    );

    if (
      !response.data.success ||
      !response.data.data?.product
    ) {
      throw new Error(
        response.data.message ||
          "Unable to load product details."
      );
    }

    return response.data.data.product;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Unable to load product details."
      )
    );
  }
};

// ─── Create Product ───────────────────────────────────────

export const createAdminProduct = async (
  product: AdminProductInput,
  files?: AdminProductImageFiles
): Promise<AdminProduct> => {
  try {
    const formData = buildProductFormData(
      product,
      files
    );

    const response = await axios.post<AdminProductResponse>(
      `${API_BASE_URL}/admin/products`,
      formData,
      {
        headers: getAdminHeaders(),
      }
    );

    if (
      !response.data.success ||
      !response.data.data?.product
    ) {
      throw new Error(
        response.data.message ||
          "Unable to create product."
      );
    }

    return response.data.data.product;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to create product.")
    );
  }
};

// ─── Update Product ───────────────────────────────────────

export const updateAdminProduct = async (
  id: number,
  product: AdminProductUpdateInput,
  files?: AdminProductImageFiles
): Promise<AdminProduct> => {
  validateProductId(id);

  try {
    const formData = buildProductFormData(
      product,
      files
    );

    const response = await axios.put<AdminProductResponse>(
      `${API_BASE_URL}/admin/products/${id}`,
      formData,
      {
        headers: getAdminHeaders(),
      }
    );

    if (
      !response.data.success ||
      !response.data.data?.product
    ) {
      throw new Error(
        response.data.message ||
          "Unable to update product."
      );
    }

    return response.data.data.product;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Unable to update product.")
    );
  }
};

// ─── Activate / Deactivate Product ────────────────────────

export const updateAdminProductStatus = async (
  id: number,
  isActive: boolean
): Promise<AdminProduct> => {
  validateProductId(id);

  try {
    const response = await axios.patch<AdminProductResponse>(
      `${API_BASE_URL}/admin/products/${id}/status`,
      { isActive },
      {
        headers: getAdminHeaders(),
      }
    );

    if (
      !response.data.success ||
      !response.data.data?.product
    ) {
      throw new Error(
        response.data.message ||
          "Unable to update product status."
      );
    }

    return response.data.data.product;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Unable to update product status."
      )
    );
  }
};

// ─── Delete Product ───────────────────────────────────────

export const deleteAdminProduct = async (
  id: number
): Promise<void> => {
  validateProductId(id);

  try {
    const response = await axios.delete<AdminActionResponse>(
      `${API_BASE_URL}/admin/products/${id}`,
      {
        headers: getAdminHeaders(),
      }
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message ||
          "Unable to delete product."
      );
    }
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Unable to delete product."
      )
    );
  }
};
