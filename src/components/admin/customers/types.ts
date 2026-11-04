
import type { DeliveryStatus } from "../orders/types";

// ─── Customer Types ───────────────────────────────────────
export interface AdminCustomer {
  id: number;
  name: string | null;
  phone: string;
  email: string | null;
  isVerified: boolean;
  totalOrders: number;
  createdAt: string;
}

// ─── Order Status ────────────────────────────────────────
export type AdminCustomerOrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  // Legacy statuses
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED";

// ─── Customer Order Item ──────────────────────────────────
export interface AdminCustomerOrderItem {
  id: number;
  productName: string;
  variantQuantity: number;
  variantUnit: string;
  packaging: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

// ─── Customer Order ───────────────────────────────────────
export interface AdminCustomerOrder {
  id: number;
  orderNumber: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  offerCode: string | null;

  orderStatus: AdminCustomerOrderStatus;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";

  deliveryStatus?: DeliveryStatus | null;
  deliveredAt?: string | null;

  createdAt: string;
  updatedAt: string;
  items: AdminCustomerOrderItem[];
}

// ─── Customer Stats ───────────────────────────────────────
export interface AdminCustomerStats {
  totalOrders: number;
  totalSpent: number;
  paidOrders: number;

  newOrders: number;
  confirmedOrders: number;
  packedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;

  // Legacy order counts
  legacyPendingOrders: number;
  legacyProcessingOrders: number;
  legacyCompletedOrders: number;
  legacyOrders: number;

  totalReviews: number;
  totalOfferUsages: number;
}

// ─── Customer Details ─────────────────────────────────────
export interface AdminCustomerDetails {
  id: number;
  name: string | null;
  phone: string;
  email: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  stats: AdminCustomerStats;
  orders: AdminCustomerOrder[];
}
