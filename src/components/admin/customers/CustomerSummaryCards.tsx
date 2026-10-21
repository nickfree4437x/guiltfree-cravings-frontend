import {
  Users,
  ShieldCheck,
  ShieldAlert,
  ShoppingBag,
} from "lucide-react";

interface CustomerSummaryCardsProps {
  totalCustomers: number;
  verifiedCustomers: number;
  customersWithOrders: number;
}

function CustomerSummaryCards({
  totalCustomers,
  verifiedCustomers,
  customersWithOrders,
}: CustomerSummaryCardsProps) {
  const unverifiedCustomers = Math.max(
    totalCustomers - verifiedCustomers,
    0
  );

  // Icon, colors, aur labels ka data structure
  const cards = [
    {
      label: "Total Customers",
      value: totalCustomers,
      icon: Users,
      iconBg: "bg-[#FBECEF]",
      iconColor: "text-[#B5697A]",
      textColor: "text-[#B5697A]",
    },
    {
      label: "Verified",
      value: verifiedCustomers,
      icon: ShieldCheck,
      iconBg: "bg-[#EEF8F2]",
      iconColor: "text-[#3F8A58]",
      textColor: "text-[#3F8A58]",
    },
    {
      label: "Unverified",
      value: unverifiedCustomers,
      icon: ShieldAlert,
      iconBg: "bg-[#FFF3E8]",
      iconColor: "text-[#C4773B]",
      textColor: "text-[#C4773B]",
    },
    {
      label: "With Orders",
      value: customersWithOrders,
      icon: ShoppingBag,
      iconBg: "bg-[#EEF5FF]",
      iconColor: "text-[#4D7FEA]",
      textColor: "text-[#4D7FEA]",
    },
  ];

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Text Content */}
              <div className="min-w-0">
                <p className="text-[11px] md:text-[12px] tracking-wide text-gray-500 uppercase">
                  {card.label}
                </p>

                <p
                  className={`mt-2 text-[28px] font-bold leading-none tracking-[-0.02em] ${card.textColor}`}
                >
                  {card.value.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Icon */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
              >
                <Icon
                  className="h-[18px] w-[18px]"
                  strokeWidth={1.8}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CustomerSummaryCards;