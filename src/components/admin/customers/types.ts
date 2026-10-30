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

  // Order and payment statuses
  orderStatus: string;
  paymentStatus: string;

  // Delivery status
  deliveryStatus?: DeliveryStatus | null;
  deliveredAt?: string | null;

  createdAt: string;
  updatedAt: string;
  items: AdminCustomerOrderItem[];
}

// ─── Customer Stats ───────────────────────────────────────
export interface AdminCustomerStats {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  processingOrders: number;
  confirmedOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSpent: number;
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