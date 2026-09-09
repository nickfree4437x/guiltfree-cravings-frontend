interface ReviewCheckoutHeaderProps {
  isCreatingOrder: boolean;
}

function ReviewCheckoutHeader({
  isCreatingOrder: _isCreatingOrder,
}: ReviewCheckoutHeaderProps) {
  return (
    <>
      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="mt-12 text-center sm:mt-14">
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Review Your Order
        </h1>

        <p className="mx-auto mt-2 max-w-2xl text-sm font-[350] md:leading-6 text-slate-500 sm:text-[15px]">
          Please review your details and selected products
          before continuing to payment.
        </p>
      </div>
    </>
  );
}

export default ReviewCheckoutHeader;