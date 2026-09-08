// src/components/admin/auth/types.ts

export interface LocationState {
  from?: {
    pathname?: string;
  };
}

export type ForgotPasswordStep = 
  | "email" 
  | "otp" 
  | "reset" 
  | "success";

export const REMEMBER_ADMIN_EMAIL_KEY = "guiltfree-admin-remembered-email";
export const OTP_LENGTH = 6;
export const OTP_RESEND_COOLDOWN = 60;