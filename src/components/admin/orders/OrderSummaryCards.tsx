// src/components/admin/orders/OrderSummaryCards.tsx

import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  ShoppingBag,
} from "lucide-react";

interface OrderSummaryCardsProps {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  completedOrders: number;
}

const cards = [
  {
    key: "total",
    label: "Total Orders",
    description: "All customer orders",
    icon: ShoppingBag,
    iconBg: "bg-[#FBECEF]",
    iconColor: "text-[#B5697A]",
    valueColor: "text-[#1F4A2E]",
    accent: "bg-[#D99AA9]",
  },
  {
    key: "pending",
    label: "Pending",
    description: "Awaiting confirmation",
    icon: Clock3,
    iconBg: "bg-[#FFF3E8]",
    iconColor: "text-[#C4773B]",
    valueColor: "text-[#C4773B]",
    accent: "bg-[#E2AD7C]",
  },
  {
    key: "paid",
    label: "Paid Orders",
    description: "Successfully paid",
    icon: CheckCircle2,
    iconBg: "bg-[#EEF8F2]",
    iconColor: "text-[#3F8A58]",
    valueColor: "text-[#3F8A58]",
    accent: "bg-[#91C5A0]",
  },
  {
    key: "completed",
    label: "Completed",
    description: "Successfully completed",
    icon: ClipboardList,
    iconBg: "bg-[#F2F6FF]",
    iconColor: "text-[#4D7FEA]",
    valueColor: "text-[#4D7FEA]",
    accent: "bg-[#91B4F4]",
  },
] as const;

function OrderSummaryCards({
  totalOrders,
  pendingOrders,
  paidOrders,
  completedOrders,
}: OrderSummaryCardsProps) {
  const values = {
    total: totalOrders,
    pending: pendingOrders,
    paid: paidOrders,
    completed: completedOrders,
  };

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="group relative overflow-hidden rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm sm:p-6"
          >

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] tracking-[0.08em] text-[#9A8D82]">
                  {card.label}
                </p>

                <p
                  className={`mt-3 text-[29px] font-bold leading-none tracking-[-0.02em] ${card.valueColor}`}
                >
                  {values[card.key].toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="mt-2 text-[12px] text-[#8B7A6C]">
                  {card.description}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}
              >
                <Icon
                  className="h-[21px] w-[21px]"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrderSummaryCards;