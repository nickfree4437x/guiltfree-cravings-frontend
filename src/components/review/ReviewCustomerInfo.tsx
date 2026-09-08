import { Pencil } from "lucide-react";

interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
}

interface ReviewCustomerInfoProps {
  customer: CustomerDetails;
  isCreatingOrder: boolean;
  onEdit: () => void;
}

function ReviewCustomerInfo({
  customer,
  isCreatingOrder,
  onEdit,
}: ReviewCustomerInfoProps) {
  return (
    <section className="rounded-xl border border-[#eadfd3] bg-white p-5 shadow-sm sm:p-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            Customer Information
          </h2>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            Details saved during checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={onEdit}
          disabled={isCreatingOrder}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#d9c7b7] text-[#8b542f] transition-all duration-200 hover:border-[#8b542f] hover:bg-[#f5eadf] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Edit customer details"
          title="Edit customer details"
        >
          <Pencil
            className="h-4 w-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* =================================================
          CUSTOMER DETAILS
      ================================================= */}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {/* =================================================
            FULL NAME
        ================================================= */}

        <div className="rounded-lg border border-[#eadfd3] bg-[#fdfbf8] px-4 py-2">
          <p className="mt-1.5 break-words text-[12px] md:text-[14px] text-slate-800">
            {customer.fullName}
          </p>
        </div>

        {/* =================================================
            PHONE
        ================================================= */}

        <div className="rounded-lg border border-[#eadfd3] bg-[#fdfbf8] px-4 py-2">
          <p className="mt-1.5 break-words text-[12px] md:text-[14px] text-slate-800">
            +91 {customer.phone}
          </p>
        </div>

        {/* =================================================
            EMAIL
        ================================================= */}

        <div className="rounded-lg border border-[#eadfd3] bg-[#fdfbf8] px-4 py-2 sm:col-span-2">
          <p className="mt-1.5 break-words text-[12px] md:text-[14px] text-slate-800">
            {customer.email}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ReviewCustomerInfo;