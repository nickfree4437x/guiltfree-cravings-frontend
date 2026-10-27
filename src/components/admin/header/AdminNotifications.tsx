
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bell, CheckCheck, Package, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const POLL_INTERVAL = 15_000;

const notificationApi = axios.create({
  baseURL: `${API_BASE_URL}/admin/notifications`,
});

function getAdminToken(): string {
  const token = localStorage.getItem("guiltfree_admin_token");

  if (!token) {
    throw new Error("Admin authentication token not found.");
  }

  return token;
}

function authConfig() {
  return {
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  };
}

function AdminNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<
    OrderNotification[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestInProgress = useRef(false);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  /*
   * FETCH PERSISTENT NOTIFICATIONS
   */
  const fetchNotifications = useCallback(async () => {
    if (requestInProgress.current) return;

    requestInProgress.current = true;

    try {
      const response =
        await notificationApi.get<NotificationApiResponse>(
          "/",
          authConfig()
        );

      const result = response.data;

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error("Invalid notifications response.");
      }

      const formattedNotifications: OrderNotification[] =
        result.data.map((item) => ({
          id: item.id,
          orderId: item.orderId,
          orderNumber:
            item.order?.orderNumber ||
            item.title.replace(/^New Order:\s*/i, "") ||
            `Order #${item.orderId}`,
          customerName:
            item.order?.customerName ||
            item.message.replace(/\s+placed a new order\.?$/i, "") ||
            "Customer",
          totalAmount: Number(item.order?.totalAmount ?? 0),
          createdAt: item.createdAt,
          isRead: item.isRead,
        }));

      setNotifications(formattedNotifications);
      setActionError("");
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error);
    } finally {
      requestInProgress.current = false;
      setIsLoading(false);
    }
  }, []);

  /*
   * INITIAL LOAD + AUTOMATIC REFRESH
   */
  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      if (!active) return;
      await fetchNotifications();
    };

    void loadNotifications();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadNotifications();
      }
    }, POLL_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadNotifications();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [fetchNotifications]);

  /*
   * CLOSE DROPDOWN ON OUTSIDE CLICK
   */
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /*
   * MARK ONE NOTIFICATION AS READ
   */
  const markAsRead = async (notificationId: number) => {
    const previousNotifications = notifications;

    setActionError("");

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );

    try {
      await notificationApi.patch(
        `/${notificationId}/read`,
        {},
        authConfig()
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      setNotifications(previousNotifications);
      setActionError("Could not update notification. Please try again.");
    }
  };

  /*
   * MARK ALL NOTIFICATIONS AS READ
   */
  const markAllAsRead = async () => {
    const previousNotifications = notifications;

    setActionError("");

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );

    try {
      await notificationApi.patch(
        "/read-all",
        {},
        authConfig()
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      setNotifications(previousNotifications);
      setActionError("Could not update notifications. Please try again.");
    }
  };

  /*
   * OPEN ORDER DETAILS
   */
  const openOrder = async (notification: OrderNotification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    setIsOpen(false);
    navigate(`/admin/orders/${notification.orderId}`);
  };

  /*
   * FORMAT DATE
   */
  const formatTime = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title="Notifications"
        onClick={() => setIsOpen((current) => !current)}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EADBD0] bg-white text-[#6F6259] transition hover:border-[#D9B8C1] hover:bg-[#FDF4F6] hover:text-[#B5697A] focus:outline-none focus:ring-2 focus:ring-[#B5697A]/20"
      >
        <Bell
          className="h-[18px] w-[18px]"
          strokeWidth={1.8}
          aria-hidden="true"
        />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#B5697A] px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Order notifications"
          className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-[#EADBD0] bg-white shadow-xl"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#F1E9E1] bg-[#FFFCF8] px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-[#3D3834]">
                Notifications
              </h2>
              <p className="mt-0.5 text-xs text-[#9A8D82]">
                {unreadCount} unread order
                {unreadCount === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => void markAllAsRead()}
                  title="Mark all as read"
                  aria-label="Mark all notifications as read"
                  className="rounded-lg p-2 text-[#8B7A6C] hover:bg-[#FBECEF] hover:text-[#B5697A]"
                >
                  <CheckCheck size={17} />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close notifications"
                className="rounded-lg p-2 text-[#8B7A6C] hover:bg-[#FBECEF] hover:text-[#B5697A]"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {actionError && (
            <p
              role="alert"
              className="border-b border-[#F1E9E1] px-4 py-2 text-xs text-red-600"
            >
              {actionError}
            </p>
          )}

          <div className="max-h-[min(420px,65vh)] overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-[#9A8D82]">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#FBECEF] text-[#B5697A]">
                  <Bell size={20} />
                </span>

                <p className="mt-3 text-sm font-medium text-[#3D3834]">
                  No order notifications
                </p>

                <p className="mt-1 text-xs text-[#9A8D82]">
                  New orders will appear here.
                </p>

                <button
                  type="button"
                  onClick={() => void fetchNotifications()}
                  className="mt-3 text-xs font-semibold text-[#B5697A] hover:underline"
                >
                  Refresh
                </button>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => void openOrder(notification)}
                  className={`flex w-full gap-3 border-b border-[#F7F0E9] px-4 py-4 text-left transition last:border-b-0 hover:bg-[#FFFCF8] ${
                    notification.isRead ? "bg-white" : "bg-[#FDF4F6]"
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FBECEF] text-[#B5697A]">
                    <Package size={18} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="break-all text-xs font-semibold text-[#3D3834]">
                        New order: {notification.orderNumber}
                      </span>

                      {!notification.isRead && (
                        <span
                          className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#B5697A]"
                          aria-label="Unread"
                        />
                      )}
                    </span>

                    <span className="mt-1 block truncate text-xs text-[#766A61]">
                      {notification.customerName}
                    </span>

                    <span className="mt-1 block text-xs font-semibold text-[#1F4A2E]">
                      ₹{notification.totalAmount.toLocaleString("en-IN")}
                    </span>

                    <span className="mt-1 block text-[10px] text-[#9A8D82]">
                      {formatTime(notification.createdAt)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-[#F1E9E1] bg-[#FFFCF8] px-4 py-3">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate("/admin/orders");
              }}
              className="w-full rounded-lg py-2 text-xs font-semibold text-[#B5697A] transition hover:bg-[#FBECEF]"
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
