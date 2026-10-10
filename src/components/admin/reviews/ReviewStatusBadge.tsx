import type { AdminReviewStatus } from "../../../api/adminReviewApi";

import {
  getReviewStatusClasses,
} from "./reviewUtils";

interface ReviewStatusBadgeProps {
  status: AdminReviewStatus;
}

function ReviewStatusBadge({
  status,
}: ReviewStatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        border
        px-2.5
        py-1
        text-[10px]
        uppercase
        tracking-[0.05em]
        ${getReviewStatusClasses(status)}
      `}
    >
      {status}
    </span>
  );
}

export default ReviewStatusBadge;