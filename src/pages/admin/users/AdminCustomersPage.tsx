import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminCustomers,
} from "../../../api/adminUsersApi";

import CustomersPageHeader from "../../../components/admin/customers/CustomersPageHeader";
import CustomerSummaryCards from "../../../components/admin/customers/CustomerSummaryCards";
import CustomerFilters from "../../../components/admin/customers/CustomerFilters";
import CustomersList from "../../../components/admin/customers/CustomersList";

import type {
  AdminCustomer,
} from "../../../components/admin/customers/types";

type VerificationFilter =
  | "all"
  | "verified"
  | "unverified";

type OrdersFilter =
  | "all"
  | "with-orders"
  | "no-orders";

function AdminCustomersPage() {
  const [customers, setCustomers] =
    useState<AdminCustomer[]>([]);

  const [search, setSearch] =
    useState("");

  const [verificationFilter, setVerificationFilter] =
    useState<VerificationFilter>("all");

  const [ordersFilter, setOrdersFilter] =
    useState<OrdersFilter>("all");

  const [isLoading, setIsLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    const loadCustomers = async () => {
      try {
        setIsLoading(true);
        setPageError("");

        const result =
          await getAdminCustomers();

        if (mounted) {
          setCustomers(result);
        }
      } catch (error: any) {
        console.error(
          "Failed to load admin customers:",
          error
        );

        if (mounted) {
          setPageError(
            error?.response?.data?.message ||
              error?.message ||
              "Unable to load customers right now. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCustomers();

    return () => {
      mounted = false;
    };
  }, []);

  const totalCustomers =
    customers.length;

  const verifiedCustomers =
    customers.filter(
      (customer) =>
        customer.isVerified
    ).length;

  const customersWithOrders =
    customers.filter(
      (customer) =>
        customer.totalOrders > 0
    ).length;

  const filteredCustomers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return customers.filter(
        (customer) => {
          const name =
            customer.name
              ?.toLowerCase() || "";

          const email =
            customer.email
              ?.toLowerCase() || "";

          const phone =
            customer.phone.toLowerCase();

          const matchesSearch =
            !query ||
            name.includes(query) ||
            email.includes(query) ||
            phone.includes(query);

          const matchesVerification =
            verificationFilter === "all" ||
            (verificationFilter === "verified" &&
              customer.isVerified) ||
            (verificationFilter === "unverified" &&
              !customer.isVerified);

          const matchesOrders =
            ordersFilter === "all" ||
            (ordersFilter === "with-orders" &&
              customer.totalOrders > 0) ||
            (ordersFilter === "no-orders" &&
              customer.totalOrders === 0);

          return (
            matchesSearch &&
            matchesVerification &&
            matchesOrders
          );
        }
      );
    }, [
      customers,
      search,
      verificationFilter,
      ordersFilter,
    ]);

  const hasActiveFilters =
    Boolean(search.trim()) ||
    verificationFilter !== "all" ||
    ordersFilter !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setVerificationFilter("all");
    setOrdersFilter("all");
  };

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-white px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <CustomersPageHeader />

          <div className="mt-8 rounded-2xl border border-[#EFE3D2] bg-white p-12 text-center shadow-[0_2px_10px_rgba(31,74,46,0.035)]">
            <div
              className="
                mx-auto
                h-8
                w-8
                animate-spin
                rounded-full
                border-2
                border-[#EADBD0]
                border-t-[#B5697A]
              "
              aria-hidden="true"
            />

            <p className="mt-4 text-sm font-medium text-[#7B6D63]">
              Loading customers...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (pageError) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-white px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <CustomersPageHeader />

          <div className="mt-8 rounded-2xl border border-[#E8C8CE] bg-white p-10 text-center shadow-[0_2px_10px_rgba(31,74,46,0.035)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBECEF] text-[#A85F70]">
              !
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#3D3834]">
              Unable to Load Customers
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#A85F70]">
              {pageError}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white px-5 py-2 sm:px-6 lg:px-8 lg:py-4">
      <div className="mx-auto max-w-7xl">
        <CustomersPageHeader />

        {/* Summary */}
        <CustomerSummaryCards
          totalCustomers={
            totalCustomers
          }
          verifiedCustomers={
            verifiedCustomers
          }
          customersWithOrders={
            customersWithOrders
          }
        />

        {/* Search & Filters */}
        <CustomerFilters
          search={search}
          onSearchChange={setSearch}
          verificationFilter={
            verificationFilter
          }
          onVerificationFilterChange={
            setVerificationFilter
          }
          ordersFilter={ordersFilter}
          onOrdersFilterChange={
            setOrdersFilter
          }
          hasActiveFilters={
            hasActiveFilters
          }
          onClear={
            handleClearFilters
          }
        />

        {/* Customer List */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-[#EFE3D2] bg-white shadow-[0_2px_10px_rgba(31,74,46,0.035)]">
          <CustomersList
            customers={
              filteredCustomers
            }
            hasSearch={
              hasActiveFilters
            }
            onClearSearch={
              handleClearFilters
            }
          />
        </section>
      </div>
    </div>
  );
}

export default AdminCustomersPage;