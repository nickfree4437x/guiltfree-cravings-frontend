export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";
export type StatusFilter = PaymentStatus | "ALL";

export interface Payment {
  id: number;
  paymentId: string;
  transactionId: string | null;
  merchantOrderId: string;
  providerOrderId: string | null;
  orderId: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  providerCode: string | null;
  failureReason: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSummary {
  total: number;
  paid: number;
  pending: number;
  failed: number;
  refunded: number;
  paidAmount: number;
  paidAmountCurrency: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaymentsResponse {
  success: boolean;
  message?: string;
  data?: {
    payments: Payment[];
    summary: PaymentSummary;
    pagination: Pagination;
  };
}