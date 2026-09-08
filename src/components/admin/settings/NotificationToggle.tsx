// src/components/admin/settings/NotificationToggle.tsx

interface NotificationToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description: string;
  ariaLabel: string;
}

function NotificationToggle({
  checked,
  onChange,
  label,
  description,
  ariaLabel,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between gap-5 px-5 py-5 sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8b542f]/20 focus:ring-offset-2",
          checked
            ? "bg-[#8b542f]"
            : "bg-slate-200",
        ].join(" ")}
        aria-label={ariaLabel}
        aria-pressed={checked}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-200",
            checked
              ? "left-6"
              : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export default NotificationToggle;