
import { Link, useLocation, matchPath } from "react-router-dom";
import { useBreadcrumb } from "../../context/BreadcrumbContext";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const Breadcrumb = () => {
  const location = useLocation();
  const { dynamicLabel } = useBreadcrumb();

  const pathname = location.pathname;

  const routes: Record<string, BreadcrumbItem[]> = {
    "/checkout": [
      { label: "Home", path: "/" },
      { label: "Checkout" },
    ],
    "/payment-result": [
      { label: "Home", path: "/" },
      { label: "Payment Status" },
    ],
    "/order-success": [
      { label: "Home", path: "/" },
      { label: "Order Confirmation" },
    ],
    "/orders": [
      { label: "Home", path: "/" },
      { label: "My Account", path: "/account" },
      { label: "My Orders" },
    ],
    "/order-history": [
      { label: "Home", path: "/" },
      { label: "My Account", path: "/account" },
      { label: "Order History" },
    ],
    "/transactions": [
      { label: "Home", path: "/" },
      { label: "My Account", path: "/account" },
      { label: "My Transactions" },
    ],
    "/my-issues": [
      { label: "Home", path: "/" },
      { label: "My Account", path: "/account" },
      { label: "My Issues" },
    ],
    "/account": [
      { label: "Home", path: "/" },
      { label: "My Account" },
    ],
    "/profile": [
      { label: "Home", path: "/" },
      { label: "My Account", path: "/account" },
      { label: "My Profile" },
    ],
    "/wishlist": [
      { label: "Home", path: "/" },
      { label: "Wishlist" },
    ],
    "/coupons": [
      { label: "Home", path: "/" },
      { label: "Coupons" },
    ],
    "/privacy-policy": [
      { label: "Home", path: "/" },
      { label: "Privacy Policy" },
    ],
    "/terms-and-conditions": [
      { label: "Home", path: "/" },
      { label: "Terms & Conditions" },
    ],
  };

  let breadcrumbs = routes[pathname] || [];

  const isProductPage = matchPath(
    { path: "/products/:id", end: true },
    pathname
  );

  if (isProductPage) {
    breadcrumbs = [
      { label: "Home", path: "/" },
      { label: dynamicLabel || "Product Details" },
    ];
  }

  const isOrderDetailsPage = matchPath(
    { path: "/orders/:orderId", end: true },
    pathname
  );

  if (isOrderDetailsPage) {
    breadcrumbs = [
      { label: "Home", path: "/" },
      { label: "My Orders", path: "/orders" },
      { label: dynamicLabel || "Order Details" },
    ];
  }

  if (breadcrumbs.length === 0) return null;

  
return (
  <div className="relative z-10 w-full bg-white">
    <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-4 pt-5 md:pt-8 pb-2 md:pb-3 sm:px-6 lg:px-24"
        >
      <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-[11px] sm:gap-2.5 sm:text-[13px]">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex shrink-0 items-center gap-2 sm:gap-2.5"
            >
              {index > 0 && (
                <span
                  className="select-none text-[13px] text-[#C9788B]"
                  aria-hidden="true"
                >
                  &gt;
                </span>
              )}

              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="font-normal text-slate-600 transition-colors duration-200 hover:text-[#B5697A] hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current="page"
                  className="max-w-[220px] truncate text-[#B5697A] sm:max-w-none"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  </div>
);

};

export default Breadcrumb;
