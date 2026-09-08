// src/components/admin/settings/NotificationsSection.tsx

import NotificationToggle from "./NotificationToggle";

interface NotificationsSectionProps {
  orderNotifications: boolean;
  paymentNotifications: boolean;
  customerNotifications: boolean;
  onOrderNotificationsChange: () => void;
  onPaymentNotificationsChange: () => void;
  onCustomerNotificationsChange: () => void;
}

function NotificationsSection({
  orderNotifications,
  paymentNotifications,
  customerNotifications,
  onOrderNotificationsChange,
  onPaymentNotificationsChange,
  onCustomerNotificationsChange,
}: NotificationsSectionProps) {
  return (
    <section className="rounded-xl border border-[#eadfd3] bg-white shadow-sm">
      {/* HEADER */}

      <div className="border-b border-[#eadfd3] px-5 py-5 sm:px-6">
        <h2 className="text-lg font-bold text-slate-900">
          Notifications
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose which admin notifications you want
          to receive.
        </p>
      </div>

      {/* TOGGLES */}

      <div className="divide-y divide-[#eadfd3]">
        <NotificationToggle
          label="New Order Notifications"
          description="Get notified when a new order is created."
          checked={orderNotifications}
          onChange={
            onOrderNotificationsChange
          }
          ariaLabel="Toggle order notifications"
        />

        <NotificationToggle
          label="Payment Notifications"
          description="Get notified about successful or failed payments."
          checked={paymentNotifications}
          onChange={
            onPaymentNotificationsChange
          }
          ariaLabel="Toggle payment notifications"
        />

        <NotificationToggle
          label="Customer Notifications"
          description="Receive notifications for important customer account activity."
          checked={customerNotifications}
          onChange={
            onCustomerNotificationsChange
          }
          ariaLabel="Toggle customer notifications"
        />
      </div>
    </section>
  );
}

export default NotificationsSection;