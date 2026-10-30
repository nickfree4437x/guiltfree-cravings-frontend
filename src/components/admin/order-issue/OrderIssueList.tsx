import { Eye } from "lucide-react";
import type { AdminOrderIssue } from "./OrderIssueTypes";
import { StatusBadge } from "./OrderIssueStatusBadge";
import { formatDate, getInitials } from "./orderIssueUtils";

interface OrderIssueListProps {
  issues: AdminOrderIssue[];
  onViewDetails: (id: number) => void;
}

export function OrderIssueList({ issues, onViewDetails }: OrderIssueListProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[850px] border-collapse text-left md:min-w-[1050px]">
        <thead>
          <tr className="border-b border-[#B5697A] bg-[#B5697A]">
            <th className="px-5 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
              Order / Issue
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
              Customer
            </th>
            <th className="px-5py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
              Issue Details
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
              Reported On
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
              Status
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {issues.map((issue) => (
            <tr key={issue.id} className="transition hover:bg-[#B5697A]/[0.025]">
              <td className="px-5 py-3">
                <p className="inline-flex whitespace-nowrap rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[10px] text-[#A85F70] md:text-[11px]">
                  {issue.orderNumber}
                </p>
                <p className="mt-1 text-[10px] md:text-[11px] text-slate-500">
                  Issue #{issue.id}
                </p>
              </td>
              <td className="px-4 py-3 md:px-5 md:py-4">
                <div className="flex min-w-0 items-center gap-2 md:gap-3">
                  <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-[#B5697A]/10 text-[10px] md:text-[11px] font-semibold text-[#B5697A]">
                    {getInitials(issue.order?.customerName)}
                  </div>
                  <div className="min-w-0">
                    <p className="max-w-[120px] md:max-w-[180px] truncate text-[12px] md:text-[13px] font-semibold text-gray-700">
                      {issue.order?.customerName || "Unknown"}
                    </p>
                    <p className="mt-1 text-[10px] md:text-[11px] text-slate-500">
                      {issue.order?.customerPhone || "No phone"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="max-w-[200px] md:max-w-[260px] px-4 py-3 md:px-5 md:py-4">
                <p className="text-[12px] md:text-[13px] font-semibold text-gray-700 line-clamp-1 md:line-clamp-none">
                  {issue.issueType}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[10px] md:text-[11px] leading-relaxed text-slate-500">
                  {issue.message}
                </p>
              </td>
              <td className="whitespace-nowrap px-4 py-3 md:px-5 md:py-4">
                <p className="text-[12px] md:text-[13px] text-gray-700">
                  {formatDate(issue.createdAt)}
                </p>
                <p className="mt-0.5 text-[10px] md:text-[11px] text-slate-500">
                  {new Date(issue.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </td>
              <td className="px-4 py-3 md:px-5 md:py-4">
                <StatusBadge status={issue.status} />
              </td>
              <td className="px-4 py-3 md:px-5 md:py-4 text-right">
                {/* VIEW BUTTON (Only Icon) */}
                <button
                  type="button"
                  onClick={() => onViewDetails(issue.id)}
                  aria-label={`View issue #${issue.id}`}
                  title="View Details"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#D7E2F8] bg-[#F2F6FF] text-[#4D7FEA] transition-all duration-200 hover:border-[#BFD0F5] hover:bg-[#E8F0FF] hover:text-[#3D6ED8]"
                >
                  <Eye size={15} className="md:size-[16px]" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}