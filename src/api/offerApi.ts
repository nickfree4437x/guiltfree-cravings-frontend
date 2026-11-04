
import axios from "axios";

// ============================================================
// CONFIG
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://guiltfreecravings.com/api";

const ADMIN_TOKEN_KEY = "guiltfree_admin_token";
const CUSTOMER_TOKEN_KEY = "guiltfree_auth_token";

const offerApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// AUTH HELPERS
// ============================================================

const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
const getCustomerToken = () => localStorage.getItem(CUSTOMER_TOKEN_KEY);

const createAuthHeaders = (token: string | null) => {
  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ============================================================
// TYPES
// ============================================================

export type OfferAudience = "PUBLIC" | "SPECIFIC_CUSTOMER";
export type DiscountType = "PERCENTAGE" | "FIXED";

export type OfferStatus =
  | "ACTIVE"
  | "SCHEDULED"
  | "EXPIRED"
  | "INACTIVE";

export interface OfferVariant {
  id: number;
  variantId: number;
  variant?: {
    id: number;
    productId: number;
    quantity: number;
    unit: string;
    packaging: string;
    price: number;
    product?: {
      id: number;
      name: string;
    };
  };
}

export interface Offer {
  id: number;
  name: string;
  code: string;
  audience: OfferAudience;
  customerPhone: string | null;

  discountType: DiscountType;
  discountValue: number;

  minOrderValue: number | null;
  maxDiscount: number | null;

  usageLimit: number | null;
  perCustomerLimit: number | null;

  startsAt: string;
  expiresAt: string | null;

  isActive: boolean;

  variantIds?: number[];
  offerVariants?: OfferVariant[];

  status?: OfferStatus;
  usageCount?: number;
  remainingUsage?: number | null;

  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// ADMIN CREATE / UPDATE PAYLOADS
// ============================================================

export interface CreateOfferPayload {
  name: string;
  code: string;
  audience: OfferAudience;

  customerPhone?: string | null;

  discountType: DiscountType;
  discountValue: number;

  minOrderValue?: number | null;
  maxDiscount?: number | null;

  usageLimit?: number | null;
  perCustomerLimit?: number | null;

  startsAt: string;
  expiresAt?: string | null;

  isActive?: boolean;

  // Empty array = offer applies to all products.
  // Non-empty array = offer applies only to selected variants.
  variantIds?: number[];
}

export interface UpdateOfferPayload
  extends Partial<CreateOfferPayload> {}

// ============================================================
// CUSTOMER CART TYPES
// ============================================================

export interface OfferCartItem {
  variantId: number;
  quantity: number;
}

// ============================================================
// OFFER VALIDATION RESPONSE
// ============================================================

export interface ValidateOfferResponse {
  offer: {
    id: number;
    name: string;
    code: string;
    audience: OfferAudience;
    discountType: DiscountType;
    discountValue: number;
    minOrderValue: number | null;
    maxDiscount: number | null;
    startsAt: string;
    expiresAt: string | null;
  };

  subtotal: number;
  eligibleSubtotal?: number;
  discountAmount: number;
  totalAmount: number;

  variantIds?: number[];
}

// ============================================================
// ADMIN APIs
// ============================================================

export const getAdminOffers = async (params?: {
  search?: string;
  audience?: OfferAudience | "";
  status?: OfferStatus | "";
}) => {
  const token = getAdminToken();

  const response = await offerApi.get("/offers/admin", {
    params,
    headers: createAuthHeaders(token),
  });

  return response.data.data.offers as Offer[];
};

export const getAdminOffer = async (offerId: number) => {
  const token = getAdminToken();

  const response = await offerApi.get(`/offers/admin/${offerId}`, {
    headers: createAuthHeaders(token),
  });

  return response.data.data.offer as Offer;
};

export const createOffer = async (payload: CreateOfferPayload) => {
  const token = getAdminToken();

  const response = await offerApi.post("/offers/admin", payload, {
    headers: createAuthHeaders(token),
  });

  return response.data.data.offer as Offer;
};

export const updateOffer = async (
  offerId: number,
  payload: UpdateOfferPayload
) => {
  const token = getAdminToken();

  const response = await offerApi.patch(
    `/offers/admin/${offerId}`,
    payload,
    {
      headers: createAuthHeaders(token),
    }
  );

  return response.data.data.offer as Offer;
};

export const deleteOffer = async (offerId: number) => {
  const token = getAdminToken();

  const response = await offerApi.delete(`/offers/admin/${offerId}`, {
    headers: createAuthHeaders(token),
  });

  return response.data;
};

// ============================================================
// PUBLIC APIs - NO LOGIN REQUIRED
// ============================================================

/**
 * Fetch active Public offers.
 *
 * This endpoint must return only:
 * - PUBLIC audience offers
 * - Active offers
 * - Offers within their start/end date
 *
 * Specific Customer offers must never be exposed here.
 */
export const getPublicOffers = async () => {
  const response = await offerApi.get("/offers/public");

  return response.data.data.offers as Offer[];
};

// ============================================================
// CUSTOMER APIs - LOGIN REQUIRED
// ============================================================

export const getCustomerOffers = async () => {
  const token = getCustomerToken();

  const response = await offerApi.get("/offers/customer", {
    headers: createAuthHeaders(token),
  });

  return response.data.data.offers as Offer[];
};

// ============================================================
// CUSTOMER - VALIDATE OFFER
// ============================================================

export const validateOffer = async (
  code: string,
  subtotal: number,
  cartItems: OfferCartItem[]
) => {
  const token = getCustomerToken();

  const response = await offerApi.post(
    "/offers/validate",
    {
      code,
      subtotal,
      cartItems,
    },
    {
      headers: createAuthHeaders(token),
    }
  );

  return response.data.data as ValidateOfferResponse;
};
