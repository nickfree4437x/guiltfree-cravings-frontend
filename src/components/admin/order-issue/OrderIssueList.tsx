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
      <table className="w-full min-w-[750px] border-collapse text-left md:min-w-[900px]">
        <thead>
          <tr className="border-b border-[#B5697A] bg-[#B5697A]">
            <th className="px-4 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white md:px-5">
              Order / Issue
            </th>
            <th className="px-4 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white md:px-5">
              Customer
            </th>
            <th className="px-4 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white md:px-5">
              Issue Details
            </th>
            <th className="px-4 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white md:px-5">
              Reported On
            </th>
            <th className="px-4 py-3 text-left text-[11px] font-[450] uppercase tracking-[0.08em] text-white md:px-5">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {issues.map((issue) => (
            <tr
              key={issue.id}
              onClick={() => onViewDetails(issue.id)}
              className="cursor-pointer transition-colors duration-200 hover:bg-[#B5697A]/[0.04]"
            >
              <td className="px-4 py-3 md:px-5 md:py-4">
                <p className="inline-flex whitespace-nowrap rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[10px] text-[#A85F70] md:text-[11px]">
                  {issue.orderNumber}
                </p>
                <p className="mt-1 text-[10px] text-slate-500 md:text-[11px]">
                  Issue #{issue.id}
                </p>
              </td>
              <td className="px-4 py-3 md:px-5 md:py-4">
                <div className="flex min-w-0 items-center gap-2 md:gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#B5697A]/10 text-[10px] font-semibold text-[#B5697A] md:h-8 md:w-8 md:text-[11px]">
                    {getInitials(issue.order?.customerName)}
                  </div>
                  <div className="min-w-0">
                    <p className="max-w-[120px] truncate text-[12px] font-semibold text-gray-700 md:max-w-[180px] md:text-[13px]">
                      {issue.order?.customerName || "Unknown"}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500 md:text-[11px]">
                      {issue.order?.customerPhone || "No phone"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="max-w-[200px] px-4 py-3 md:max-w-[260px] md:px-5 md:py-4">
                <p className="line-clamp-1 text-[12px] font-semibold text-gray-700 md:line-clamp-none md:text-[13px]">
                  {issue.issueType}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-slate-500 md:text-[11px]">
                  {issue.message}
                </p>
              </td>
              <td className="whitespace-nowrap px-4 py-3 md:px-5 md:py-4">
                <p className="text-[12px] text-gray-700 md:text-[13px]">
                  {formatDate(issue.createdAt)}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500 md:text-[11px]">
                  {new Date(issue.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </td>
              <td className="px-4 py-3 md:px-5 md:py-4">
                <StatusBadge status={issue.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}