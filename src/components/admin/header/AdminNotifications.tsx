import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bell, CheckCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────
interface OrderNotification {
  id: number;
  orderId: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  createdAt: string;
  isRead: boolean;
}

interface NotificationApiItem {
  id: number;
  orderId: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  order: {
    id: number;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    createdAt: string;
  } | null;
}

interface NotificationApiResponse {
  success: boolean;
  data: NotificationApiItem[];
}

// ─── Config ───────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://guiltfreecravings.com/api";
const POLL_INTERVAL = 15_000;

const notificationApi = axios.create({
  baseURL: `${API_BASE_URL}/admin/notifications`,
});

function getAdminToken(): string {
  const token = localStorage.getItem("guiltfree_admin_token");
  if (!token) throw new Error("Admin authentication token not found.");
  return token;
}

const authConfig = () => ({
  headers: { Authorization: `Bearer ${getAdminToken()}` },
});

// ─── Helpers ──────────────────────────────────────────────
const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
};

// ─── Component ────────────────────────────────────────────
function AdminNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestInProgress = useRef(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ─── Fetch Notifications ────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (requestInProgress.current) return;
    requestInProgress.current = true;

    try {
      const response = await notificationApi.get<NotificationApiResponse>("/", authConfig());
      const result = response.data;

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error("Invalid notifications response.");
      }

      const formatted = result.data.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        orderNumber: item.order?.orderNumber || item.title.replace(/^New Order:\s*/i, "") || `Order #${item.orderId}`,
        customerName: item.order?.customerName || item.message.replace(/\s+placed a new order\.?$/i, "") || "Customer",
        totalAmount: Number(item.order?.totalAmount ?? 0),
        createdAt: item.createdAt,
        isRead: item.isRead,
      }));

      setNotifications(formatted);
      setActionError("");
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error);
    } finally {
      requestInProgress.current = false;
      setIsLoading(false);
    }
  }, []);

  // ─── Effects ────────────────────────────────────────────
  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!active) return;
      await fetchNotifications();
    };

    void load();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, POLL_INTERVAL);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") void load();
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ─── Actions ────────────────────────────────────────────
  const markAsRead = async (notificationId: number) => {
    const previous = notifications;
    setActionError("");
    setNotifications((curr) =>
      curr.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );

    try {
      await notificationApi.patch(`/${notificationId}/read`, {}, authConfig());
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      setNotifications(previous);
      setActionError("Could not update notification. Please try again.");
    }
  };

  const markAllAsRead = async () => {
    const previous = notifications;
    setActionError("");
    setNotifications((curr) => curr.map((n) => ({ ...n, isRead: true })));

    try {
      await notificationApi.patch("/read-all", {}, authConfig());
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      setNotifications(previous);
      setActionError("Could not update notifications. Please try again.");
    }
  };

  const openOrder = async (notification: OrderNotification) => {
    if (!notification.isRead) await markAsRead(notification.id);
    setIsOpen(false);
    navigate(`/admin/orders/${notification.orderId}`);
  };

  // ─── Render ─────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative">
      {/* Bell Trigger */}
      <button
        type="button"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title="Notifications"
        onClick={() => setIsOpen((c) => !c)}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EADBD0] bg-white text-[#6F6259] transition hover:border-[#D9B8C1] hover:bg-[#FDF4F6] hover:text-[#B5697A] focus:outline-none"
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#B5697A] px-1 text-[10px] text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          role="dialog" 
          aria-label="Order notifications" 
          className="
            fixed left-1/2 top-[70px] -translate-x-1/2 z-50 
            w-[calc(100vw-32px)] max-w-[360px] 
            sm:absolute sm:left-auto sm:top-[calc(100%+12px)] sm:right-0 sm:w-[360px] sm:translate-x-0
            overflow-hidden rounded-2xl border border-[#EADBD0] bg-white shadow-lg
          "
        >
          
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#F1E9E1] bg-[#fffbfc] px-4 py-3">
            <div>
              <h2 className="text-[13px] font-semibold text-gray-700">Notifications</h2>
              <p className="mt-0 text-[11px] text-slate-500">
                {unreadCount} unread order{unreadCount === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button type="button" onClick={() => void markAllAsRead()} title="Mark all as read" aria-label="Mark all notifications as read" className="rounded-lg p-2 text-slate-500 hover:bg-[#FBECEF] hover:text-[#B5697A]">
                  <CheckCheck size={17} />
                </button>
              )}
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close notifications" className="rounded-lg p-2 text-slate-500 hover:bg-[#FBECEF] hover:text-[#B5697A]">
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Error */}
          {actionError && (
            <p role="alert" className="border-b border-[#F1E9E1] px-4 py-2 text-xs text-red-600">
              {actionError}
            </p>
          )}

          {/* List */}
          <div className="max-h-[min(420px,65vh)] overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-[#9A8D82]">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#FBECEF] text-[#B5697A]">
                  <Bell size={20} />
                </span>
                <p className="mt-3 text-sm text-gray-700">No order notifications</p>
                <p className="mt-1 text-xs text-slate-500">New orders will appear here.</p>
                <button type="button" onClick={() => void fetchNotifications()} className="mt-3 text-xs text-[#B5697A] hover:underline">
                  Refresh
                </button>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => void openOrder(notification)}
                  className="flex w-full gap-3 border-b border-[#F7F0E9] px-4 py-4 text-left transition last:border-b-0 hover:bg-[#fffbfc] bg-white"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="break-all text-xs font-semibold text-gray-700">
                        New order: {notification.orderNumber}
                      </span>
                      {!notification.isRead && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#B5697A]" aria-label="Unread" />
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">{notification.customerName}</span>
                    
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#1F4A2E]">
                        ₹{notification.totalAmount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-500">{formatTime(notification.createdAt)}</span>
                    </div>
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#F1E9E1] bg-[#fffbfc] px-4 py-2">
            <button
              type="button"
              onClick={() => { setIsOpen(false); navigate("/admin/orders"); }}
              className="w-full rounded-lg py-2 text-xs text-[#B5697A] transition hover:bg-[#FBECEF]"
            >
              View All Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotifications;