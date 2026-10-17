import axios from "axios";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export interface CreateOrderItem {
  productId: number;
  variantId: number;
  quantity: number;
}

export interface CreateOrderCustomer {
  name: string;
  email: string;
}

/*
 * =========================================================
 * DELIVERY ADDRESS
 * =========================================================
 */

export interface DeliveryAddressPayload {
  addressLine1: string;
  addressLine2: string | null;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

/*
 * =========================================================
 * DELIVERY TYPES
 * =========================================================
 */

export type DeliveryZone =
  | "WITHIN_DWARKA"
  | "OUTSIDE_DWARKA";

export type DeliveryStatus =
  | "PENDING"
  | "CONFIRMED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

/*
 * =========================================================
 * CREATE ORDER PAYLOAD
 * =========================================================
 *
 * The frontend sends customer details, delivery address,
 * product/variant IDs, quantities, and an optional offer code.
 *
 * Delivery zone and delivery charge must be determined
 * and validated by the backend.
 *
 * Frontend values are never trusted for pricing.
 */

export interface CreateOrderPayload {
  customer: CreateOrderCustomer;

  deliveryAddress: DeliveryAddressPayload;

  items: CreateOrderItem[];

  offerCode?: string | null;
}

/*
 * =========================================================
 * ORDER ITEM
 * =========================================================
 */

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

/*
 * =========================================================
 * ORDER STATUS
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

/*
 * =========================================================
 * ORDER
 * =========================================================
 */

export interface Order {
  id: number;
  orderNumber: string;

  userId: number;

  customerName: string;
  customerPhone: string;
  customerEmail: string | null;

  /*
   * Delivery address saved with the order.
   */

  addressLine1: string | null;
  addressLine2: string | null;
  area: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;

  /*
   * Backend-calculated delivery details.
   */

  deliveryZone: DeliveryZone | null;
  deliveryCharge: number;
  deliveryChargeConfirmed: boolean;
  deliveryStatus: DeliveryStatus;

  /*
   * Original order subtotal before offer discount.
   */

  subtotal: number;

  /*
   * Discount applied to the order.
   */

  discountAmount?: number;

  /*
   * Applied offer code, if any.
   */

  offerCode?: string | null;

  /*
   * Final order amount returned by the backend.
   * Delivery-charge inclusion depends on backend logic.
   */

  totalAmount: number;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  items: OrderItem[];

  createdAt: string;
  updatedAt: string;
}

/*
 * =========================================================
 * API RESPONSES
 * =========================================================
 */

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

/*
 * =========================================================
 * AXIOS INSTANCE
 * =========================================================
 */

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * =========================================================
 * AUTH TOKEN
 * =========================================================
 */

const AUTH_TOKEN_KEY = "guiltfree_auth_token";

const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

/*
 * =========================================================
 * REQUEST INTERCEPTOR
 * =========================================================
 *
 * Automatically attaches:
 *
 * Authorization: Bearer <token>
 *
 * to authenticated order requests.
 */

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
 * =========================================================
 * CREATE ORDER
 * =========================================================
 *
 * Backend responsibilities:
 *
 * - Authenticate the user
 * - Validate customer and delivery address
 * - Validate products and variants
 * - Calculate product prices and subtotal
 * - Validate the offer
 * - Calculate the discount
 * - Determine delivery eligibility
 * - Calculate delivery charges
 * - Create the order and its items
 *
 * The frontend must never determine the authoritative
 * delivery charge or final payable amount.
 */

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  const response =
    await api.post<CreateOrderResponse>(
      "/orders",
      payload
    );

  return response.data.data;
};

/*
 * =========================================================
 * GET MY ORDERS
 * =========================================================
 */

export const getMyOrders = async (): Promise<Order[]> => {
  const response =
    await api.get<OrdersResponse>("/orders");

  return response.data.data;
};

/*
 * =========================================================
 * GET ORDER BY ID
 * =========================================================
 */

export const getOrderById = async (
  orderId: number
): Promise<Order> => {
  const response =
    await api.get<OrderResponse>(
      `/orders/${orderId}`
    );

  return response.data.data;
};

/*
 * =========================================================
 * DEFAULT EXPORT
 * =========================================================
 */

export default api;