import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

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
  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";
  createdAt: string;
}

interface AdminDashboardResponse {
  success: boolean;
  message?: string;
  data: {
    stats: AdminDashboardStats;
    recentOrders: AdminRecentOrder[];
  };
}

export const getAdminDashboard =
  async (): Promise<
    AdminDashboardResponse["data"]
  > => {
    const token =
      localStorage.getItem(
        "guiltfree_admin_token"
      );

    const response =
      await axios.get<AdminDashboardResponse>(
        `${API_BASE_URL}/admin/dashboard/overview`,
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
          "Unable to load dashboard."
      );
    }

    return response.data.data;
  };