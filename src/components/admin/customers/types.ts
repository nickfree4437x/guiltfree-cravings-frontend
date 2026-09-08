/*
 * =========================================================
 * CUSTOMER TYPES
 * =========================================================
 */

export interface AdminCustomer {
  id: number;
  name: string | null;
  phone: string;
  email: string | null;
  isVerified: boolean;
  totalOrders: number;
  createdAt: string;
}