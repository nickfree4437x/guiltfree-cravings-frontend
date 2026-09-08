import { Link } from "react-router-dom";

function ProfileQuickLinks() {
  return (
    <div className="rounded-lg border border-[#eadfd3] bg-white p-6 shadow-sm">

      <h2 className="text-sm font-bold text-slate-900">
        Account
      </h2>

      <div className="mt-4 space-y-2">

        <Link
          to="/orders"
          className="flex items-center justify-between rounded-2xl px-4 py-2 text-sm text-slate-700 transition hover:bg-[#fffaf5] hover:text-[#8b542f]"
        >
          <span>
            My Orders
          </span>
        </Link>

        <Link
          to="/#products"
          className="flex items-center justify-between rounded-2xl px-4 py-2 text-sm text-slate-700 transition hover:bg-[#fffaf5] hover:text-[#8b542f]"
        >
          <span>
            Continue Shopping
          </span>
        </Link>

      </div>

    </div>
  );
}

export default ProfileQuickLinks;