
import axios from "axios";

// ─── Types: Order Items ───────────────────────────────────

export interface CreateOrderItem {
  productId: number;
  variantId: number;
  quantity: number;
}

export interface OrderItem {
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
  discountAmount: number;
}

export interface CreateOrderCustomer {
  name: string;
  email: string;
}

// ─── Types: Delivery ──────────────────────────────────────

export type DeliveryZone = "WITHIN_DWARKA" | "OUTSIDE_DWARKA";

export type DeliveryStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface DeliveryAddressPayload {
  addressLine1: string;
  addressLine2: string | null;
  area: string;
  city: string;
  state: string;
  pincode: string;
  selectedZone: DeliveryZone;
}

// ─── Types: Order ─────────────────────────────────────────

export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface CreateOrderPayload {
  customer: CreateOrderCustomer;
  deliveryAddress: DeliveryAddressPayload;
  items: CreateOrderItem[];
  offerCode?: string | null;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;

  customerName: string;
  customerPhone: string;
  customerEmail: string | null;

  // Delivery address
  addressLine1: string | null;
  addressLine2: string | null;
  area: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;

  // Delivery details
  deliveryZone: DeliveryZone | null;
  deliveryCharge: number;
  deliveryChargeConfirmed: boolean;
  deliveryStatus: DeliveryStatus;
  deliveredAt?: string | null;

  // Pricing
  subtotal: number;
  discountAmount?: number;
  offerId?: number | null;
  offerCode?: string | null;
  totalAmount: number;

  // Order and payment statuses
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  // Order items
  items: OrderItem[];

  createdAt: string;
  updatedAt: string;
}

// ─── Types: Payment Transactions ──────────────────────────

export type PaymentTransactionStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type PaymentProvider = "PHONEPE";

export interface PaymentTransactionOrder {
  id: number;
  orderNumber: string;
  orderStatus: OrderStatus;
}

export interface PaymentTransaction {
  id: number;

  provider: PaymentProvider;

  merchantOrderId: string;
  providerOrderId: string | null;
  transactionId: string | null;

  amount: number;
  currency: string;

  status: PaymentTransactionStatus;

  providerCode: string | null;
  failureReason: string | null;

  lastVerifiedAt: string | null;
  paidAt: string | null;

  createdAt: string;
  updatedAt: string;

  order: PaymentTransactionOrder;
}

// ─── API: Responses ───────────────────────────────────────

interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

interface OrdersResponse {
  success: boolean;
  count: number;
  data: Order[];
}

interface OrderResponse {
  success: boolean;
  data: Order;
}

interface PaymentTransactionsResponse {
  success: boolean;
  count: number;
  data: PaymentTransaction[];
}

// ─── Axios Instance ───────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://guiltfreecravings.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Auth Token + Interceptor ─────────────────────────────

const AUTH_TOKEN_KEY = "guiltfree_auth_token";

const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── API: Create Order ────────────────────────────────────

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  const response = await api.post<CreateOrderResponse>(
    "/orders",
    payload
  );

  return response.data.data;
};

// ─── API: Get My Orders ───────────────────────────────────

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await api.get<OrdersResponse>("/orders");

  return response.data.data;
};

// ─── Order Filtering Helpers ──────────────────────────────

// Delivered orders appear in Order History.
export const isDeliveredOrder = (order: Order): boolean => {
  return (
    order.orderStatus === "DELIVERED" ||
    order.orderStatus === "COMPLETED" ||
    order.deliveryStatus === "DELIVERED"
  );
};

// Active orders appear in My Orders.
// Cancelled and returned orders are excluded.
export const isActiveOrder = (order: Order): boolean => {
  const isCancelled =
    order.orderStatus === "CANCELLED" ||
    order.deliveryStatus === "CANCELLED";

  const isReturned = order.orderStatus === "RETURNED";

  return (
    !isDeliveredOrder(order) &&
    !isCancelled &&
    !isReturned
  );
};

// ─── API: Get Order By ID ─────────────────────────────────

export const getOrderById = async (
  orderId: number
): Promise<Order> => {
  const response = await api.get<OrderResponse>(
    `/orders/${orderId}`
  );

  return response.data.data;
};

// ─── API: Get My Payment Transactions ─────────────────────

export const getMyTransactions = async (): Promise<
  PaymentTransaction[]
> => {
  const response = await api.get<PaymentTransactionsResponse>(
    "/payments/my-transactions"
  );

  return response.data.data;
};

export default api;
