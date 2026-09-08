// src/components/admin/auth/PasswordRequirements.tsx
import { ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';

interface PasswordRequirementsProps {
  password: string;
}

export const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  const requirements = useMemo(() => [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number",
      valid: /\d/.test(password),
    },
    {
      label: "One special character",
      valid: /[!@#$%^&*(),.?":{}|<>\-+=/\\[\]_]/.test(password),
    },
  ], [password]);

  const allValid = requirements.every((req) => req.valid);

  return (
    <div className="rounded-xl border border-[#eadfd3] bg-[#fffaf5] px-4 py-4">
      <div className="flex items-center gap-2">
        <ShieldCheck
          className="h-4 w-4 text-[#8b542f]"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
          Password Requirements
        </p>
      </div>

      <div className="mt-3 grid gap-2">
        {requirements.map((requirement) => (
          <div key={requirement.label} className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                requirement.valid ? "bg-[#8b542f]" : "bg-slate-300"
              }`}
              aria-hidden="true"
            />
            <span
              className={`text-xs ${
                requirement.valid ? " text-[#8b542f]" : "text-slate-500"
              }`}
            >
              {requirement.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};