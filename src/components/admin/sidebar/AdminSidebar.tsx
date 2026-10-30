import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Gift,
  MessageSquareText,
  CircleAlert,
  X,
} from "lucide-react";

import { useAdminAuthStore } from "../../../store/adminAuthStore";

// ─── Types ────────────────────────────────────────────────
interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// ─── Nav config ───────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} strokeWidth={1.8} /> },
  { label: "Products", path: "/admin/products", icon: <Package size={18} strokeWidth={1.8} /> },
  { label: "Orders", path: "/admin/orders", icon: <ShoppingBag size={18} strokeWidth={1.8} /> },
  { label: "Customers", path: "/admin/users", icon: <Users size={18} strokeWidth={1.8} /> },
  { label: "Payments", path: "/admin/payments", icon: <CreditCard size={18} strokeWidth={1.8} /> },
  // { label: "Analytics", path: "/admin/analytics", icon: <BarChart3 size={18} strokeWidth={1.8} /> },
  { label: "Reviews", path: "/admin/reviews", icon: <MessageSquareText size={18} strokeWidth={1.8} /> },
  { label: "Order Issues", path: "/admin/order-issues", icon: <CircleAlert size={18} strokeWidth={1.8} /> },
  { label: "Offers", path: "/admin/offers", icon: <Gift size={18} strokeWidth={1.8} /> },
  { label: "Settings", path: "/admin/settings", icon: <Settings size={18} strokeWidth={1.8} /> },
];

// ─── Brand ────────────────────────────────────────────────
function Brand({ size = "lg" }: { size?: "sm" | "lg" }) {
  const isSm = size === "sm";
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center bg-[#B5697A] text-white shadow-sm ${isSm ? "rounded-xl" : "rounded-lg"}`}>
        <span className="text-[11px] font-bold tracking-wide">GFC</span>
      </div>
      <div className="min-w-0">
        <p className={`font-semibold ${isSm ? "text-[16px] text-gray-700" : "text-[18px] text-gray-600"}`}>
          Admin Panel
        </p>
      </div>
    </div>
  );
}

// ─── Nav Links ────────────────────────────────────────────
function NavLinks({ variant, onNavigate }: { variant: "mobile" | "desktop"; onNavigate?: () => void }) {
  const isMobile = variant === "mobile";
  return (
    <div className="space-y-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-lg px-3 py-1.5 focus:outline-none ${
              isMobile ? "text-[13px]" : "text-[13.5px]"
            } ${
              isActive
                ? isMobile
                  ? "bg-[#B5697A] text-white shadow-sm font-[350]"
                  : "bg-[#B5697A] text-white"
                : "text-gray-500 hover:bg-[#FBEEF1] hover:text-[#B5697A]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                  isMobile ? "h-7 w-7" : "h-8 w-8"
                } ${
                  isActive ? "text-white" : "text-gray-500 group-hover:text-[#B5697A]"
                }`}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}

// ─── Logout Button ────────────────────────────────────────
function LogoutButton({ onClick, variant }: { onClick: () => void; variant: "mobile" | "desktop" }) {
  const isMobile = variant === "mobile";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg bg-[#FBEEF1] text-[#B5697A] transition-all duration-200 hover:bg-[#F7DDE3] focus:outline-none ${
        isMobile ? "px-3 py-2 text-[13.5px]" : "px-3 py-1.5 text-[13px]"
      }`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#B5697A]">
        <LogOut size={17} strokeWidth={1.8} />
      </span>
      <span>Logout</span>
    </button>
  );
}

// ─── Component ────────────────────────────────────────────
function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const logout = useAdminAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate("/admin", { replace: true });
  };

  // ─── Render ─────────────────────────────────────────────
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-[#1F4A2E]/20 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[#F0E3E5] bg-white shadow transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Brand + close */}
        <div className="flex items-center justify-between px-5 py-4">
          <Brand size="sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#EADBD0] bg-white text-[#6F6259] hover:border-[#D9B8C1] hover:bg-[#FDF4F6] hover:text-[#B5697A] focus:outline-none"
          >
            <X size={15} strokeWidth={1.8} />
          </button>
        </div>

        <div className="border-t border-[#F0E3E5]" />

        <nav className="admin-sidebar-scroll flex-1 overflow-y-auto px-3 py-5">
          <NavLinks variant="mobile" onNavigate={onClose} />
        </nav>

        <div className="border-t border-[#F0E3E5] px-3 py-4">
          <LogoutButton onClick={handleLogout} variant="mobile" />
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-[248px] shrink-0 border-r border-[#F0E3E5] bg-white lg:flex lg:flex-col lg:relative lg:z-10 lg:shadow-md">
        <div className="px-5 py-4">
          <Brand />
        </div>

        <div className="border-t border-[#F0E3E5]" />

        <nav className="admin-sidebar-scroll flex-1 overflow-y-auto px-3 py-5">
          <NavLinks variant="desktop" />
        </nav>

        <div className="border-t border-[#F0E3E5] px-3 py-4">
          <LogoutButton onClick={handleLogout} variant="desktop" />
        </div>
      </aside>

      {/* Scrollbar styles */}
      <style>{`
        .admin-sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .admin-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .admin-sidebar-scroll::-webkit-scrollbar-thumb { background: #ead9dd; border-radius: 999px; }
        .admin-sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #d9b7c0; }
      `}</style>
    </>
  );
}

export default AdminSidebar;