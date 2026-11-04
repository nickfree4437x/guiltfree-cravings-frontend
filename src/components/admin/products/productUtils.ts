
import type { ProductVariant } from "./types";

/*
 * =========================================================
 * FORMAT PRICE
 * =========================================================
 */

export const formatPrice = (price: number) => {
  return `₹${price.toLocaleString("en-IN")}`;
};

/*
 * =========================================================
 * GET STARTING PRICE
 * =========================================================
 */

export const getStartingPrice = (
  variants?: ProductVariant[] | null
): number | null => {
  // Handle undefined, null and empty variants
  if (!Array.isArray(variants) || variants.length === 0) {
    return null;
  }

  // Get only valid variant prices
  const prices = variants
    .map((variant) => Number(variant?.price))
    .filter((price) => Number.isFinite(price) && price >= 0);

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
};
