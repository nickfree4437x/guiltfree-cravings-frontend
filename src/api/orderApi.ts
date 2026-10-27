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
export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

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
  // Backend-calculated delivery details
  deliveryZone: DeliveryZone | null;
  deliveryCharge: number;
  deliveryChargeConfirmed: boolean;
  deliveryStatus: DeliveryStatus;
  // Pricing
  subtotal: number;
  discountAmount?: number;
  offerCode?: string | null;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// ─── Types: API Responses ─────────────────────────────────
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

// ─── Axios Instance ───────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
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
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── API: Create Order ────────────────────────────────────
export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const response = await api.post<CreateOrderResponse>("/orders", payload);
  return response.data.data;
};

// ─── API: Get My Orders ───────────────────────────────────
export const getMyOrders = async (): Promise<Order[]> => {
  const response = await api.get<OrdersResponse>("/orders");
  return response.data.data;
};

// ─── API: Get Order By ID ─────────────────────────────────
export const getOrderById = async (orderId: number): Promise<Order> => {
  const response = await api.get<OrderResponse>(`/orders/${orderId}`);
  return response.data.data;
};

export default api;