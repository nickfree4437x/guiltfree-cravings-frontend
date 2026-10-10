// src/components/admin/orders/types.ts

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

  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;

  subtotal: number;
  discountAmount: number;
  totalAmount: number;

  offerCode?: string | null;

  itemCount: number;
  items: AdminOrderItem[];

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  createdAt: string;
  updatedAt: string;
}