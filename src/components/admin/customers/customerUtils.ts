// src/components/admin/customers/customerUtils.ts

/*
 * =========================================================
 * FORMAT DATE
 * =========================================================
 */

export const formatCustomerDate = (
  date: string
) => {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(date));
};