// src/pages/admin/settings/AdminSettingsPage.tsx

import {
  useState,
} from "react";

import {
  useAdminAuthStore,
} from "../../../store/adminAuthStore";

import AdminSettingsHeader from "../../../components/admin/settings/AdminSettingsHeader";
import AdminProfileSection from "../../../components/admin/settings/AdminProfileSection";
import ChangePasswordSection from "../../../components/admin/settings/ChangePasswordSection";
import NotificationsSection from "../../../components/admin/settings/NotificationsSection";

function AdminSettingsPage() {
  const admin = useAdminAuthStore(
    (state) => state.admin
  );


  /*
   * =========================================================
   * NOTIFICATIONS
   * =========================================================
   */

  const [
    orderNotifications,
    setOrderNotifications,
  ] = useState(true);

  const [
    paymentNotifications,
    setPaymentNotifications,
  ] = useState(true);

  const [
    customerNotifications,
    setCustomerNotifications,
  ] = useState(false);


  /*
   * =========================================================
   * SAVE STATE
   * =========================================================
   */

  const [saved, setSaved] =
    useState(false);


  /*
   * =========================================================
   * SAVE SETTINGS
   * =========================================================
   *
   * Actual settings API baad mein connect
   * ki ja sakti hai.
   */

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };


  return (
    <div className="min-h-screen bg-[#fffaf5] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <AdminSettingsHeader />


        {/* =================================================
            SETTINGS CONTENT
        ================================================= */}

        <div className="mt-8 space-y-6">

          {/* =================================================
              ADMIN PROFILE
          ================================================= */}

          <AdminProfileSection
            admin={admin}
          />


          {/* =================================================
              CHANGE PASSWORD
          ================================================= */}

          <ChangePasswordSection />


          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <NotificationsSection
            orderNotifications={
              orderNotifications
            }
            paymentNotifications={
              paymentNotifications
            }
            customerNotifications={
              customerNotifications
            }
            onOrderNotificationsChange={() =>
              setOrderNotifications(
                (current) =>
                  !current
              )
            }
            onPaymentNotificationsChange={() =>
              setPaymentNotifications(
                (current) =>
                  !current
              )
            }
            onCustomerNotificationsChange={() =>
              setCustomerNotifications(
                (current) =>
                  !current
              )
            }
          />

        </div>
      </div>
    </div>
  );
}

export default AdminSettingsPage;