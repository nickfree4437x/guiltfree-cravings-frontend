import {
  ArrowRight,
  Gift,
  PackagePlus,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

interface QuickAction {
  label: string;
  path: string;
  icon: typeof PackagePlus;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Add Product",
    path: "/admin/products",
    icon: PackagePlus,
    iconBg: "bg-[#EAF2FF]",
    iconColor: "text-[#4D7FEA]",
    hoverBorder: "hover:border-[#C9DAFA]",
  },
  {
    label: "View Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
    iconBg: "bg-[#FBECEF]",
    iconColor: "text-[#B5697A]",
    hoverBorder: "hover:border-[#E6C5CC]",
  },
  {
    label: "Customers",
    path: "/admin/users",
    icon: Users,
    iconBg: "bg-[#F2EBFF]",
    iconColor: "text-[#8A5BE8]",
    hoverBorder: "hover:border-[#DCCEF5]",
  },
  {
    label: "Create Offer",
    path: "/admin/offers",
    icon: Gift,
    iconBg: "bg-[#E9F9EF]",
    iconColor: "text-[#35A85A]",
    hoverBorder: "hover:border-[#C9E8D3]",
  },
];

function QuickActions() {
  return (
    <section className="mt-6 rounded-lg bg-white">
      {/* Section Header */}
      <div className="mb-2">
        <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-[#1F4A2E]">
          Quick Actions
        </h2>
      </div>

      {/* Actions */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.path}
              to={action.path}
              className={`
                group
                flex
                min-h-[168px]
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-[#E8E1D9]
                bg-white
                px-5
                py-5
                text-center
                transition-all
                duration-300
                hover:-translate-y-0.5
                ${action.hoverBorder}
              `}
            >
              {/* Icon */}
              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  ${action.iconBg}
                  ${action.iconColor}
                `}
              >
                <Icon
                  className="h-[22px] w-[22px]"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              {/* Label */}
              <h3 className="mt-2 text-[15px] tracking-[-0.01em] text-[#31415A]">
                {action.label}
              </h3>

              {/* Arrow */}
              <div className="mt-2 flex items-center justify-center text-[#AAB1BA] transition-all duration-300 group-hover:text-[#B5697A]">
                <ArrowRight
                  className="h-[18px] w-[18px]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default QuickActions;