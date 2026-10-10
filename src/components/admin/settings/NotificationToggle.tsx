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
        <p className="text-[13px] font-semibold tracking-[-0.01em] text-[#3D3834]">
          {label}
        </p>

        <p className="mt-0 text-[12px] leading-5 text-[#8B7A6C]">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-[#B5697A]/20 focus:ring-offset-2",
          checked
            ? "bg-[#B5697A]"
            : "bg-[#DCD4CC]",
        ].join(" ")}
        aria-label={ariaLabel}
        aria-pressed={checked}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-all duration-200",
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