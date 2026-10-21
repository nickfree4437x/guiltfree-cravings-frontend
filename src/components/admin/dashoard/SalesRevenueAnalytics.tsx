
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

  const metrics = [
    {
      label: "Paid Revenue",
      value: currencyFormatter.format(data?.revenue ?? 0),
      description: "From paid, non-cancelled orders",
      icon: IndianRupee,
    },
    {
      label: "Paid Orders",
      value: numberFormatter.format(data?.paidOrders ?? 0),
      description: "Successfully paid orders",
      icon: ShoppingBag,
    },
    {
      label: "Average Order Value",
      value: currencyFormatter.format(
        data?.averageOrderValue ?? 0
      ),
      description: "Average per paid order",
      icon: TrendingUp,
    },
    {
      label: "Total Orders",
      value: numberFormatter.format(data?.totalOrders ?? 0),
      description: `Orders created in ${period} days`,
      icon: ChartColumnIncreasing,
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

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-xl border border-[#EAD9DC] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] md:text-[12px] text-slate-500">
                    {metric.label}
                  </p>

                  <p className="mt-3 break-words text-2xl font-semibold tracking-tight text-[#3B252C]">
                    {isLoading ? "—" : metric.value}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8EBEF] text-[#824958]">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {metric.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* REVENUE BAR CHART */}
      <div className="overflow-hidden rounded-xl border border-[#EAD9DC] bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-[#F0E3E6] px-5 py-4 sm:px-6">
          <h3 className="text-[12px] md:text-[14px] font-semibold text-gray-700">
            Daily Revenue
          </h3>
          <p className="text-[11px] md:text-[12px] text-slate-500">
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
          <div className="px-4 py-6 sm:px-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-600">
                Revenue (₹)
              </span>

              <span className="text-sm text-[#824958]">
                Total: {currencyFormatter.format(data?.revenue ?? 0)}
              </span>
            </div>

            <div className="flex h-[230px] gap-2 sm:gap-4">
              {/* Y-AXIS LABELS */}
              <div className="flex w-[54px] shrink-0 flex-col justify-between pb-7 text-right text-[10px] text-[#927D83] sm:w-[68px] sm:text-xs">
                <span>
                  {currencyFormatter.format(maxRevenue)}
                </span>
                <span>
                  {currencyFormatter.format(maxRevenue / 2)}
                </span>
                <span>₹0</span>
              </div>

              {/* BARS */}
              <div className="relative flex min-w-0 flex-1">
                <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[190px] flex-col justify-between">
                  <div className="border-t border-dashed border-[#EAD9DC]" />
                  <div className="border-t border-dashed border-[#EAD9DC]" />
                  <div className="border-t border-[#EAD9DC]" />
                </div>

                <div className="relative z-10 flex h-full min-w-0 flex-1 items-stretch justify-around gap-1 sm:gap-2">
                  {dailyRevenue.map((item) => {
                    const barHeight =
                      maxRevenue > 0
                        ? (item.revenue / maxRevenue) * 180
                        : 0;

                    return (
                      <div
                        key={item.date}
                        className="flex min-w-0 flex-1 flex-col items-center"
                      >
                        <div className="flex h-[190px] w-full items-end justify-center">
                          <div
                            title={`${formatDate(item.date, period)}: ${currencyFormatter.format(item.revenue)}`}
                            className={`w-full max-w-8 rounded-t-md transition-all duration-300 ${
                              item.revenue > 0
                                ? "bg-[#B5697A] hover:bg-[#824958]"
                                : "bg-[#F0E3E6]"
                            }`}
                            style={{
                              height:
                                item.revenue > 0
                                  ? `${Math.max(barHeight, 4)}px`
                                  : "3px",
                            }}
                          />
                        </div>

                        <span className="mt-2 whitespace-nowrap text-[9px] text-[#76666A] sm:text-[11px]">
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
