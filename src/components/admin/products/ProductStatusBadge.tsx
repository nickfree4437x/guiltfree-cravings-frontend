// src/components/admin/products/ProductStatusBadge.tsx

interface ProductStatusBadgeProps {
  isActive: boolean;
}

function ProductStatusBadge({
  isActive,
}: ProductStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs",
        isActive
          ? "bg-green-50 text-green-700"
          : "bg-slate-100 text-slate-500",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isActive
            ? "bg-green-500"
            : "bg-slate-400",
        ].join(" ")}
      />

      {isActive
        ? "Active"
        : "Inactive"}
    </span>
  );
}

export default ProductStatusBadge;