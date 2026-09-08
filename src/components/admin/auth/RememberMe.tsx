// src/components/admin/auth/RememberMe.tsx
interface RememberMeProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const RememberMe = ({ checked, onChange, disabled = false }: RememberMeProps) => {
  return (
    <label
      htmlFor="remember-admin-email"
      className="group inline-flex cursor-pointer items-center gap-2.5"
    >
      <input
        id="remember-admin-email"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        className="h-4 w-4 cursor-pointer border-[#d9c7b7] text-[#8b542f] rounded-xl disabled:cursor-not-allowed disabled:opacity-50"
      />
      <span className="text-sm text-slate-600 transition-colors group-hover:text-slate-900">
        Remember me
      </span>
    </label>
  );
};