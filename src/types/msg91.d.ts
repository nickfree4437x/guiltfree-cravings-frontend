export {};

declare global {
  // ─── MSG91 Response ─────────────────────────────────────
  interface Msg91OtpResponse {
    reqId?: string;
    reqid?: string;
    req_id?: string;

    accessToken?: string;
    access_token?: string;
    "access-token"?: string;

    token?: string;

    data?: {
      reqId?: string;
      reqid?: string;
      req_id?: string;
      accessToken?: string;
      access_token?: string;
      "access-token"?: string;
      token?: string;
      [key: string]: unknown;
    };

    [key: string]: unknown;
  }

  // ─── MSG91 Error ────────────────────────────────────────
  interface Msg91OtpError {
    message?: string;
    error?: string;
    msg?: string;
    [key: string]: unknown;
  }

  // ─── MSG91 Configuration ────────────────────────────────
  interface Msg91Configuration {
    widgetId: string;
    tokenAuth: string;
    identifier?: string;
    exposeMethods: boolean;
    captchaRenderId?: string;
    success?: (data: Msg91OtpResponse) => void;
    failure?: (error: Msg91OtpError) => void;
  }

  // ─── Window Extensions ──────────────────────────────────
  interface Window {
    initSendOTP?: (configuration: Msg91Configuration) => void;

    sendOtp?: (
      identifier: string,
      success?: (data: Msg91OtpResponse) => void,
      failure?: (error: Msg91OtpError) => void
    ) => void;

    retryOtp?: (
      channel: string | null,
      success?: (data: Msg91OtpResponse) => void,
      failure?: (error: Msg91OtpError) => void,
      reqId?: string
    ) => void;

    verifyOtp?: (
      otp: string | number,
      success?: (data: Msg91OtpResponse) => void,
      failure?: (error: Msg91OtpError) => void,
      reqId?: string
    ) => void;

    getWidgetData?: () => unknown;
    isCaptchaVerified?: () => boolean;
  }
}