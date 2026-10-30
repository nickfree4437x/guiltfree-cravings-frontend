import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  Payment,
  PaymentSummary,
  Pagination,
  PaymentsResponse,
  StatusFilter,
} from "../components/admin/payments/types";
import { getAdminToken } from "../components/admin/payments/paymentUtils";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://guiltfreecravings.com/api"
).replace(/\/+$/, "");

const PAGE_SIZE = 10;

const EMPTY_SUMMARY: PaymentSummary = {
  total: 0,
  paid: 0,
  pending: 0,
  failed: 0,
  refunded: 0,
  paidAmount: 0,
  paidAmountCurrency: "INR",
};

export function useAdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary>(EMPTY_SUMMARY);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  const [loading, setLoading] = useState(true); // Initial loading ke liye
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchPayments = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;
      
      // Silent mode mein loading true nahi karte, sirf refreshing true karte hain
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const token = getAdminToken();
        if (!token) throw new Error("Admin login token nahi mila. Please login again.");

        const params = new URLSearchParams({
          page: String(pagination.page),
          pageSize: String(PAGE_SIZE),
          status,
        });

        if (search) params.set("search", search);

        const response = await fetch(
          `${API_BASE_URL}/admin/payments?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let result: PaymentsResponse;
        try {
          result = (await response.json()) as PaymentsResponse;
        } catch {
          throw new Error("Server se valid response nahi mila. Please try again.");
        }

        if (!response.ok || !result.success || !result.data) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Admin session invalid ya expired hai. Please login again.");
          }
          throw new Error(result.message || "Payments load nahi ho paaye.");
        }

        setPayments(result.data.payments);
        setSummary(result.data.summary);
        setPagination((current) => {
          const next = result.data!.pagination;
          const unchanged =
            current.page === next.page &&
            current.pageSize === next.pageSize &&
            current.total === next.total &&
            current.totalPages === next.totalPages &&
            current.hasNextPage === next.hasNextPage &&
            current.hasPreviousPage === next.hasPreviousPage;
          return unchanged ? current : next;
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading payments."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [pagination.page, search, status]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  // ✅ FIX: Agar pehle se data hai (yani pagination change hua hai), toh silent mode mein fetch karo
  useEffect(() => {
    // Agar list mein pehle se data hai, matlab user Next/Previous pe click kar raha hai
    // toh background mein fetch karo taaki blink na ho.
    const isBackgroundFetch = payments.length > 0;
    void fetchPayments({ silent: isBackgroundFetch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPayments]);

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value);
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const handleRefresh = () => void fetchPayments({ silent: true });

  const setPage = (page: number) => setPagination((current) => ({ ...current, page }));

  // ✅ Client-side Date Filter
  const filteredPayments = useMemo(() => {
    if (dateFilter === "ALL") return payments;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

    return payments.filter((p) => {
      const pDate = new Date(p.createdAt).getTime();
      if (Number.isNaN(pDate)) return false;

      switch (dateFilter) {
        case "TODAY":
          return pDate >= startOfToday;
        case "YESTERDAY":
          return pDate >= startOfYesterday && pDate < startOfToday;
        case "LAST_7_DAYS":
          return pDate >= startOfToday - 7 * 24 * 60 * 60 * 1000;
        case "LAST_30_DAYS":
          return pDate >= startOfToday - 30 * 24 * 60 * 60 * 1000;
        case "THIS_MONTH":
          return pDate >= new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        default:
          return true;
      }
    });
  }, [payments, dateFilter]);

  return {
    payments: filteredPayments,
    summary,
    pagination,
    searchInput,
    status,
    dateFilter,
    loading,
    refreshing,
    error,
    handleStatusChange,
    handleSearchChange,
    handleDateChange,
    handleRefresh,
    setPage,
    fetchPayments,
  };
}