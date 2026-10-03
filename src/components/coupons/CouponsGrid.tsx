import CouponCard, {
  type Coupon,
} from "./CouponCard";

interface CouponsGridProps {
  coupons: Coupon[];
}

function CouponsGrid({
  coupons,
}: CouponsGridProps) {
  return (
    <section
      aria-label="Available coupons"
      className="
        mt-5
        grid
        gap-5
        sm:gap-6
        md:grid-cols-2
        lg:grid-cols-3
      "
    >
      {coupons.map((coupon) => (
        <CouponCard
          key={coupon.id}
          coupon={coupon}
        />
      ))}
    </section>
  );
}

export default CouponsGrid;