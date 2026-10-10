// src/api/adminOrderApi.ts

import axios from "axios";

import type {
  AdminOrder,
  OrderStatus,
  PaymentStatus,
} from "../components/admin/orders/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://guiltfree-cravings-backend.onrender.com/api";

/*
 * =========================================================
 * API RESPONSE TYPES
 * =========================================================
 */

interface AdminOrderItemResponse {
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

interface AdminOrderResponse {
  id: number;
  orderNumber: string;

  customerName: string;
  customerPhone: string;
  customerEmail: string | null;

  subtotal: number;
  discountAmount: number;
  totalAmount: number;

  offerCode: string | null;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  createdAt: string;
  updatedAt: string;

  items: AdminOrderItemResponse[];
}

interface AdminOrdersResponse {
  success: boolean;
  message?: string;
  count: number;
  data: AdminOrderResponse[];
}

/*
 * =========================================================
 * GET ADMIN ORDERS
 * =========================================================
 */

export const getAdminOrders =
  async (): Promise<AdminOrder[]> => {
    const token =
      localStorage.getItem(
        "guiltfree_admin_token"
      );

    if (!token) {
      throw new Error(
        "Admin authentication required. Please login again."
      );
    }

    const response =
      await axios.get<AdminOrdersResponse>(
        `${API_BASE_URL}/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    if (
      !response.data.success ||
      !response.data.data
    ) {
      throw new Error(
        response.data.message ||
          "Unable to load admin orders."
      );
    }

    return response.data.data.map(
      (order) => ({
        ...order,
        itemCount: order.items.reduce(
          (total, item) =>
            total + item.quantity,
          0
        ),
      })
    );
  };