import {
  ArrowUpRight,
  Gift,
  PackagePlus,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

interface QuickAction {
  label: string;
  description: string;
  path: string;
  icon: typeof PackagePlus;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Add Product",
    description: "Create a new product",
    path: "/admin/products",
    icon: PackagePlus,
    iconBg: "bg-[#f3e4d3]",
    iconColor: "text-[#8b542f]",
    hoverBorder: "hover:border-[#d8bfa9]",
  },
  {
    label: "View Orders",
    description: "Manage customer orders",
    path: "/admin/orders",
    icon: ShoppingBag,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    hoverBorder: "hover:border-blue-200",
  },
  {
    label: "Customers",
    description: "Manage your customers",
    path: "/admin/users",
    icon: Users,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    hoverBorder: "hover:border-violet-200",
  },
  {
    label: "Create Offer",
    description: "Create a new promotion",
    path: "/admin/offers",
    icon: Gift,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    hoverBorder: "hover:border-emerald-200",
  },
];

function QuickActions() {
  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          Quick Actions
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.path}
              to={action.path}
              className={`group relative overflow-hidden rounded-2xl bg-white p-5 transition-all duration-300 ${action.hoverBorder}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconBg} ${action.iconColor}`}
                >
                  <Icon
                    className="h-[21px] w-[21px]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-[12px] md:text-[14px] font-semibold text-slate-900">
                  {action.label}
                </h3>

                <p className="mt-1 text-xs font-[350] leading-5 text-slate-400">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default QuickActions;