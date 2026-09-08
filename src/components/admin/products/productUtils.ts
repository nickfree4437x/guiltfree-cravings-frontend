// src/components/admin/products/productUtils.ts

import type { ProductVariant } from "./types";

/*
 * =========================================================
 * FORMAT PRICE
 * =========================================================
 */

export const formatPrice = (
  price: number
) => {
  return `₹${price.toLocaleString("en-IN")}`;
};

/*
 * =========================================================
 * GET STARTING PRICE
 * =========================================================
 */

export const getStartingPrice = (
  variants: ProductVariant[]
) => {
  if (!variants.length) {
    return null;
  }

  return Math.min(
    ...variants.map(
      (variant) => variant.price
    )
  );
};