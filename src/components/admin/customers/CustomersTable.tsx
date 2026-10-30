// src/components/admin/customers/CustomersTable.tsx

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";

import type { AdminCustomer } from "./types";
import { formatCustomerDate } from "./customerUtils";
import CustomerVerificationBadge from "./CustomerVerificationBadge";

// ─── Types ────────────────────────────────────────────────
interface CustomersTableProps {
  customers: AdminCustomer[];
}

// ─── Config ───────────────────────────────────────────────
const ITEMS_PER_PAGE = 20;

const TH_CLASS = "px-4 py-2.5 text-left sm:px-6";
const TH_TEXT = "text-[10px] font-[450] uppercase tracking-[0.08em] text-white sm:text-[11px]";
const TD_TEXT = "text-[11.5px] text-gray-500 sm:text-[12.5px]";
const NAV_BTN = "inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-[#EADFD3] bg-white text-[#B5697A] hover:border-[#B5697A] hover:bg-[#FBEEF1] focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#EADFD3] disabled:hover:bg-white";

// ─── Sub-component: Nav Button ────────────────────────────
function NavButton({ direction, onClick, disabled }: { direction: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={direction === "prev" ? "Previous page" : "Next page"} className={NAV_BTN}>
      <Icon size={16} strokeWidth={2} />
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────
function CustomersTable({ customers }: CustomersTableProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Safety check
  const safeCustomers = Array.isArray(customers) ? customers : [];

  // Reset page on data change
  useEffect(() => {
    setCurrentPage(1);
  }, [safeCustomers.length]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(safeCustomers.length / ITEMS_PER_PAGE));
  
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return safeCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [safeCustomers, currentPage]);

  const handleViewCustomer = (customerId: number) => navigate(`/admin/customers/${customerId}`);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Page numbers with ellipsis
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
              <th className={TH_CLASS}><span className={TH_TEXT}>Customer</span></th>
              <th className={TH_CLASS}><span className={TH_TEXT}>Phone</span></th>
              <th className={`hidden sm:table-cell ${TH_CLASS}`}><span className={TH_TEXT}>Email</span></th>
              <th className={TH_CLASS}><span className={TH_TEXT}>Verified</span></th>
              <th className={TH_CLASS}><span className={TH_TEXT}>Orders</span></th>
              <th className={`hidden sm:table-cell ${TH_CLASS}`}><span className={TH_TEXT}>Joined</span></th>
              <th className={`${TH_CLASS} text-right`}><span className="text-[10px] uppercase text-white/80 sm:text-[11px]">Action</span></th>
            </tr>
          </thead>

          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-[#F1E9E1] transition-colors duration-200 last:border-0 hover:bg-[#FFFBF8]">
                
                <td className="px-4 py-3 sm:px-6">
                  <p className="truncate text-[12px] text-gray-600 md:text-[13px]">{customer.name || "Unnamed Customer"}</p>
                </td>

                <td className={`px-4 py-3 sm:px-6 ${TD_TEXT}`}>{customer.phone}</td>

                <td className={`hidden sm:table-cell px-4 py-3 sm:px-6 ${TD_TEXT}`}>{customer.email || "—"}</td>

                <td className="px-4 py-3 sm:px-6">
                  <CustomerVerificationBadge isVerified={customer.isVerified} />
                </td>

                <td className="px-4 py-3 sm:px-6">
                  <span className="text-[12px] text-[#1F4A2E] sm:text-[13px]">
                    {customer.totalOrders?.toLocaleString("en-IN") || 0}
                  </span>
                </td>

                <td className={`hidden sm:table-cell px-4 py-3 sm:px-6 ${TD_TEXT}`}>{formatCustomerDate(customer.createdAt)}</td>

                <td className="px-4 py-3 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={() => handleViewCustomer(customer.id)}
                    aria-label={`View ${customer.name || "customer"}`}
                    title="View customer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7E2F8] bg-[#F2F6FF] text-[#4D7FEA] hover:border-[#BFD0F5] hover:bg-[#E8F0FF] hover:text-[#3D6ED8] focus:outline-none sm:h-9 sm:w-9"
                  >
                    <Eye className="h-[14px] w-[14px] sm:h-[16px] sm:w-[16px]" strokeWidth={1.8} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F1E9E1] bg-white px-4 py-4 sm:px-6">
          
          <p className="text-[11px] sm:text-[12px] text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>{" "}
            to <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, safeCustomers.length)}</span>{" "}
            of <span className="font-semibold text-gray-700">{safeCustomers.length}</span> customers
          </p>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <NavButton direction="prev" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} />

            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span key={`ellipsis-${index}`} className="flex h-8 w-6 sm:h-9 sm:w-8 items-center justify-center text-[12px] text-gray-400">
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
                  className={`inline-flex h-8 min-w-[32px] sm:h-9 sm:min-w-[36px] items-center justify-center rounded-lg border px-2 text-[12px] focus:outline-none ${
                    page === currentPage
                      ? "border-[#B5697A] bg-[#B5697A] text-white shadow-sm"
                      : "border-[#EADFD3] bg-white text-[#6F6259] hover:border-[#B5697A] hover:text-[#B5697A]"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <NavButton direction="next" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} />
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersTable;