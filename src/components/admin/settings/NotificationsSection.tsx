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
    <section className="overflow-hidden rounded-xl border border-[#EFE3D2] bg-white shadow-sm">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="border-b border-[#EFE3D2] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-start gap-4">

          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[#1F4A2E] sm:text-[18px]">
              Notifications
            </h2>

            <p className="mt-0 text-[13px] leading-5 text-[#8B7A6C]">
              Choose which admin notifications you want
              to receive.
            </p>
          </div>

        </div>
      </div>

      {/* =====================================================
          TOGGLES
          ===================================================== */}

      <div className="divide-y divide-[#EFE3D2]">

        <NotificationToggle
          label="New Order Notifications"
          description="Get notified when a new order is created."
          checked={orderNotifications}
          onChange={onOrderNotificationsChange}
          ariaLabel="Toggle order notifications"
        />

        <NotificationToggle
          label="Payment Notifications"
          description="Get notified about successful or failed payments."
          checked={paymentNotifications}
          onChange={onPaymentNotificationsChange}
          ariaLabel="Toggle payment notifications"
        />

        <NotificationToggle
          label="Customer Notifications"
          description="Receive notifications for important customer account activity."
          checked={customerNotifications}
          onChange={onCustomerNotificationsChange}
          ariaLabel="Toggle customer notifications"
        />

      </div>
    </section>
  );
}

export default NotificationsSection;