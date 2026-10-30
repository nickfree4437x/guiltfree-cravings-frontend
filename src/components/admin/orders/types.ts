/*
 * =========================================================
 * ORDER TYPES
 * =========================================================
 */

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type DeliveryZone =
  | "WITHIN_DWARKA"
  | "OUTSIDE_DWARKA";

export type DeliveryStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

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

export interface AdminOrder {
  id: number;
  orderNumber: string;

  userId?: number;

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

  offerId?: number | null;
  offerCode?: string | null;

  // Order items
  itemCount: number;
  items: AdminOrderItem[];

  // Status
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  createdAt: string;
  updatedAt: string;
}