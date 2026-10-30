import { useEffect, useState } from "react";
import {
  getSalesAnalytics,
  type AdminSalesAnalytics,
} from "../../../api/adminDashboardApi";
import {
  ChartColumnIncreasing,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

type Period = 7 | 30;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

function formatDate(dateString: string, period: Period) {
  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: period === 7 ? "short" : undefined,
  });
}

// ─── BIG Color Palette for 30 Days (Different for each bar) ─────────
const BAR_COLORS = [
  "bg-[#B5697A] hover:bg-[#9C5263]", // Rose
  "bg-[#4D7FEA] hover:bg-[#3D6ED8]", // Blue
  "bg-[#3F8A58] hover:bg-[#34764A]", // Green
  "bg-[#C4773B] hover:bg-[#A8622F]", // Amber
  "bg-[#8062C7] hover:bg-[#6B4EAF]", // Purple
  "bg-[#E55353] hover:bg-[#D14242]", // Red
  "bg-[#2CA6A4] hover:bg-[#238C8A]", // Teal
  "bg-[#F2A900] hover:bg-[#D49400]", // Yellow
  "bg-[#E87C9C] hover:bg-[#D06787]", // Pink
  "bg-[#5C6BC0] hover:bg-[#4A58A8]", // Indigo
  "bg-[#8BC34A] hover:bg-[#78AB3A]", // Light Green
  "bg-[#FF7043] hover:bg-[#E56034]", // Deep Orange
  "bg-[#26A69A] hover:bg-[#1F8E83]", // Mint
  "bg-[#AB47BC] hover:bg-[#933BA3]", // Light Purple
  "bg-[#42A5F5] hover:bg-[#2B93E0]", // Light Blue
];

function SalesRevenueAnalytics() {
  const [period, setPeriod] = useState<Period>(7);
  const [data, setData] = useState<AdminSalesAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getSalesAnalytics(period);

        if (mounted) {
          setData(result);
        }
      } catch (err: any) {
        console.error("Failed to load sales analytics:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load sales analytics."
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAnalytics();

    return () => {
      mounted = false;
    };
  }, [period]);

  const dailyRevenue = data?.dailyRevenue ?? [];
  const maxRevenue = Math.max(
    ...dailyRevenue.map((item) => item.revenue),
    0
  );

  // ─── KPI Metrics with Different Colors ─────────────────────────
  const metrics = [
    {
      label: "Paid Revenue",
      value: currencyFormatter.format(data?.revenue ?? 0),
      description: "From paid, non-cancelled orders",
      icon: IndianRupee,
      iconBg: "bg-[#FBECEF]",
      iconColor: "text-[#B5697A]",
    },
    {
      label: "Paid Orders",
      value: numberFormatter.format(data?.paidOrders ?? 0),
      description: "Successfully paid orders",
      icon: ShoppingBag,
      iconBg: "bg-[#EEF5FF]",
      iconColor: "text-[#4D7FEA]",
    },
    {
      label: "Average Order Value",
      value: currencyFormatter.format(
        data?.averageOrderValue ?? 0
      ),
      description: "Average per paid order",
      icon: TrendingUp,
      iconBg: "bg-[#EEF8F2]",
      iconColor: "text-[#3F8A58]",
    },
    {
      label: "Total Orders",
      value: numberFormatter.format(data?.totalOrders ?? 0),
      description: `Orders created in ${period} days`,
      icon: ChartColumnIncreasing,
      iconBg: "bg-[#FFF3E8]",
      iconColor: "text-[#C4773B]",
    },
  ];

  return (
    <section
      aria-labelledby="sales-analytics-heading"
      className="space-y-5"
    >
      {/* SECTION HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="sales-analytics-heading"
            className="text-[16px] md:text-[18px] font-semibold tracking-[-0.01em] text-gray-700"
          >
            Sales &amp; Revenue
          </h2>
          <p className="mt-0 text-[11px] md:text-[12px] text-slate-500">
            Track your store's revenue and order performance.
          </p>
        </div>

        <div
          className="inline-flex w-fit rounded-xl border border-[#EAD9DC] bg-white p-1"
          aria-label="Analytics date range"
        >
          {([7, 30] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setPeriod(days)}
              aria-pressed={period === days}
              className={`rounded-lg px-4 py-1.5 text-[11px] md:text-[12px] transition ${
                period === days
                  ? "bg-[#B5697A] text-white shadow-sm"
                  : "text-[#B5697A] hover:bg-[#FFFAF8]"
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => setPeriod((current) => current)}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          KPI CARDS
      ===================================================== */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-xl border border-[#EAD9DC] bg-white p-3.5 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] tracking-wide text-slate-500 sm:text-[11px] md:text-[12px]">
                    {metric.label}
                  </p>

                  <p className="mt-3 text-[20px]
              font-semibold
              leading-none
              tracking-[-0.02em]
              text-gray-700
              sm:text-[25px]">
                    {isLoading ? "—" : metric.value}
                  </p>
                </div>

                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${metric.iconBg} ${metric.iconColor}`}
                >
                  <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.8} />
                </div>
              </div>

              <p className="mt-1.5 text-[10px] leading-tight text-slate-500 sm:mt-2 sm:text-xs">
                {metric.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          REVENUE BAR CHART (Multi-Color & Responsive)
      ===================================================== */}
      <div className="overflow-hidden rounded-xl border border-[#EAD9DC] bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-[#F0E3E6] px-4 py-3 sm:px-6 sm:py-4">
          <h3 className="text-[13px] font-semibold text-gray-700 sm:text-[14px]">
            Daily Revenue
          </h3>
          <p className="text-[10px] text-slate-500 sm:text-[12px]">
            Revenue from paid, non-cancelled orders
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#EAD9DC] border-t-[#824958]" />
              <p className="mt-3 text-sm text-[#76666A]">
                Loading revenue data...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[220px] items-center justify-center px-5 text-center">
            <p className="text-sm text-slate-500">
              Revenue chart is unavailable. Please retry.
            </p>
          </div>
        ) : dailyRevenue.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center px-5 text-center">
            <p className="text-sm text-slate-500">
              No daily revenue data is available for this period.
            </p>
          </div>
        ) : (
          <div className="px-3 py-5 sm:px-6 sm:py-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-gray-600 sm:text-xs">
                Revenue (₹)
              </span>
              <span className="text-[12px] text-[#824958] sm:text-[13px]">
                Total: {currencyFormatter.format(data?.revenue ?? 0)}
              </span>
            </div>

            {/* Chart Container */}
            <div className="flex h-[200px] gap-2 sm:h-[250px] sm:gap-4">
              
              {/* Y-AXIS LABELS */}
              <div className="flex w-[40px] shrink-0 flex-col justify-between pb-6 text-right text-[9px] text-slate-500 sm:w-[65px] sm:pb-7 sm:text-xs">
                <span>{currencyFormatter.format(maxRevenue)}</span>
                <span>{currencyFormatter.format(maxRevenue / 2)}</span>
                <span>₹0</span>
              </div>

              {/* BARS */}
              <div className="relative flex min-w-0 flex-1">
                {/* Background Grid Lines */}
                <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[160px] flex-col justify-between sm:h-[210px]">
                  <div className="border-t border-dashed border-[#EAD9DC]" />
                  <div className="border-t border-dashed border-[#EAD9DC]" />
                  <div className="border-t border-[#EAD9DC]" />
                </div>

                {/* Bars Wrapper */}
                <div className="relative z-10 flex h-full min-w-0 flex-1 items-stretch justify-around gap-0.5 sm:gap-2">
                  {dailyRevenue.map((item, index) => {
                    const barHeight =
                      maxRevenue > 0
                        ? (item.revenue / maxRevenue) * 100
                        : 0;
                    
                    // Har bar ke liye different color pick karo based on index
                    const colorClass = BAR_COLORS[index % BAR_COLORS.length];

                    return (
                      <div
                        key={item.date}
                        className="flex min-w-0 flex-1 flex-col items-center"
                      >
                        <div className="flex h-[160px] w-full items-end justify-center sm:h-[210px]">
                          <div
                            title={`${formatDate(item.date, period)}: ${currencyFormatter.format(item.revenue)}`}
                            className={`w-full max-w-[20px] rounded-t-md transition-all duration-300 sm:max-w-[28px] ${
                              item.revenue > 0
                                ? colorClass
                                : "bg-[#F0E3E6]"
                            }`}
                            style={{
                              height:
                                item.revenue > 0
                                  ? `${Math.max(barHeight, 6)}%`
                                  : "3px",
                            }}
                          />
                        </div>

                        {/* 30 Days ke liye labels thode chhote aur rotate kiye taaki squeeze na ho */}
                        <span className="mt-2 text-[7px] font-medium text-slate-500 sm:text-[10px] whitespace-nowrap">
                          {formatDate(item.date, period)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {maxRevenue === 0 && (
              <p className="mt-5 rounded-xl bg-[#FFFAF8] px-4 py-3 text-center text-[11px] md:text-[12px] text-slate-500">
                No paid revenue recorded in this period yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default SalesRevenueAnalytics;