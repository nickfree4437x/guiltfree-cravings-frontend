import { Bell } from "lucide-react";

function AdminNotifications() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      title="Notifications"
      className="
        relative
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-[#EADBD0]
        bg-white
        text-[#6F6259]
        hover:border-[#D9B8C1]
        hover:bg-[#FDF4F6]
        hover:text-[#B5697A]
        focus:outline-none
      "
    >
      <Bell
        className="h-[18px] w-[18px]"
        strokeWidth={1.8}
        aria-hidden="true"
      />

      {/* Notification indicator */}
      <span
        className="
          absolute
          right-[8px]
          top-[8px]
          h-1.5
          w-1.5
          rounded-full
          bg-[#B5697A]
          ring-2
          ring-white
        "
        aria-hidden="true"
      />
    </button>
  );
}

export default AdminNotifications;