import axios from "axios";

import type {
  AdminOrder,
  AdminOrderItem,
  OrderStatus,
  PaymentStatus,
  DeliveryZone,
  DeliveryStatus,
} from "../components/admin/orders/types";

// ─── Config ───────────────────────────────────────────────
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://guiltfreecravings.com/api";

const ADMIN_TOKEN_KEY = "guiltfree_admin_token";

// ─── Types ────────────────────────────────────────────────
interface AdminOrderItemResponse {
  id: number;
  productId: number;
  variantId: number;
  productName: string;
  variantQuantity: number;
  variantUnit: string;
  packaging: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

interface AdminOrderResponse {
  id: number;
  orderNumber: string;
  userId?: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  // Delivery address
  addressLine1?: string | null;
  addressLine2?: string | null;
  area?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  // Delivery details
  deliveryZone?: DeliveryZone | null;
  deliveryCharge?: number;
  deliveryChargeConfirmed?: boolean;
  deliveryStatus?: DeliveryStatus | null;
  // Pricing
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  offerId?: number | null;
  offerCode: string | null;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  items: AdminOrderItemResponse[];
}

interface AdminOrdersResponse {
  success: boolean;
  message?: string;
  count: number;
  data: AdminOrderResponse[];
}

interface AdminOrderDetailsResponse {
  success: boolean;
  message?: string;
  data: AdminOrderResponse;
}

// ─── Auth ─────────────────────────────────────────────────
const getAdminHeaders = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) {
    throw new Error("Admin authentication required. Please login again.");
  }
  return { Authorization: `Bearer ${token}` };
};

// ─── Normalize ────────────────────────────────────────────
const normalizeAdminOrder = (order: AdminOrderResponse): AdminOrder => {
  const items: AdminOrderItem[] = Array.isArray(order.items)
    ? order.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        quantity: Number(item.quantity),
        subtotal: Number(item.subtotal),
      }))
    : [];

  return {
    ...order,
    subtotal: Number(order.subtotal),
    discountAmount: Number(order.discountAmount ?? 0),
    totalAmount: Number(order.totalAmount),
    deliveryCharge: Number(order.deliveryCharge ?? 0),
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
  };
};

// ─── API: Get All Orders ──────────────────────────────────
export const getAdminOrders = async (): Promise<AdminOrder[]> => {
  const response = await axios.get<AdminOrdersResponse>(
    `${API_BASE_URL}/admin/orders`,
    { headers: getAdminHeaders() }
  );

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error(response.data.message || "Unable to load admin orders.");
  }

  return response.data.data.map(normalizeAdminOrder);
};

// ─── API: Get Single Order ────────────────────────────────
export const getAdminOrderById = async (orderId: number): Promise<AdminOrder> => {
  if (!Number.isInteger(orderId) || orderId <= 0) {
    throw new Error("Invalid order ID.");
  }

  const response = await axios.get<AdminOrderDetailsResponse>(
    `${API_BASE_URL}/admin/orders/${orderId}`,
    { headers: getAdminHeaders() }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Unable to load order details.");
  }

  return normalizeAdminOrder(response.data.data);
};