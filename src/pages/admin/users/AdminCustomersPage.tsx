// src/pages/admin/customers/AdminCustomersPage.tsx

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
import CustomersToolbar from "../../../components/admin/customers/CustomersToolbar";
import CustomersList from "../../../components/admin/customers/CustomersList";

import type {
  AdminCustomer,
} from "../../../components/admin/customers/types";

function AdminCustomersPage() {
  const [customers, setCustomers] =
    useState<AdminCustomer[]>([]);

  const [search, setSearch] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  /*
   * =========================================================
   * LOAD REAL CUSTOMERS
   * =========================================================
   */

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

  /*
   * =========================================================
   * SUMMARY
   * =========================================================
   */

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

  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const filteredCustomers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return customers;
      }

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

          return (
            name.includes(query) ||
            email.includes(query) ||
            phone.includes(query)
          );
        }
      );
    }, [
      customers,
      search,
    ]);

  /*
   * =========================================================
   * LOADING STATE
   * =========================================================
   */

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#fffaf5] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

        <div className="mx-auto max-w-7xl">

          <CustomersPageHeader />

          <div className="mt-8 rounded-xl border border-[#eadfd3] bg-white p-12 text-center shadow-sm">

            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#eadfd3] border-t-[#8b542f]"
              aria-hidden="true"
            />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading customers...
            </p>

          </div>

        </div>

      </main>
    );
  }

  /*
   * =========================================================
   * ERROR STATE
   * =========================================================
   */

  if (pageError) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#fffaf5] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

        <div className="mx-auto max-w-7xl">

          <CustomersPageHeader />

          <div className="mt-8 rounded-xl border border-red-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              !
            </div>

            <h2 className="mt-5 text-xl rounded-xl text-slate-900">
              Unable to Load Customers
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-600">
              {pageError}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
            >
              Try Again
            </button>

          </div>

        </div>

      </main>
    );
  }

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <div className="min-h-screen bg-[#fffaf5] px-5 py-8 sm:px-6 lg:px-8 lg:py-10">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <CustomersPageHeader />

        {/* =================================================
            SUMMARY
        ================================================= */}

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

        {/* =================================================
            CUSTOMER LIST
        ================================================= */}

        <section className="mt-8 overflow-hidden rounded-xl border border-[#eadfd3] bg-white shadow-sm">

          {/* =================================================
              TOOLBAR
          ================================================= */}

          <CustomersToolbar
            search={search}
            filteredCount={
              filteredCustomers.length
            }
            onSearchChange={
              setSearch
            }
          />

          {/* =================================================
              CUSTOMER LIST
          ================================================= */}

          <CustomersList
            customers={
              filteredCustomers
            }
            hasSearch={
              Boolean(
                search.trim()
              )
            }
            onClearSearch={() =>
              setSearch("")
            }
          />

        </section>

      </div>

    </div>
  );
}

export default AdminCustomersPage;