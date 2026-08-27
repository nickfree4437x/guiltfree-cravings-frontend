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

export interface CreateOrderPayload {
  customer: CreateOrderCustomer;
  items: CreateOrderItem[];
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

export interface Order {
  id: number;
  orderNumber: string;

  userId: number;

  customerName: string;
  customerPhone: string;
  customerEmail: string | null;

  subtotal: number;
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

export const getMyOrders = async (): Promise<
  Order[]
> => {
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

export default api;