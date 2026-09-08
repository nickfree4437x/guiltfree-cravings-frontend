import { useNavigate } from "react-router-dom";

function AccountAuthRequired() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[#fffaf5] px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#eadfd3] bg-white p-8 text-center shadow-sm">

        {/* =================================================
            ICON
        ================================================= */}

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e4d3]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-8 w-8 text-[#8b542f]"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
            />
          </svg>
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          Login Required
        </h1>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
          Please login to access your account and
          manage your profile.
        </p>

        {/* =================================================
            LOGIN BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-6 inline-flex rounded-full bg-[#8b542f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#744324] focus:outline-none focus:ring-2 focus:ring-[#8b542f] focus:ring-offset-2"
        >
          Login
        </button>

      </div>
    </main>
  );
}

export default AccountAuthRequired;