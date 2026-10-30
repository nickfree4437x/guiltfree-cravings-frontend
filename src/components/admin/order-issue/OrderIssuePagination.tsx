import { ArrowLeft, ArrowRight } from "lucide-react";

interface OrderIssuePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  showingFrom: number;
  showingTo: number;
  setPage: (page: number) => void;
}

export function OrderIssuePagination({ page, totalPages, total, showingFrom, showingTo, setPage }: OrderIssuePaginationProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-center text-[12px] text-slate-500 sm:text-left sm:text-[13px]">
        Showing <span className=" text-gray-700">{showingFrom}–{showingTo}</span> of <span className="font-semibold text-gray-800">{total}</span> issues
      </p>
      <div className="flex items-center justify-center gap-2">
        <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#B5697A]/30 hover:text-[#B5697A] disabled:cursor-not-allowed disabled:opacity-40">
          <ArrowLeft size={16} />
        </button>
        <span className="min-w-[100px] text-center text-[12px] md:text-[13px] text-gray-700">Page {page} of {Math.max(totalPages, 1)}</span>
        <button type="button" onClick={() => setPage(Math.min(Math.max(totalPages, 1), page + 1))} disabled={page >= totalPages} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#B5697A]/30 hover:text-[#B5697A] disabled:cursor-not-allowed disabled:opacity-40">
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}