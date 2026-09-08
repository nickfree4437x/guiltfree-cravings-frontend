import { Link } from "react-router-dom";

interface ProductNotFoundProps {
  error: string;
}

function ProductNotFound({
  error,
}: ProductNotFoundProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5 py-20">
      <div className="w-full max-w-lg text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e4d3]">
          <span className="text-2xl font-bold text-[#8b542f]">
            !
          </span>
        </div>

        <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-[#8b542f]">
          GuiltFree Cravings
        </p>

        <h1 className="mt-2 text-[20px] sm:text-[24px] md:text-[28px] font-bold tracking-tight text-[#2c2c2c]">
          Product Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
          {error ||
            "The product you're looking for doesn't exist or may no longer be available."}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/#products"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#8b542f] px-6 py-2.5 md:py-2.5 text-[12px] md:text-[14px] text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            Back to Products
          </Link>

          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d9c7b7] bg-white px-6 py-2.5 md:py-2.5 text-[12px] md:text-[14px] text-slate-800 transition hover:border-[#8b542f] hover:text-[#8b542f] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ProductNotFound;