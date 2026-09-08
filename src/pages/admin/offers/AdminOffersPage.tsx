import {
  Plus,
  Search,
  Tag,
  Users,
  UserRound,
  Clock3,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  deleteOffer,
  getAdminOffers,
  type Offer,
  type OfferAudience,
  type OfferStatus,
} from "../../../api/offerApi";

import CreateOfferModal from "../../../components/admin/offers/CreateOfferModal";

function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [audience, setAudience] =
    useState<OfferAudience | "">("");

  const [status, setStatus] =
    useState<OfferStatus | "">("");

  const [createOpen, setCreateOpen] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);


  // ============================================================
  // FETCH OFFERS
  // ============================================================

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOffers({
        search: search.trim(),
        audience,
        status,
      });

      setOffers(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load offers."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchOffers();
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search, audience, status]);


  // ============================================================
  // DELETE OFFER
  // ============================================================

  const handleDelete = async (
    offerId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this offer?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);
      setDeleteId(offerId);

      await deleteOffer(offerId);

      await fetchOffers();
    } catch (err: any) {
      window.alert(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete offer."
      );
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };


  // ============================================================
  // STATS
  // ============================================================

  const total = offers.length;

  const active = offers.filter(
    (offer) => offer.status === "ACTIVE"
  ).length;

  const scheduled = offers.filter(
    (offer) =>
      offer.status === "SCHEDULED"
  ).length;

  const expired = offers.filter(
    (offer) =>
      offer.status === "EXPIRED"
  ).length;


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#fffaf5] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b542f]">
              Promotions
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Offers
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Create and manage public offers and
              customer-specific discounts.
            </p>
          </div>


          {/* ==================================================
              CREATE OFFER — PRIMARY CTA
          ================================================== */}

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#8b542f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#754527] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8b542f]/30"
          >
            <Plus
              className="h-4 w-4"
              strokeWidth={2}
            />

            Create Offer
          </button>
        </div>


        {/* ======================================================
            STATS
        ====================================================== */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Offers"
            value={total}
            icon={
              <Tag
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            }
          />

          <StatCard
            label="Active"
            value={active}
            icon={
              <CheckCircle2
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            }
          />

          <StatCard
            label="Scheduled"
            value={scheduled}
            icon={
              <Clock3
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            }
          />

          <StatCard
            label="Expired"
            value={expired}
            icon={
              <XCircle
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            }
          />
        </div>


        {/* ======================================================
            FILTERS
        ====================================================== */}

        <div className="mt-7 rounded-2xl border border-[#eadfd3] bg-white p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_200px_180px]">

            {/* Search */}
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={1.8}
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search offer, code or customer phone..."
                className="w-full rounded-xl border border-[#eadfd3] bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10"
              />
            </div>


            {/* Audience */}
            <select
              value={audience}
              onChange={(event) =>
                setAudience(
                  event.target.value as
                    | OfferAudience
                    | ""
                )
              }
              className="rounded-xl border border-[#eadfd3] bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10"
            >
              <option value="">
                All Audiences
              </option>

              <option value="PUBLIC">
                Public
              </option>

              <option value="SPECIFIC_CUSTOMER">
                Specific Customer
              </option>
            </select>


            {/* Status */}
            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                    | OfferStatus
                    | ""
                )
              }
              className="rounded-xl border border-[#eadfd3] bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-[#8b542f] focus:ring-2 focus:ring-[#8b542f]/10"
            >
              <option value="">
                All Statuses
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="SCHEDULED">
                Scheduled
              </option>

              <option value="EXPIRED">
                Expired
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>

          </div>
        </div>


        {/* ======================================================
            OFFERS CONTENT
        ====================================================== */}

        <div className="mt-6 overflow-hidden rounded-3xl border border-[#eadfd3] bg-white">

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2
                  className="h-5 w-5 animate-spin text-[#8b542f]"
                  strokeWidth={1.8}
                />

                Loading offers...
              </div>
            </div>

          ) : error ? (

            /* ==================================================
               ERROR
            ================================================== */

            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <XCircle
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              </div>

              <p className="mt-4 text-sm font-medium text-red-500">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchOffers}
                className="mt-4 rounded-xl bg-[#8b542f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#754527]"
              >
                Try Again
              </button>
            </div>

          ) : offers.length === 0 ? (

            /* ==================================================
               EMPTY STATE
            ================================================== */

            <div className="flex min-h-[340px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8eee4] text-[#8b542f]">
                <Tag
                  className="h-6 w-6"
                  strokeWidth={1.7}
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No offers found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first public or
                customer-specific offer to get started.
              </p>

              {/* SECOND CREATE OFFER CTA */}
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#8b542f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#754527] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8b542f]/30"
              >
                <Plus
                  className="h-4 w-4"
                  strokeWidth={2}
                />

                Create Offer
              </button>
            </div>

          ) : (

            /* ==================================================
               DESKTOP TABLE
            ================================================== */

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-[#eadfd3] bg-[#fdfbf8]">

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Offer
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Audience
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Discount
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Usage
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Action
                    </th>

                  </tr>
                </thead>


                <tbody>
                  {offers.map((offer) => (
                    <tr
                      key={offer.id}
                      className="border-b border-[#f1e9e2] transition last:border-0 hover:bg-[#fdfbf8]"
                    >

                      {/* OFFER */}
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-900">
                          {offer.name}
                        </p>

                        <p className="mt-1 inline-flex rounded-md bg-[#f8eee4] px-2 py-1 text-[11px] font-semibold tracking-wide text-[#754527]">
                          {offer.code}
                        </p>
                      </td>


                      {/* AUDIENCE */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">

                          {offer.audience ===
                          "PUBLIC" ? (
                            <Users
                              className="h-4 w-4 text-[#8b542f]"
                              strokeWidth={1.8}
                            />
                          ) : (
                            <UserRound
                              className="h-4 w-4 text-[#8b542f]"
                              strokeWidth={1.8}
                            />
                          )}

                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {offer.audience ===
                              "PUBLIC"
                                ? "Public"
                                : "Specific Customer"}
                            </p>

                            {offer.customerPhone && (
                              <p className="mt-0.5 text-xs text-slate-400">
                                {offer.customerPhone}
                              </p>
                            )}
                          </div>

                        </div>
                      </td>


                      {/* DISCOUNT */}
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-800">
                          {offer.discountType ===
                          "PERCENTAGE"
                            ? `${offer.discountValue}%`
                            : `₹${offer.discountValue}`}
                        </p>

                        {offer.minOrderValue !==
                          null && (
                          <p className="mt-1 text-xs text-slate-400">
                            Min ₹
                            {offer.minOrderValue}
                          </p>
                        )}
                      </td>


                      {/* USAGE */}
                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-700">
                          {offer.usageCount ?? 0}

                          {offer.usageLimit !==
                          null
                            ? ` / ${offer.usageLimit}`
                            : ""}
                        </p>
                      </td>


                      {/* STATUS */}
                      <td className="px-6 py-5">
                        <StatusBadge
                          status={
                            offer.status ??
                            "INACTIVE"
                          }
                        />
                      </td>


                      {/* ACTION */}
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              offer.id
                            )
                          }
                          disabled={
                            deleteLoading &&
                            deleteId ===
                              offer.id
                          }
                          aria-label={`Delete ${offer.name}`}
                          title="Delete offer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deleteLoading &&
                          deleteId ===
                            offer.id ? (
                            <Loader2
                              className="h-4 w-4 animate-spin"
                              strokeWidth={1.8}
                            />
                          ) : (
                            <Trash2
                              className="h-4 w-4"
                              strokeWidth={1.8}
                            />
                          )}
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>
      </div>


      {/* ========================================================
          CREATE OFFER MODAL
      ======================================================== */}

      <CreateOfferModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={fetchOffers}
      />

    </div>
  );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#eadfd3] bg-white p-5 transition hover:shadow-sm">

      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8eee4] text-[#8b542f]">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>

    </div>
  );
}


// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  status,
}: {
  status: OfferStatus;
}) {
  const styles: Record<
    OfferStatus,
    string
  > = {
    ACTIVE:
      "bg-emerald-50 text-emerald-600",

    SCHEDULED:
      "bg-amber-50 text-amber-600",

    EXPIRED:
      "bg-slate-100 text-slate-500",

    INACTIVE:
      "bg-red-50 text-red-500",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default AdminOffersPage;