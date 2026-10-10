/*
 * =========================================================
 * CUSTOMER TYPES
 * =========================================================
 */

export interface AdminCustomer {
  id: number;
  name: string | null;
  phone: string;
  email: string | null;
  isVerified: boolean;
  totalOrders: number;
  createdAt: string;
}

/*
 * =========================================================
 * CUSTOMER ORDER ITEM
 * =========================================================
 */

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

/*
 * =========================================================
 * CUSTOMER ORDER
 * =========================================================
 */

export interface AdminCustomerOrder {
  id: number;
  orderNumber: string;

  subtotal: number;
  discountAmount: number;
  totalAmount: number;

  offerCode: string | null;

  orderStatus: string;
  paymentStatus: string;

  createdAt: string;
  updatedAt: string;

  items: AdminCustomerOrderItem[];
}

/*
 * =========================================================
 * CUSTOMER STATS
 * =========================================================
 */

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

/*
 * =========================================================
 * CUSTOMER DETAILS
 * =========================================================
 */

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