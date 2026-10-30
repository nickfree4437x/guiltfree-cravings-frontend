import { formatStatus, getStatusClasses } from "./orderIssueUtils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] md:text-[11px] ${getStatusClasses(
        status
      )}`}
    >
      {formatStatus(status)}
    </span>
  );
}