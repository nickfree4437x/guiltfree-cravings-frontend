import axios from "axios";
import type { DeliveryStatus } from "../components/admin/orders/types";

// ─── Config ───────────────────────────────────────────────
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://guiltfreecravings.com/api";

const ADMIN_TOKEN_KEY = "guiltfree_admin_token";

// ─── Auth Header Helper ───────────────────────────────────
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN_KEY)}`,
});

// ─── Types ────────────────────────────────────────────────
export interface AdminInfo {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  paidOrders: number;
}

export interface AdminRecentOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;

  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "COMPLETED"
    | "CANCELLED";

  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";

  // Delivery information
  deliveryStatus?: DeliveryStatus | null;
  deliveredAt?: string | null;

  createdAt: string;
}

export interface AdminTopSellingProduct {
  productId: number;
  productName: string;
  image: string;
  unitsSold: number;
  revenue: number;
}

interface AdminDashboardResponse {
  success: boolean;
  message?: string;
  data: {
    adminInfo: AdminInfo | null;
    stats: AdminDashboardStats;
    recentOrders: AdminRecentOrder[];
    topSellingProducts: AdminTopSellingProduct[];
  };
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface AdminSalesAnalytics {
  period: 7 | 30;
  totalOrders: number;
  paidOrders: number;
  revenue: number;
  averageOrderValue: number;
  dailyRevenue: DailyRevenue[];
}

interface AdminSalesAnalyticsResponse {
  success: boolean;
  message?: string;
  data: AdminSalesAnalytics;
}

// ─── API: Dashboard ───────────────────────────────────────
export const getAdminDashboard = async (): Promise<
  AdminDashboardResponse["data"]
> => {
  const response = await axios.get<AdminDashboardResponse>(
    `${API_BASE_URL}/admin/dashboard/overview`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || "Unable to load dashboard."
    );
  }

  return response.data.data;
};

// ─── API: Sales Analytics ─────────────────────────────────
export const getSalesAnalytics = async (
  days: 7 | 30 = 7
): Promise<AdminSalesAnalytics> => {
  const response = await axios.get<AdminSalesAnalyticsResponse>(
    `${API_BASE_URL}/admin/dashboard/sales-analytics`,
    {
      params: { days },
      headers: getAuthHeaders(),
    }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || "Unable to load sales analytics."
    );
  }

  return response.data.data;
};