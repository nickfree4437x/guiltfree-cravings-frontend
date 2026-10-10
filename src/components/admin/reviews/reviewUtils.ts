import type { AdminReviewStatus } from "../../../api/adminReviewApi";

export const formatReviewDate = (
  date: string
) => {
  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(parsedDate);
};

export const getReviewStatusClasses = (
  status: AdminReviewStatus
) => {
  if (status === "VERIFIED") {
    return "border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]";
  }

  if (status === "REJECTED") {
    return "border-[#E8C8CE] bg-[#FBECEF] text-[#C45D6D]";
  }

  return "border-[#EFD5BD] bg-[#FFF3E8] text-[#C4773B]";
};