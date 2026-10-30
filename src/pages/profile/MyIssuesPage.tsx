import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";

import { Link } from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileQuestion,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  getMyOrderIssues,
  getMyOrderIssueMessages,
  sendMyOrderIssueMessage,
  type CustomerOrderIssue,
  type CustomerOrderIssueStatus,
} from "../../api/userApi";

// ============================================================
// CONSTANTS
// ============================================================

const PAGE_SIZE = 10;
const MAX_MESSAGE_LENGTH = 2000;

type MessageSender = "CUSTOMER" | "ADMIN";

interface CustomerIssueMessage {
  id: number;
  issueId: number;
  senderType: MessageSender;
  senderId: number;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerIssueConversation {
  issue: {
    id: number;
    orderNumber: string;
    issueType: string;
    status: CustomerOrderIssueStatus;
    createdAt: string;
  };
  messages: CustomerIssueMessage[];
}

const STATUS_CONFIG: Record<
  CustomerOrderIssueStatus,
  {
    label: string;
    description: string;
    className: string;
    icon: ReactNode;
  }
> = {
  OPEN: {
    label: "Open",
    description: "Your issue has been received and is awaiting review.",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: <Clock3 size={15} />,
  },

  IN_PROGRESS: {
    label: "In Progress",
    description: "Our support team is working on your issue.",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    icon: <RefreshCw size={15} />,
  },

  RESOLVED: {
    label: "Resolved",
    description: "Your issue has been marked as resolved.",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: <CheckCircle2 size={15} />,
  },

  CLOSED: {
    label: "Closed",
    description: "This support issue has been closed.",
    className: "border-gray-200 bg-gray-100 text-gray-600",
    icon: <ShieldCheck size={15} />,
  },
};

// ============================================================
// HELPERS
// ============================================================

const formatDate = (value?: string | null): string => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (value?: string | null): string => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatStatus = (value?: string | null): string => {
  if (!value) return "—";

  return value
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join(" ");
};

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as {
      response?: {
        data?: { message?: string };
        status?: number;
      };
      message?: string;
    };

    if (apiError.response?.status === 401) {
      return "Your session may have expired. Please log in again.";
    }

    if (apiError.response?.status === 403) {
      return "You are not authorized to access this conversation.";
    }

    return (
      apiError.response?.data?.message ||
      apiError.message ||
      "Something went wrong. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  status,
}: {
  status: CustomerOrderIssueStatus;
}) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

// ============================================================
// CUSTOMER / ADMIN MESSAGE
// ============================================================

function ConversationMessage({
  message,
}: {
  message: CustomerIssueMessage;
}) {
  const isCustomer = message.senderType === "CUSTOMER";

  return (
    <div
      className={`flex w-full ${
        isCustomer ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex min-w-0 max-w-[90%] flex-col sm:max-w-[80%] ${
          isCustomer ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`mb-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold ${
            isCustomer ? "text-[#B5697A]" : "text-gray-600"
          }`}
        >
          {isCustomer ? (
            <UserRound size={13} />
          ) : (
            <ShieldCheck size={13} />
          )}

          <span>{isCustomer ? "You" : "Customer Support"}</span>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 ${
            isCustomer
              ? "rounded-tr-sm bg-[#B5697A] text-white"
              : "rounded-tl-sm border border-gray-200 bg-white text-gray-800"
          }`}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-6">
            {message.message}
          </p>
        </div>

        <p className="mt-1.5 px-1 text-[11px] text-gray-400">
          {formatDateTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// ISSUE CARD
// ============================================================

function IssueCard({
  issue,
}: {
  issue: CustomerOrderIssue;
}) {
  const statusConfig = STATUS_CONFIG[issue.status];

  const [conversation, setConversation] =
    useState<CustomerIssueConversation | null>(null);

  const [conversationOpen, setConversationOpen] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversationError, setConversationError] = useState("");

  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState("");

  const [conversationLoaded, setConversationLoaded] = useState(false);

  const isIssueClosed =
    issue.status === "RESOLVED" || issue.status === "CLOSED";

  // ----------------------------------------------------------
  // Fetch Conversation
  // ----------------------------------------------------------

  const loadConversation = useCallback(async () => {
    try {
      setConversationLoading(true);
      setConversationError("");

      const response = await getMyOrderIssueMessages(issue.id);

      setConversation(response);
      setConversationLoaded(true);
    } catch (error) {
      setConversationError(getErrorMessage(error));
    } finally {
      setConversationLoading(false);
    }
  }, [issue.id]);

  // ----------------------------------------------------------
  // Toggle Conversation
  // ----------------------------------------------------------

  const handleToggleConversation = async () => {
    const shouldOpen = !conversationOpen;

    setConversationOpen(shouldOpen);

    if (shouldOpen && !conversationLoaded) {
      await loadConversation();
    }
  };

  // ----------------------------------------------------------
  // Send Customer Reply
  // ----------------------------------------------------------

  const handleSendReply = async () => {
    const message = replyMessage.trim();

    if (!message || sendingReply) return;

    if (message.length > MAX_MESSAGE_LENGTH) {
      setConversationError(
        `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`
      );
      return;
    }

    if (isIssueClosed) {
      setConversationError(
        "This issue is resolved or closed. Replies are currently disabled."
      );
      return;
    }

    try {
      setSendingReply(true);
      setConversationError("");
      setReplySuccess("");

      const savedMessage = await sendMyOrderIssueMessage(
        issue.id,
        message
      );

      setConversation((current) => {
        if (!current) return current;

        if (
          current.messages.some(
            (existingMessage) => existingMessage.id === savedMessage.id
          )
        ) {
          return current;
        }

        return {
          ...current,
          messages: [...current.messages, savedMessage],
        };
      });

      setConversationLoaded(true);
      setReplyMessage("");
      setReplySuccess("Your reply has been sent successfully.");
    } catch (error) {
      setConversationError(getErrorMessage(error));
    } finally {
      setSendingReply(false);
    }
  };

  const handleReplyKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendReply();
    }
  };

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Card Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="min-w-0">
          <h2 className="break-words text-base font-semibold text-gray-700 md:text-xl">
            {issue.issueType}
          </h2>

          <p className="mt-1 text-xs text-slate-500 md:text-sm">
            Order:{" "}
            <span className="font-semibold text-gray-700">
              {issue.orderNumber}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 md:text-[11px]">
            Issue #{issue.id}
          </span>

          <StatusBadge status={issue.status} />
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-5 p-4 sm:p-5">
        {/* Original Message */}
        <div>
          <p className="mb-1 text-xs tracking-wider text-slate-500 md:text-sm">
            Your Original Message
          </p>

          <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-gray-700 md:text-sm">
            {issue.message}
          </p>
        </div>

        {/* Current Status */}
        <div className="rounded-xl border border-gray-100 bg-[#fffbfc] p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-[#B5697A]">
              {statusConfig.icon}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-700">
                Current Status: {statusConfig.label}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500 md:text-sm">
                {statusConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Order and Payment Status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SummaryStatus
            label="Order Status"
            value={formatStatus(issue.order?.orderStatus)}
          />

          <SummaryStatus
            label="Payment Status"
            value={formatStatus(issue.order?.paymentStatus)}
          />
        </div>

        {/* Dates */}
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Reported:{" "}
            <span className="text-slate-600">
              {formatDateTime(issue.createdAt)}
            </span>
          </p>

          <p>
            Last updated:{" "}
            <span className="text-gray-600">
              {formatDate(issue.updatedAt)}
            </span>
          </p>
        </div>

        {/* Conversation Toggle */}
        <div className="border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => void handleToggleConversation()}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#B5697A]/20 bg-[#B5697A]/5 p-4 text-left transition hover:bg-[#B5697A]/10"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#B5697A]">
                <MessageSquareText size={19} />
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-semibold text-gray-800">
                  Support Conversation
                </span>

                <span className="mt-1 block text-xs text-gray-500">
                  View messages and reply to our support team
                </span>
              </span>
            </span>

            <span className="shrink-0 text-xs font-semibold text-[#A85F70]">
              {conversationOpen ? "Hide" : "View Chat"}
            </span>
          </button>
        </div>

        {/* Conversation Panel */}
        {conversationOpen && (
          <section className="overflow-hidden rounded-xl border border-gray-200">
            {/* Conversation Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 p-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Messages
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Issue #{issue.id} · {issue.orderNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void loadConversation()}
                disabled={conversationLoading}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={
                    conversationLoading ? "animate-spin" : ""
                  }
                />
                Refresh
              </button>
            </div>

            {/* Message History */}
            <div className="space-y-4 bg-[#FAF8F8]/70 p-4">
              {conversationLoading && !conversation ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
                  <LoaderCircle
                    size={20}
                    className="animate-spin text-[#B5697A]"
                  />
                  Loading conversation...
                </div>
              ) : conversationError && !conversation ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                  <AlertCircle
                    size={22}
                    className="mx-auto text-red-500"
                  />

                  <p className="mt-2 text-sm text-red-700">
                    {conversationError}
                  </p>

                  <button
                    type="button"
                    onClick={() => void loadConversation()}
                    className="mt-3 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : !conversation?.messages.length ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center">
                  <MessageSquareText
                    size={28}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    No replies yet
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Send a message to start a conversation with our support team.
                  </p>
                </div>
              ) : (
                conversation.messages.map((message) => (
                  <ConversationMessage
                    key={message.id}
                    message={message}
                  />
                ))
              )}

              {conversationError && conversation && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
                >
                  {conversationError}
                </div>
              )}

              {replySuccess && (
                <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span>{replySuccess}</span>
                </div>
              )}
            </div>

            {/* Reply Composer */}
            <div className="border-t border-gray-100 bg-white p-4">
              {isIssueClosed ? (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      This issue is {statusConfig.label.toLowerCase()}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-800">
                      Replies are disabled for closed or resolved issues.
                      If you still need help, please contact our support team
                      or report a new issue.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <label
                    htmlFor={`reply-${issue.id}`}
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Write a reply
                  </label>

                  <textarea
                    id={`reply-${issue.id}`}
                    value={replyMessage}
                    onChange={(event) => {
                      setReplyMessage(event.target.value);
                      setConversationError("");
                      setReplySuccess("");
                    }}
                    onKeyDown={handleReplyKeyDown}
                    placeholder="Type your message to our support team..."
                    rows={3}
                    maxLength={MAX_MESSAGE_LENGTH}
                    disabled={sendingReply}
                    className="w-full resize-y rounded-xl border border-gray-200 px-3 py-3 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#B5697A] focus:ring-2 focus:ring-[#B5697A]/10 disabled:bg-gray-50"
                  />

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] text-gray-400">
                      Enter to send · Shift + Enter for a new line
                    </p>

                    <p className="text-[11px] text-gray-400">
                      {replyMessage.length}/{MAX_MESSAGE_LENGTH}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => void handleSendReply()}
                      disabled={
                        sendingReply ||
                        !replyMessage.trim() ||
                        replyMessage.trim().length > MAX_MESSAGE_LENGTH
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#B5697A] px-4 text-sm font-semibold text-white transition hover:bg-[#965264] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sendingReply ? (
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Send size={15} />
                      )}

                      {sendingReply ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

// ============================================================
// SUMMARY STATUS
// ============================================================

function SummaryStatus({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="break-words text-right text-xs font-semibold text-gray-700">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function MyIssuesPage() {
  const [issues, setIssues] = useState<CustomerOrderIssue[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalIssues, setTotalIssues] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------------------------------------
  // Fetch Issues
  // ----------------------------------------------------------

  const loadIssues = useCallback(
    async (requestedPage = 1, isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const response = await getMyOrderIssues(
          requestedPage,
          PAGE_SIZE
        );

        setIssues(response.data);
        setPage(response.pagination.page);
        setTotalPages(response.pagination.totalPages);
        setTotalIssues(response.pagination.total);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadIssues(1);
  }, [loadIssues]);

  // ----------------------------------------------------------
  // Pagination
  // ----------------------------------------------------------

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;

    void loadIssues(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Summary cards count the issues on the currently displayed page,
  // while Total Reports displays the overall API total.
  const openIssues = issues.filter(
    (issue) =>
      issue.status === "OPEN" ||
      issue.status === "IN_PROGRESS"
  ).length;

  const resolvedIssues = issues.filter(
    (issue) =>
      issue.status === "RESOLVED" ||
      issue.status === "CLOSED"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50/70 px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Back Navigation */}
        <Link
          to="/profile"
          className="mb-4 inline-flex items-center gap-1 text-xs text-[#A85F70] transition hover:text-[#8F4E60] hover:underline"
        >
          <ArrowLeft size={15} />
          Back to Profile
        </Link>

        {/* Page Header */}
        <section className="mb-7 overflow-hidden rounded-xl bg-gradient-to-br from-[#B5697A] to-[#965264] p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-xl font-semibold leading-snug tracking-wide text-white sm:text-2xl md:text-[28px]">
                My Reported Issues
              </h1>

              <p className="max-w-xl text-xs leading-relaxed text-white/85">
                Track your reported order problems, view replies from our
                support team, and send messages in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadIssues(page, true)}
              disabled={loading || refreshing}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/30 bg-white/10 px-4 text-xs text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </section>

        {/* Summary Cards */}
        {!loading && !error && totalIssues > 0 && (
          <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Total Reports"
              value={totalIssues}
              icon={<MessageSquareText size={16} />}
            />

            <SummaryCard
              label="Awaiting Resolution"
              value={openIssues}
              icon={<Clock3 size={16} />}
            />

            <SummaryCard
              label="Resolved / Closed"
              value={resolvedIssues}
              icon={<CheckCircle2 size={16} />}
            />
          </section>
        )}

        {/* Error */}
        {error && !loading && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5"
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                size={21}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-red-800">
                  Unable to load your issues
                </h2>

                <p className="mt-1 break-words text-sm leading-6 text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void loadIssues(page)}
                  className="mt-3 text-sm font-bold text-red-800 underline underline-offset-4"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 text-center">
            <LoaderCircle
              size={34}
              className="animate-spin text-[#B5697A]"
            />

            <p className="mt-4 text-sm font-semibold text-gray-700">
              Loading your reported issues...
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Please wait a moment.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && issues.length === 0 && (
          <section className="rounded-xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B5697A]/10 text-[#B5697A]">
              <FileQuestion size={26} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-gray-700 md:text-xl">
              No Issues Reported Yet
            </h2>

            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
              No issues reported yet. We're here to help if you need us!
            </p>

            <Link
              to="/orders"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#B5697A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#965264]"
            >
              View Orders
            </Link>
          </section>
        )}

        {/* Issue List */}
        {!loading && !error && issues.length > 0 && (
          <>
            <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold text-gray-700 md:text-base">
                Your Support History
              </h2>

              <p className="text-xs text-slate-500">
                {totalIssues}{" "}
                {totalIssues === 1 ? "issue" : "issues"} reported
              </p>
            </div>

            <div className="space-y-5">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-sm text-gray-500 sm:text-left">
                  Page{" "}
                  <span className="font-semibold text-gray-800">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1 || loading || refreshing}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:border-[#B5697A] hover:text-[#B5697A] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={
                      page >= totalPages || loading || refreshing
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:border-[#B5697A] hover:text-[#B5697A] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Support Footer */}
        {!loading && !error && (
          <div className="mt-5 rounded-xl border border-[#B5697A]/15 bg-[#B5697A]/5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 md:text-base">
                  Need help with another order?
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Visit your orders and use the order support option
                  to report a new problem.
                </p>
              </div>

              <Link
                to="/orders"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-[#B5697A] px-4 py-2 text-xs text-white transition-colors hover:bg-[#965264]"
              >
                View Orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{label}</p>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#B5697A]/10 text-[#B5697A]">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-gray-700 md:text-3xl">
        {value}
      </p>
    </div>
  );
}