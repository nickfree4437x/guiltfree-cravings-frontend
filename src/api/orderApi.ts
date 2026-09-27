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
 * CREATE ORDER PAYLOAD
 * =========================================================
 *
 * offerCode is optional.
 *
 * If customer has applied an offer during checkout,
 * the offer code will be sent to the backend.
 *
 * IMPORTANT:
 * Backend must re-validate the offer and calculate
 * the final discount. Frontend discount values are
 * never trusted for order creation.
 */

export interface CreateOrderPayload {
  customer: CreateOrderCustomer;
  items: CreateOrderItem[];

  offerCode?: string | null;
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
   * Final payable order amount.
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
    "https://guiltfree-cravings-backend.onrender.com/api",

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
    return localStorage.getItem(
      AUTH_TOKEN_KEY
    );
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
      config.headers.Authorization =
        `Bearer ${token}`;
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
 * The backend remains responsible for:
 *
 * - validating products
 * - validating variants
 * - calculating prices
 * - calculating subtotal
 * - validating the offer
 * - calculating discount
 * - calculating final total
 * - creating the order
 *
 * Frontend only sends:
 *
 * - customer details
 * - product/variant IDs
 * - quantities
 * - optional offer code
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
    await api.get<OrdersResponse>(
      "/orders"
    );

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