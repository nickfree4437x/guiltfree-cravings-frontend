// src/components/admin/customers/CustomerVerificationBadge.tsx

interface CustomerVerificationBadgeProps {
  isVerified: boolean;
}

function CustomerVerificationBadge({
  isVerified,
}: CustomerVerificationBadgeProps) {
  if (isVerified) {
    return (
      <span className="inline-flex rounded-full bg-green-50 px-3 py-1.5 text-xs text-green-700">
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
      Unverified
    </span>
  );
}

export default CustomerVerificationBadge;