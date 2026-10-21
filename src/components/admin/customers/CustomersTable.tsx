// src/components/admin/customers/CustomersTable.tsx

import { useState, useMemo, useEffect } from "react";
import type { AdminCustomer } from "./types";
import { formatCustomerDate } from "./customerUtils";
import CustomerVerificationBadge from "./CustomerVerificationBadge";
import { useNavigate } from "react-router-dom";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";

interface CustomersTableProps {
  customers: AdminCustomer[];
}

const ITEMS_PER_PAGE = 20;

function CustomersTable({ customers }: CustomersTableProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Safety check: Agar customers undefined ya null ho
  const safeCustomers = Array.isArray(customers) ? customers : [];

  // Agar customers list change ho (jaise search), toh page 1 pe reset karo
  useEffect(() => {
    setCurrentPage(1);
  }, [safeCustomers.length]);

  // SAFETY FIX: Agar total 0 hai toh bhi kam se kam 1 page toh hoga hi
  const totalPages = Math.max(1, Math.ceil(safeCustomers.length / ITEMS_PER_PAGE));

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return safeCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [safeCustomers, currentPage]);

  const handleViewCustomer = (customerId: number) => {
    navigate(`/admin/customers/${customerId}`);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Pagination Numbers logic (with ellipsis)
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (safeCustomers.length === 0) return null;

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[720px] lg:min-w-[950px]">
          <thead>
            <tr className="border-b border-[#B5697A] bg-[#B5697A]">
              <th className="px-4 py-2.5 text-left sm:px-6">
                <span className="text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]">
                  Customer
                </span>
              </th>

              <th className="px-4 py-2.5 text-left sm:px-6">
                <span className="text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]">
                  Phone
                </span>
              </th>

              {/* EMAIL — mobile pe hide */}
              <th className="hidden px-4 py-2.5 text-left sm:table-cell sm:px-6">
                <span className="text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]">
                  Email
                </span>
              </th>

              <th className="px-4 py-2.5 text-left sm:px-6">
                <span className="text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]">
                  Verified
                </span>
              </th>

              <th className="px-4 py-2.5 text-left sm:px-6">
                <span className="text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]">
                  Orders
                </span>
              </th>

              {/* JOINED — mobile pe hide */}
              <th className="hidden px-4 py-2.5 text-left sm:table-cell sm:px-6">
                <span className="text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]">
                  Joined
                </span>
              </th>

              <th className="px-4 py-2.5 text-right sm:px-6">
                <span className="text-[10px] uppercase text-white/80 sm:text-[11px]">
                  Action
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="
                  border-b
                  border-[#F1E9E1]
                  transition-colors
                  duration-200
                  last:border-0
                  hover:bg-[#FFFBF8]
                "
              >
                {/* CUSTOMER */}
                <td className="px-4 py-3 sm:px-6">
                  <p className="truncate text-[12px] text-gray-600 md:text-[13px]">
                    {customer.name || "Unnamed Customer"}
                  </p>
                </td>

                {/* PHONE */}
                <td className="px-4 py-3 text-[11.5px] text-gray-500 sm:px-6 sm:text-[12.5px]">
                  {customer.phone}
                </td>

                {/* EMAIL — mobile pe hide */}
                <td className="hidden px-4 py-3 text-[11.5px] text-gray-500 sm:table-cell sm:px-6 sm:text-[12.5px]">
                  {customer.email || "—"}
                </td>

                {/* VERIFICATION */}
                <td className="px-4 py-3 sm:px-6">
                  <CustomerVerificationBadge isVerified={customer.isVerified} />
                </td>

                {/* ORDERS */}
                <td className="px-4 py-3 sm:px-6">
                  <span className="text-[12px] text-[#1F4A2E] sm:text-[13px]">
                    {customer.totalOrders?.toLocaleString("en-IN") || 0}
                  </span>
                </td>

                {/* JOINED — mobile pe hide */}
                <td className="hidden px-4 py-3 text-[11.5px] text-gray-500 sm:table-cell sm:px-6 sm:text-[12.5px]">
                  {formatCustomerDate(customer.createdAt)}
                </td>

                {/* ACTION */}
                <td className="px-4 py-3 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={() => handleViewCustomer(customer.id)}
                    aria-label={`View ${customer.name || "customer"}`}
                    title="View customer"
                    className="
                      inline-flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[#D7E2F8]
                      bg-[#F2F6FF]
                      text-[#4D7FEA]
                      hover:border-[#BFD0F5]
                      hover:bg-[#E8F0FF]
                      hover:text-[#3D6ED8]
                      focus:outline-none
                      sm:h-9
                      sm:w-9
                    "
                  >
                    <Eye
                      className="h-[14px] w-[14px] sm:h-[16px] sm:w-[16px]"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          PAGINATION CONTROLS
      ===================================================== */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F1E9E1] bg-white px-4 py-4 sm:px-6">
          
          {/* Showing Info */}
          <p className="text-[11px] sm:text-[12px] text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(currentPage * ITEMS_PER_PAGE, safeCustomers.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {safeCustomers.length}
            </span>{" "}
            customers
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Previous */}
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="
                inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center
                rounded-lg border border-[#EADFD3] bg-white
                text-[#B5697A]
                hover:border-[#B5697A] hover:bg-[#FBEEF1]
                focus:outline-none
                disabled:cursor-not-allowed disabled:opacity-40
                disabled:hover:border-[#EADFD3] disabled:hover:bg-white
              "
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-8 w-6 sm:h-9 sm:w-8 items-center justify-center text-[12px] text-gray-400"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`
                    inline-flex h-8 min-w-[32px] sm:h-9 sm:min-w-[36px]
                    items-center justify-center rounded-lg border px-2
                    text-[12px]
                    focus:outline-none
                    ${
                      page === currentPage
                        ? "border-[#B5697A] bg-[#B5697A] text-white shadow-sm"
                        : "border-[#EADFD3] bg-white text-[#6F6259] hover:border-[#B5697A] hover:text-[#B5697A]"
                    }
                  `}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="
                inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center
                rounded-lg border border-[#EADFD3] bg-white
                text-[#B5697A]
                hover:border-[#B5697A] hover:bg-[#FBEEF1]
                focus:outline-none
                disabled:cursor-not-allowed disabled:opacity-40
                disabled:hover:border-[#EADFD3] disabled:hover:bg-white
              "
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersTable;