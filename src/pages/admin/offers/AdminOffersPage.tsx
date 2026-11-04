
import {
  Plus,
  Search,
  Tag,
  Clock3,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import { FaEdit, FaTrash } from "react-icons/fa";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import toast from "react-hot-toast";

import {
  deleteOffer,
  getAdminOffers,
  getAdminOffer,
  type Offer,
  type OfferAudience,
  type OfferStatus,
} from "../../../api/offerApi";

import CreateOfferModal from "../../../components/admin/offers/CreateOfferModal";

// ============================================================
// CONFIG
// ============================================================

const FILTER_SELECT_CLASS =
  "rounded-xl border border-[#E8DED3] bg-white px-4 py-2.5 text-[11px] md:text-[12px] text-slate-500 outline-none transition focus:border-[#B5697A]";

const AUDIENCE_OPTIONS: {
  value: OfferAudience | "";
  label: string;
}[] = [
  { value: "", label: "All Audiences" },
  { value: "PUBLIC", label: "Public" },
  {
    value: "SPECIFIC_CUSTOMER",
    label: "Specific Customer",
  },
];

const STATUS_OPTIONS: {
  value: OfferStatus | "";
  label: string;
}[] = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "EXPIRED", label: "Expired" },
  { value: "INACTIVE", label: "Inactive" },
];

// ============================================================
// COMPONENT
// ============================================================

function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ----------------------------------------------------------
  // FILTERS
  // ----------------------------------------------------------

  const [search, setSearch] = useState("");
  const [audience, setAudience] =
    useState<OfferAudience | "">("");
  const [status, setStatus] =
    useState<OfferStatus | "">("");

  // ----------------------------------------------------------
  // CREATE / EDIT MODAL
  // ----------------------------------------------------------

  const [createOpen, setCreateOpen] = useState(false);
  const [editingOffer, setEditingOffer] =
    useState<Offer | null>(null);

  const [editLoading, setEditLoading] = useState(false);

  // ----------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // ==========================================================
  // FETCH OFFERS
  // ==========================================================

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
      console.error("FETCH OFFERS ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load offers."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // DEBOUNCED FILTER FETCH
  // ----------------------------------------------------------

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchOffers();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search, audience, status]);

  // ==========================================================
  // CREATE OFFER
  // ==========================================================

  const handleCreateOffer = () => {
    setEditingOffer(null);
    setCreateOpen(true);
  };

  // ==========================================================
  // EDIT OFFER
  // ==========================================================

  const handleEditOffer = async (offerId: number) => {
    if (editLoading) return;

    try {
      setEditLoading(true);

      // Fetch complete offer details, including variantIds.
      const completeOffer = await getAdminOffer(offerId);

      setEditingOffer(completeOffer);
      setCreateOpen(true);
    } catch (err: any) {
      console.error("GET OFFER DETAILS ERROR:", err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load offer details."
      );
    } finally {
      setEditLoading(false);
    }
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const handleCloseOfferModal = () => {
    if (editLoading) return;

    setCreateOpen(false);
    setEditingOffer(null);
  };

  // ==========================================================
  // DELETE OFFER
  // ==========================================================

  const handleDelete = async (offerId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this offer?"
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteId(offerId);

      await deleteOffer(offerId);

      toast.success("Offer deleted successfully.");

      await fetchOffers();
    } catch (err: any) {
      console.error("DELETE OFFER ERROR:", err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete offer."
      );
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  // ==========================================================
  // STATS
  // ==========================================================

  const total = offers.length;

  const active = offers.filter(
    (offer) => offer.status === "ACTIVE"
  ).length;

  const scheduled = offers.filter(
    (offer) => offer.status === "SCHEDULED"
  ).length;

  const expired = offers.filter(
    (offer) => offer.status === "EXPIRED"
  ).length;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-full bg-white px-5 py-2 sm:px-8 lg:px-10 lg:py-3">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mt-1 text-[18px] font-semibold tracking-tight text-slate-700 md:text-[22px]">
              Offers
            </h1>

            <p className="mt-0 max-w-xl text-[11px] font-[350] leading-relaxed text-slate-500 md:text-[12px]">
              Create and manage offers and discounts.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateOffer}
            className="md:mt-0 -mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#B5697A] px-4 py-2.5 text-[11.5px] text-white shadow transition-all hover:bg-[#A85F70] hover:shadow-sm focus:outline-none sm:w-fit sm:gap-2 sm:px-5 sm:text-[12px]"
          >
            <Plus
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              strokeWidth={2}
            />
            Create Offer
          </button>
        </div>

        {/* STATS */}

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Offers"
            value={total}
            icon={
              <Tag
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            }
            iconBg="bg-[#FBECEF]"
            iconColor="text-[#B5697A]"
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
            iconBg="bg-[#EEF8F2]"
            iconColor="text-[#3F8A58]"
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
            iconBg="bg-[#FFF3E8]"
            iconColor="text-[#C4773B]"
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
            iconBg="bg-[#F4F0FF]"
            iconColor="text-[#8062C7]"
          />
        </div>

        {/* FILTERS */}

        <div className="mt-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_200px_180px]">

            {/* SEARCH */}

            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A99B90]"
                strokeWidth={1.8}
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search offer, code or customer phone"
                className="w-full rounded-xl border border-[#E8DED3] bg-white py-2.5 pl-10 pr-4 text-[11px] text-slate-500 outline-none transition placeholder:text-slate-500 focus:border-[#B5697A] md:text-[12px]"
              />
            </div>

            {/* AUDIENCE */}

            <select
              value={audience}
              onChange={(e) =>
                setAudience(
                  e.target.value as OfferAudience | ""
                )
              }
              className={FILTER_SELECT_CLASS}
            >
              {AUDIENCE_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            {/* STATUS */}

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as OfferStatus | ""
                )
              }
              className={FILTER_SELECT_CLASS}
            >
              {STATUS_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* OFFERS CONTENT */}

        <div className="mt-5 overflow-hidden rounded-xl border border-[#EFE3D2] bg-white shadow-sm">

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-[11px] text-[#8B7A6C] md:text-[12px]">
                <Loader2 className="h-5 w-5 animate-spin text-[#B5697A]" />
                Loading offers...
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBECEF] text-[#B5697A]">
                <XCircle className="h-5 w-5" />
              </div>

              <p className="mt-4 text-sm font-medium text-[#A85F70]">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchOffers}
                className="mt-4 rounded-xl bg-[#B5697A] px-4 py-2.5 text-sm text-white transition hover:bg-[#A85F70]"
              >
                Try Again
              </button>
            </div>
          ) : offers.length === 0 ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FBECEF] text-[#B5697A]">
                <Tag className="h-5 w-5" />
              </div>

              <h3 className="mt-3 text-[14px] font-semibold text-[#1F4A2E] md:text-[16px]">
                No offers found
              </h3>

              <p className="mt-2 max-w-md text-[11px] leading-relaxed text-gray-600 md:text-[12px]">
                Create your first public or customer-specific
                offer to get started.
              </p>

              <button
                type="button"
                onClick={handleCreateOffer}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#B5697A] px-5 py-2 text-[11px] text-white shadow transition-all hover:bg-[#A85F70] md:py-2.5 md:text-[12px]"
              >
                <Plus className="h-4 w-4" />
                Create Offer
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[940px]">

                {/* TABLE HEADER */}

                <thead>
                  <tr className="border-b border-[#A85F70] bg-[#B5697A]">
                    {[
                      "Offer",
                      "Audience",
                      "Discount",
                      "Usage",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-2.5 text-left"
                      >
                        <span className="text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                          {heading}
                        </span>
                      </th>
                    ))}

                    <th className="px-6 py-2.5 text-right">
                      <span className="text-[11px] font-[450] uppercase tracking-[0.08em] text-white">
                        Action
                      </span>
                    </th>
                  </tr>
                </thead>

                {/* TABLE BODY */}

                <tbody>
                  {offers.map((offer) => (
                    <tr
                      key={offer.id}
                      className="border-b border-[#F1E9E1] transition-colors duration-200 last:border-0 hover:bg-[#FFFBF8]"
                    >

                      {/* OFFER */}

                      <td className="px-6 py-3">
                        <p className="inline-flex rounded-lg bg-[#FBECEF] px-2.5 py-1 text-[10px] tracking-[0.04em] text-[#A85F70]">
                          {offer.code}
                        </p>
                      </td>

                      {/* AUDIENCE */}

                      <td className="px-6 py-3">
                        <p className="text-[11px] text-[#3D3834] md:text-[12px]">
                          {offer.audience === "PUBLIC"
                            ? "Public"
                            : "Specific Customer"}
                        </p>

                        {offer.customerPhone && (
                          <p className="mt-0.5 text-[11px] text-[#9A8D82]">
                            {offer.customerPhone}
                          </p>
                        )}
                      </td>

                      {/* DISCOUNT */}

                      <td className="px-6 py-3">
                        <p className="text-[13px] text-[#1F4A2E]">
                          {offer.discountType === "PERCENTAGE"
                            ? `${offer.discountValue}%`
                            : `₹${offer.discountValue}`}
                        </p>
                      </td>

                      {/* USAGE */}

                      <td className="px-6 py-3">
                        <p className="text-[13px] text-[#5F554E]">
                          {offer.usageCount ?? 0}
                          {offer.usageLimit !== null
                            ? ` / ${offer.usageLimit}`
                            : ""}
                        </p>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-3">
                        <StatusBadge
                          status={offer.status ?? "INACTIVE"}
                        />
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEditOffer(offer.id)
                            }
                            disabled={
                              editLoading || deleteLoading
                            }
                            aria-label={`Edit ${offer.name}`}
                            title="Edit offer"
                            className="rounded-md bg-blue-50 p-2 text-sm text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {editLoading &&
                            editingOffer?.id === offer.id ? (
                              <Loader2 className="h-[14px] w-[14px] animate-spin" />
                            ) : (
                              <FaEdit className="h-[14px] w-[14px]" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(offer.id)
                            }
                            disabled={deleteLoading || editLoading}
                            aria-label={`Delete ${offer.name}`}
                            title="Delete offer"
                            className="rounded-md bg-red-50 p-2 text-sm text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deleteLoading &&
                            deleteId === offer.id ? (
                              <Loader2 className="h-[16px] w-[16px] animate-spin" />
                            ) : (
                              <FaTrash className="h-[14px] w-[14px]" />
                            )}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}

      <CreateOfferModal
        open={createOpen}
        offer={editingOffer}
        onClose={handleCloseOfferModal}
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
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#EFE3D2] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[13px] tracking-[0.01em] text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-[28px] font-bold leading-none tracking-[-0.02em] text-[#1F2937] sm:text-[30px]">
            {value.toLocaleString("en-IN")}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
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
  const styles: Record<OfferStatus, string> = {
    ACTIVE:
      "border border-[#CFE4D4] bg-[#EEF8F2] text-[#3F8A58]",

    SCHEDULED:
      "border border-[#EFD5BD] bg-[#FFF3E8] text-[#C4773B]",

    EXPIRED:
      "border border-[#E8E1D9] bg-[#F7F4F1] text-[#766A61]",

    INACTIVE:
      "border border-[#E8C8CE] bg-[#FBECEF] text-[#A85F70]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] tracking-[0.01em] ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default AdminOffersPage;
