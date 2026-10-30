import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  AlertCircle,
  LoaderCircle,
  CheckCircle2,
  MessageSquareText,
  UserRound,
  MapPin,
  ShoppingBag,
  CreditCard,
  Package,
  ChevronDown,
  Check,
  Send,
  RefreshCw,
  Clock3,
  FileText,
} from "lucide-react";

import {
  getAdminOrderIssueById,
  updateAdminOrderIssueStatus,
  getAdminOrderIssueMessages,
  sendAdminOrderIssueMessage,
} from "../../../api/adminApi";

import type {
  AdminOrderIssueMessage,
  AdminOrderIssueConversation,
} from "../../../api/adminApi";

import type {
  AdminOrderIssue,
  OrderIssueStatus,
} from "../../../components/admin/order-issue/OrderIssueTypes";

import { STATUS_OPTIONS } from "../../../components/admin/order-issue/OrderIssueTypes";
import { StatusBadge } from "../../../components/admin/order-issue/OrderIssueStatusBadge";

import {
  formatDateTime,
  formatStatus,
  formatCurrency,
  getErrorMessage,
} from "../../../components/admin/order-issue/orderIssueUtils";

export default function AdminOrderIssueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [issue, setIssue] = useState<AdminOrderIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStatus, setSelectedStatus] = useState<OrderIssueStatus>("OPEN");
  const [saving, setSaving] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  const [conversation, setConversation] = useState<AdminOrderIssueConversation | null>(null);
  const [conversationLoading, setConversationLoading] = useState(true);
  const [conversationError, setConversationError] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState("");

  useEffect(() => {
    let active = true;
    const fetchIssue = async () => {
      if (!id) return setError("Issue ID is missing.");
      const issueId = Number(id);
      if (!Number.isSafeInteger(issueId) || issueId <= 0) return setError("Invalid issue ID.");
      try {
        setLoading(true);
        setError("");
        const data = await getAdminOrderIssueById(issueId);
        if (!active) return;
        setIssue(data);
        setSelectedStatus(data.status);
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchIssue();
    return () => { active = false; };
  }, [id]);

  const fetchConversation = useCallback(async () => {
    if (!id) return setConversationError("Issue ID is missing.");
    const issueId = Number(id);
    if (!Number.isSafeInteger(issueId) || issueId <= 0) return setConversationError("Invalid issue ID.");
    try {
      setConversationLoading(true);
      setConversationError("");
      const data = await getAdminOrderIssueMessages(issueId);
      setConversation(data);
    } catch (err) {
      setConversationError(getErrorMessage(err));
    } finally {
      setConversationLoading(false);
    }
  }, [id]);

  useEffect(() => { void fetchConversation(); }, [fetchConversation]);

  const handleUpdateStatus = async () => {
    if (!issue || selectedStatus === issue.status || saving) return;
    try {
      setSaving(true);
      setUpdateError("");
      setUpdateSuccess("");
      const updatedIssue = await updateAdminOrderIssueStatus(issue.id, selectedStatus);
      setIssue(updatedIssue);
      setSelectedStatus(updatedIssue.status);
      setUpdateSuccess("Status updated successfully.");
      await fetchConversation();
    } catch (err) {
      setUpdateError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSendReply = async () => {
    if (!issue || sendingReply) return;
    const message = replyMessage.trim();
    if (!message) return setConversationError("Please enter a message.");
    if (message.length > 2000) return setConversationError("Message cannot exceed 2000 characters.");
    if (issue.status === "RESOLVED" || issue.status === "CLOSED") {
      return setConversationError("This issue is closed. Reopen it to reply.");
    }
    try {
      setSendingReply(true);
      setConversationError("");
      setReplySuccess("");
      const savedMessage = await sendAdminOrderIssueMessage(issue.id, message);
      setConversation((current) => {
        if (!current) return current;
        if (current.messages.some((m) => m.id === savedMessage.id)) return current;
        return { ...current, messages: [...current.messages, savedMessage] };
      });
      setReplyMessage("");
      setReplySuccess("Reply sent successfully.");
    } catch (err) {
      setConversationError(getErrorMessage(err));
    } finally {
      setSendingReply(false);
    }
  };

  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendReply();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F8] p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-5 shadow-sm">
          <LoaderCircle size={22} className="animate-spin text-[#B5697A]" />
          <span className="text-sm font-medium text-gray-700">Loading details...</span>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F8] p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertCircle size={24} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-gray-900">Unable to load issue</h2>
          <p className="mt-2 text-sm text-gray-500">{error || "Issue not found."}</p>
          <button onClick={() => navigate("/admin/order-issues")} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <ArrowLeft size={16} /> Back to Issues
          </button>
        </div>
      </div>
    );
  }

  const order = issue.order;
  const address = [order.addressLine1, order.addressLine2, order.area, order.city, order.state, order.pincode].filter(Boolean).join(", ");
  const isIssueClosed = issue.status === "RESOLVED" || issue.status === "CLOSED";

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Back Button */}
        <button onClick={() => navigate("/admin/order-issues")} className="inline-flex  items-center gap-2 text-[11px] md:text-[12px] text-[#B5697A] hover:underline">
          <ArrowLeft size={16} /> Back to Order Issues
        </button>

        {/* Page Header */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B5697A]/10 text-[#B5697A]">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="text-[18px] md:text-[20px] font-semibold text-gray-700">Issue #{issue.id}</h1>
              <p className="mt-0 text-[11px] md:text-[12px] text-slate-500">Order {issue.orderNumber}</p>
            </div>
          </div>
          <div className="shrink-0 self-start sm:self-center">
            <StatusBadge status={issue.status} />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Issue Details */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeading>Issue Details</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <InfoItem label="Issue Type">{issue.issueType}</InfoItem>
                <InfoItem label="Reported On">{formatDateTime(issue.createdAt)}</InfoItem>
              </div>
              <InfoItem label="Customer Message">
                <div className="mt-1 whitespace-pre-wrap rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  {issue.message}
                </div>
              </InfoItem>
            </div>

            {/* Customer & Order Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <SectionHeading>Customer Info</SectionHeading>
                <div className="space-y-4">
                  <InfoItem label="Name">{order.customerName || "—"}</InfoItem>
                  <InfoItem label="Phone">{order.customerPhone || "—"}</InfoItem>
                  <InfoItem label="Email">{order.customerEmail || "Not provided"}</InfoItem>
                  <InfoItem label="Delivery Address">
                    <div className="flex items-start gap-2">
                      <MapPin size={15} className="mt-0.5 shrink-0 text-[#B5697A]" />
                      <span>{address || "No address available"}</span>
                    </div>
                  </InfoItem>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <SectionHeading>Order Info</SectionHeading>
                <div className="space-y-4">
                  <InfoItem label="Order Date">{formatDateTime(order.createdAt)}</InfoItem>
                  <InfoItem label="Order Status">{formatStatus(order.orderStatus)}</InfoItem>
                  <InfoItem label="Payment Status">{formatStatus(order.paymentStatus)}</InfoItem>
                  <InfoItem label="Total Amount">
                    <span className="text-base font-bold text-[#B5697A]">{formatCurrency(order.totalAmount)}</span>
                  </InfoItem>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeading>Order Items ({order.items?.length ?? 0})</SectionHeading>
              {!order.items?.length ? (
                <p className="text-sm text-slate-500">No items available.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{item.productName}</p>
                        <p className="mt-1 text-xs text-gray-500">{item.variantQuantity} {item.variantUnit} · {item.packaging}</p>
                        <p className="mt-1 text-xs text-gray-500">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-gray-900">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                  <div className="pt-3 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                    <div className="flex justify-between text-sm text-gray-600"><span>Discount</span><span>- {formatCurrency(order.discountAmount)}</span></div>
                    <div className="flex justify-between text-sm font-semibold text-gray-800 border-t border-gray-200 pt-2"><span>Total</span><span>{formatCurrency(order.totalAmount)}</span></div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            
            {/* Status Management */}
            <div className="rounded-xl border border-[#B5697A]/20 bg-white p-5 shadow-sm">
              <h3 className="text-[12px] md:text-[13px] font-semibold text-gray-700 mb-1">Manage Status</h3>
              <p className="text-xs text-gray-500 mb-4">Update the issue resolution status.</p>
              
              {updateError && <FeedbackMessage type="error" message={updateError} />}
              {updateSuccess && <FeedbackMessage type="success" message={updateSuccess} />}

              <div className="mt-3 space-y-3">
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => { setSelectedStatus(e.target.value as OrderIssueStatus); setUpdateError(""); setUpdateSuccess(""); }}
                    disabled={saving}
                    className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-10 text-[13px] text-gray-800 outline-none focus:border-[#B5697A] disabled:bg-gray-100"
                  >
                    {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <ChevronDown size={17} className="pointer-events-none absolute right-3 top-3 text-gray-400" />
                </div>
                <button
                  onClick={() => void handleUpdateStatus()}
                  disabled={saving || selectedStatus === issue.status}
                  className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#B5697A] px-5 text-sm text-white transition hover:bg-[#a65a6b] disabled:opacity-50"
                >
                  {saving ? <LoaderCircle size={17} className="animate-spin" /> : <Check size={17} />}
                  {saving ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>

            {/* Payment History */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
  <SectionHeading>Payments</SectionHeading>
  
  {!order.payments?.length ? (
    <p className="text-sm text-slate-500">No payments recorded.</p>
  ) : (
    <div className="space-y-3">
      {order.payments.map((payment) => (
        <div key={payment.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-gray-800">
              #{payment.id}
            </p>
            
            {/* ✅ FIX: payment.amount ki jagah order.totalAmount use kiya */}
            <p className="text-sm font-bold text-[#B5697A]">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
          
          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>{formatStatus(payment.status)}</span>
            <span>{formatDateTime(payment.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

          </div>
        </div>

        {/* Conversation Section (Full Width) */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Conversation</h3>
                <p className="text-xs text-slate-500">Messages with the customer</p>
              </div>
            </div>
            <button
              onClick={() => void fetchConversation()}
              disabled={conversationLoading}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={14} className={conversationLoading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>

          <div className="bg-[#FAF8F8]/50 p-4 sm:p-5 h-[400px] overflow-y-auto space-y-4">
            {conversationLoading && !conversation ? (
              <div className="flex justify-center py-10"><LoaderCircle className="animate-spin text-[#B5697A]" /></div>
            ) : !conversation?.messages?.length ? (
              <div className="text-center py-10">
                <MessageSquareText size={30} className="mx-auto text-gray-300" />
                <p className="mt-3 text-sm text-gray-600">No messages yet</p>
                <p className="text-xs text-gray-400">Start the conversation below.</p>
              </div>
            ) : (
              conversation.messages.map((msg) => <ConversationMessage key={msg.id} message={msg} />)
            )}
            {conversationError && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{conversationError}</div>}
            {replySuccess && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{replySuccess}</div>}
          </div>

          <div className="border-t border-gray-100 p-4 sm:p-5 bg-white">
            {isIssueClosed ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                <AlertCircle size={19} className="text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm text-amber-900">Conversation Closed</p>
                  <p className="text-xs text-amber-800 mt-1">Change status to OPEN or IN PROGRESS to reply.</p>
                </div>
              </div>
            ) : (
              <>
                <textarea
                  value={replyMessage}
                  onChange={(e) => { setReplyMessage(e.target.value); setConversationError(""); setReplySuccess(""); }}
                  onKeyDown={handleReplyKeyDown}
                  placeholder="Type your response..."
                  rows={3}
                  maxLength={2000}
                  disabled={sendingReply}
                  className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-[12px] md:text-[13px] text-gray-700 outline-none focus:border-[#B5697A] disabled:bg-gray-50"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{replyMessage.length}/2000</span>
                  <button
                    onClick={() => void handleSendReply()}
                    disabled={sendingReply || !replyMessage.trim()}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#B5697A] px-5 text-sm text-white hover:bg-[#a65a6b] disabled:opacity-50"
                  >
                    {sendingReply ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
                    {sendingReply ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Helpers

function ConversationMessage({ message }: { message: AdminOrderIssueMessage }) {
  const isAdmin = message.senderType === "ADMIN";
  return (
    <div className={`flex w-full ${isAdmin ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
        <div className={`flex items-center gap-1.5 px-1 mb-1 text-xs ${isAdmin ? "text-[#B5697A]" : "text-gray-600"}`}>
          {isAdmin ? <MessageSquareText size={13} /> : <UserRound size={13} />}
          <span>{isAdmin ? "Support Team" : "Customer"}</span>
        </div>
        <div className={`rounded-xl px-4 py-2 text-[11px] md:text-[12px] ${isAdmin ? "rounded-tr-sm bg-[#B5697A] text-white" : "rounded-tl-sm border border-gray-200 bg-white text-gray-800"}`}>
          <p className="whitespace-pre-wrap break-words leading-relaxed">{message.message}</p>
        </div>
        <div className={`mt-1 flex items-center gap-1 px-1 text-[11px] text-slate-500 ${isAdmin ? "justify-end" : "justify-start"}`}>
          <Clock3 size={11} /> {formatDateTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode; }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-[12px] md:text-[14px] font-semibold text-gray-700">
      {children}
    </h3>
  );
}

function InfoItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-[11px] tracking-wide text-slate-500">{label}</p>
      <div className="text-[12px] md:text-[13px] text-gray-800 break-words">{children}</div>
    </div>
  );
}

function FeedbackMessage({ type, message }: { type: "error" | "success"; message: string }) {
  return (
    <div className={`flex items-start gap-2 rounded-lg border p-2.5 text-xs mt-2 ${type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
      {type === "error" ? <AlertCircle size={16} className="shrink-0" /> : <CheckCircle2 size={16} className="shrink-0" />}
      <span>{message}</span>
    </div>
  );
}