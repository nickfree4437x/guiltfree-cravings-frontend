import { Link } from "react-router-dom";

function ProfileQuickLinks() {
  return (
    <div className="rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm sm:p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FBEEF1]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-4 w-4 text-[#B5697A]"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 8h8M8 12h8M8 16h4"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-[13px] md:text-[14px] font-semibold text-[#B5697A]">
            Account
          </h2>

          <p className="text-[10px] text-gray-600">
            Quick access to your account
          </p>
        </div>
      </div>

      {/* LINKS */}
      <div className="mt-5 space-y-2">

        {/* MY ORDERS */}
        <Link
          to="/orders"
          className="
            group
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-transparent
            px-3
            py-2
            transition-all
            duration-200
            hover:border-[#F1DDE2]
            hover:bg-[#FBEEF1]
          "
        >
          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FBEEF1]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4 text-[#B5697A]"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h8M8 11h8M8 15h5"
                />
              </svg>
            </div>

            <span className="text-[12px] text-[#5E5148] transition-colors group-hover:text-[#B5697A]">
              My Orders
            </span>
          </div>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4 text-[#C9B8B0] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#B5697A]"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 18 6-6-6-6"
            />
          </svg>
        </Link>

        {/* CONTINUE SHOPPING */}
        <Link
          to="/#products"
          className="
            group
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-transparent
            px-3.5
            py-2
            transition-all
            duration-200
            hover:border-[#F1DDE2]
            hover:bg-[#FBEEF1]
          "
        >
          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FBEEF1]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4 text-[#B5697A]"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"
                />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </div>

            <span className="text-[12px] text-[#5E5148] transition-colors group-hover:text-[#B5697A]">
              Continue Shopping
            </span>
          </div>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4 text-[#C9B8B0] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#B5697A]"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 18 6-6-6-6"
            />
          </svg>
        </Link>

      </div>
    </div>
  );
}

export default ProfileQuickLinks;