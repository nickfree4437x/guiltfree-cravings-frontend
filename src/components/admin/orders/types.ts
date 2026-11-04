
/*
 * =========================================================
 * ORDER TYPES
 * =========================================================
 */

/*
 * Main order lifecycle statuses.
 * These must match the backend Prisma OrderStatus enum.
 */

export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  // Legacy statuses retained for existing orders
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED";

/*
 * Payment status is independent of order status.
 */

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

/*
 * Delivery zones
 */

export type DeliveryZone =
  | "WITHIN_DWARKA"
  | "OUTSIDE_DWARKA";

/*
 * Existing delivery workflow.
 * Do not merge this with OrderStatus.
 */

export type DeliveryStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

/*
 * =========================================================
 * ADMIN ORDER ITEM
 * =========================================================
 */

export interface AdminOrderItem {
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

/*
 * =========================================================
 * ADMIN ORDER
 * =========================================================
 */

export interface AdminOrder {
  id: number;
  orderNumber: string;

  userId?: number;

  // Customer details
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;

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
  deliveredAt?: string | null;

  // Pricing
  subtotal: number;
  discountAmount: number;
  totalAmount: number;

  // Offer
  offerId?: number | null;
  offerCode?: string | null;

  // Order items
  itemCount: number;
  items: AdminOrderItem[];

  // Independent statuses
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  createdAt: string;
  updatedAt: string;
}
