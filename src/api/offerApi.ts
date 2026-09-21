import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://guiltfree-cravings-backend.onrender.com/api";

const offerApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// TOKEN HELPERS
// ============================================================

const getAdminToken = () =>
  localStorage.getItem("guiltfree_admin_token");

const getCustomerToken = () =>
  localStorage.getItem("guiltfree_auth_token");

const createAuthHeaders = (token: string | null) => {
  if (!token) {
    throw new Error(
      "Authentication required. Please login again."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ============================================================
// TYPES
// ============================================================

export type OfferAudience =
  | "PUBLIC"
  | "SPECIFIC_CUSTOMER";

export type DiscountType =
  | "PERCENTAGE"
  | "FIXED";

export type OfferStatus =
  | "ACTIVE"
  | "SCHEDULED"
  | "EXPIRED"
  | "INACTIVE";

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

  status?: OfferStatus;
  usageCount?: number;
  remainingUsage?: number | null;

  createdAt?: string;
  updatedAt?: string;
}

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
}

export interface UpdateOfferPayload
  extends Partial<CreateOfferPayload> {}

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
  discountAmount: number;
  totalAmount: number;
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

  const response = await offerApi.get(
    "/offers/admin",
    {
      params,
      headers: createAuthHeaders(token),
    }
  );

  return response.data.data.offers as Offer[];
};

export const getAdminOffer = async (
  offerId: number
) => {
  const token = getAdminToken();

  const response = await offerApi.get(
    `/offers/admin/${offerId}`,
    {
      headers: createAuthHeaders(token),
    }
  );

  return response.data.data.offer as Offer;
};

export const createOffer = async (
  payload: CreateOfferPayload
) => {
  const token = getAdminToken();

  const response = await offerApi.post(
    "/offers/admin",
    payload,
    {
      headers: createAuthHeaders(token),
    }
  );

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

export const deleteOffer = async (
  offerId: number
) => {
  const token = getAdminToken();

  const response = await offerApi.delete(
    `/offers/admin/${offerId}`,
    {
      headers: createAuthHeaders(token),
    }
  );

  return response.data;
};

// ============================================================
// CUSTOMER APIs
// ============================================================

export const getCustomerOffers = async () => {
  const token = getCustomerToken();

  const response = await offerApi.get(
    "/offers/customer",
    {
      headers: createAuthHeaders(token),
    }
  );

  return response.data.data.offers as Offer[];
};

export const validateOffer = async (
  code: string,
  subtotal: number
) => {
  const token = getCustomerToken();

  const response = await offerApi.post(
    "/offers/validate",
    {
      code,
      subtotal,
    },
    {
      headers: createAuthHeaders(token),
    }
  );

  return response.data.data as ValidateOfferResponse;
};