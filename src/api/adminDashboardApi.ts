
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://guiltfreecravings.com/api";

// Admin information
export interface AdminInfo {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

// Dashboard statistics
export interface AdminDashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  paidOrders: number;
}

// Recent orders
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
  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";
  createdAt: string;
}

// Top-selling products
export interface AdminTopSellingProduct {
  productId: number;
  productName: string;
  image: string;
  unitsSold: number;
  revenue: number;
}

// Dashboard API response
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

// Sales analytics types
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

// Get admin dashboard
export const getAdminDashboard = async (): Promise<
  AdminDashboardResponse["data"]
> => {
  const token = localStorage.getItem(
    "guiltfree_admin_token"
  );

  const response = await axios.get<AdminDashboardResponse>(
    `${API_BASE_URL}/admin/dashboard/overview`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message ||
        "Unable to load dashboard."
    );
  }

  return response.data.data;
};

// Get sales and revenue analytics
export const getSalesAnalytics = async (
  days: 7 | 30 = 7
): Promise<AdminSalesAnalytics> => {
  const token = localStorage.getItem(
    "guiltfree_admin_token"
  );

  const response =
    await axios.get<AdminSalesAnalyticsResponse>(
      `${API_BASE_URL}/admin/dashboard/sales-analytics`,
      {
        params: { days },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message ||
        "Unable to load sales analytics."
    );
  }

  return response.data.data;
};
