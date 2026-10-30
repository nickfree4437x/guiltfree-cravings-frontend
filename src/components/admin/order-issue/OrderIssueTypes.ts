import type {
  AdminOrderIssue,
  AdminOrderIssueStats,
  OrderIssueStatus,
} from "../../../api/adminApi";

export type { AdminOrderIssue, AdminOrderIssueStats, OrderIssueStatus };

export const PAGE_SIZE = 10;

export const STATUS_OPTIONS: {
  label: string;
  value: OrderIssueStatus;
}[] = [
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

export const INITIAL_STATS: AdminOrderIssueStats = {
  total: 0,
  open: 0,
  inProgress: 0,
  resolved: 0,
  closed: 0,
};