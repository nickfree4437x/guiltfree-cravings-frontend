// src/api/msg91Api.ts
// MSG91 OTP Widget — Custom UI

// ─── Types ────────────────────────────────────────────────
interface Msg91SendResponse {
  reqId?: string;
  reqid?: string;
  requestId?: string;
  request_id?: string;
  [key: string]: unknown;
}

interface Msg91RetryResponse {
  reqId?: string;
  reqid?: string;
  requestId?: string;
  request_id?: string;
  [key: string]: unknown;
}

interface Msg91VerifyResponse {
  accessToken?: string;
  access_token?: string;
  access?: string;
  token?: string;
  jwt?: string;
  data?: unknown;
  response?: unknown;
  result?: unknown;
  message?: unknown;
  [key: string]: unknown;
}

interface Msg91WidgetConfiguration {
  widgetId: string;
  tokenAuth: string;
  identifier?: string;
  exposeMethods?: boolean;
  captchaRenderId?: string;
  success?: (data: unknown) => void;
  failure?: (error: unknown) => void;
}

interface Msg91Window {
  initSendOTP?: (config: Msg91WidgetConfiguration) => void;
  sendOtp?: (
    identifier: string,
    success?: (data: unknown) => void,
    failure?: (error: unknown) => void
  ) => void;
  retryOtp?: (
    channel: string | null,
    success?: (data: unknown) => void,
    failure?: (error: unknown) => void,
    reqId?: string
  ) => void;
  verifyOtp?: (
    otp: string | number,
    success?: (data: unknown) => void,
    failure?: (error: unknown) => void,
    reqId?: string
  ) => void;
  getWidgetData?: () => unknown;
  isCaptchaVerified?: () => boolean;
}

// ─── Config ───────────────────────────────────────────────
const MSG91_WIDGET_ID = import.meta.env.VITE_MSG91_WIDGET_ID as string | undefined;
const MSG91_TOKEN_AUTH = import.meta.env.VITE_MSG91_WIDGET_TOKEN as string | undefined;
const MSG91_WIDGET_SCRIPT = "https://verify.msg91.com/otp-provider.js";

const msg91Window = window as unknown as Msg91Window;

// ─── Internal State ───────────────────────────────────────
let scriptPromise: Promise<void> | null = null;
let widgetInitialized = false;
let currentRequestId: string | null = null; // only stored if SDK exposes one

// ─── Helpers ──────────────────────────────────────────────
function getConfigurationError(): Error | null {
  if (!MSG91_WIDGET_ID) return new Error("MSG91 Widget ID is not configured.");
  if (!MSG91_TOKEN_AUTH) return new Error("MSG91 Token Auth is not configured.");
  return null;
}

function normalizeToError(error: unknown, fallback: string): Error {
  return error instanceof Error ? error : new Error(fallback);
}

// ─── Load Script ──────────────────────────────────────────
function loadMsg91Script(): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(
      new Error("MSG91 Widget can only be initialized in the browser.")
    );
  }

  if (typeof msg91Window.initSendOTP === "function") return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${MSG91_WIDGET_SCRIPT}"]`
  );

  if (existingScript) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const handleLoad = () => {
        if (typeof msg91Window.initSendOTP === "function") resolve();
        else reject(new Error("MSG91 Widget loaded, but initialization method was not found."));
      };

      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Unable to load MSG91 Widget.")),
        { once: true }
      );

      if (typeof msg91Window.initSendOTP === "function") resolve();
    });
    return scriptPromise;
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = MSG91_WIDGET_SCRIPT;
    script.async = true;

    script.onload = () => {
      if (typeof msg91Window.initSendOTP !== "function") {
        reject(new Error("MSG91 Widget loaded, but initSendOTP was not found."));
        return;
      }
      resolve();
    };

    script.onerror = () => reject(new Error("Unable to load MSG91 OTP Widget."));

    document.head.appendChild(script);
  });

  return scriptPromise;
}

// ─── Initialize Widget ────────────────────────────────────
export async function initializeMsg91Widget(): Promise<void> {
  const configError = getConfigurationError();
  if (configError) throw configError;

  if (widgetInitialized) return;

  await loadMsg91Script();

  if (typeof msg91Window.initSendOTP !== "function") {
    throw new Error("MSG91 Widget initialization is unavailable.");
  }

  const configuration: Msg91WidgetConfiguration = {
    widgetId: MSG91_WIDGET_ID!,
    tokenAuth: MSG91_TOKEN_AUTH!,
    exposeMethods: true,
    captchaRenderId: "",
    success: () => {}, // handled via verifyOtp()
    failure: () => {}, // handled by individual methods
  };

  try {
    msg91Window.initSendOTP(configuration);
    widgetInitialized = true;
  } catch (error) {
    widgetInitialized = false;
    throw error;
  }
}

async function ensureInitialized(): Promise<void> {
  if (!widgetInitialized) await initializeMsg91Widget();
}

// ─── Extract Request ID ───────────────────────────────────
function extractRequestId(response: unknown): string | null {
  if (!response) return null;
  if (typeof response === "string") return response.trim() || null;
  if (typeof response !== "object") return null;

  const value = response as Record<string, unknown>;

  for (const key of ["reqId", "reqid", "requestId", "request_id"]) {
    const requestId = value[key];
    if (typeof requestId === "string" && requestId.trim()) return requestId.trim();
  }

  for (const key of ["data", "response", "result"]) {
    const nested = extractRequestId(value[key]);
    if (nested) return nested;
  }

  return null;
}

// ─── Normalize Response ───────────────────────────────────
function normalizeResponse<T extends { reqId?: string }>(
  response: unknown,
  requestId: string | null
): T {
  const normalized = {
    ...(typeof response === "object" && response !== null
      ? (response as Record<string, unknown>)
      : {}),
  } as T;

  if (requestId) normalized.reqId = requestId;

  return normalized;
}

// ─── Send OTP ─────────────────────────────────────────────
export async function sendMsg91Otp(phone: string): Promise<Msg91SendResponse> {
  await ensureInitialized();

  if (typeof msg91Window.sendOtp !== "function") {
    throw new Error("MSG91 send OTP method is unavailable.");
  }

  const identifier = phone.replace(/\D/g, "");
  if (!/^[6-9]\d{9}$/.test(identifier)) {
    throw new Error("Please enter a valid 10-digit Indian mobile number.");
  }

  currentRequestId = null; // new session

  return new Promise<Msg91SendResponse>((resolve, reject) => {
    try {
      msg91Window.sendOtp!(
        `91${identifier}`,
        (response) => {
          // Do NOT reject if reqId missing — SDK may track internally
          const requestId = extractRequestId(response);
          if (requestId) currentRequestId = requestId;
          resolve(normalizeResponse<Msg91SendResponse>(response, requestId));
        },
        (error) => reject(normalizeToError(error, "Unable to send OTP. Please try again."))
      );
    } catch (error) {
      reject(error);
    }
  });
}

// ─── Retry / Resend OTP ───────────────────────────────────
export async function retryMsg91Otp(reqId?: string | null): Promise<Msg91RetryResponse> {
  await ensureInitialized();

  if (typeof msg91Window.retryOtp !== "function") {
    throw new Error("MSG91 retry OTP method is unavailable.");
  }

  return new Promise<Msg91RetryResponse>((resolve, reject) => {
    try {
      const requestId = reqId || currentRequestId || undefined;

      msg91Window.retryOtp!(
        null,
        (response) => {
          const newRequestId = extractRequestId(response);
          if (newRequestId) currentRequestId = newRequestId;
          resolve(normalizeResponse<Msg91RetryResponse>(response, newRequestId));
        },
        (error) => reject(normalizeToError(error, "Unable to resend OTP. Please try again.")),
        requestId
      );
    } catch (error) {
      reject(error);
    }
  });
}

// ─── Verify OTP ───────────────────────────────────────────
export async function verifyMsg91Otp(
  otp: string,
  reqId?: string | null
): Promise<Msg91VerifyResponse> {
  await ensureInitialized();

  if (typeof msg91Window.verifyOtp !== "function") {
    throw new Error("MSG91 verify OTP method is unavailable.");
  }

  if (!/^\d{4}$/.test(otp)) {
    throw new Error("Please enter a valid 4-digit OTP.");
  }

  return new Promise<Msg91VerifyResponse>((resolve, reject) => {
    try {
      const requestId = reqId || currentRequestId || undefined;

      // reqId optional — SDK tracks internal OTP session if not provided
      msg91Window.verifyOtp!(
        otp,
        (response) => {
          if (response && typeof response === "object") {
            resolve(response as Msg91VerifyResponse);
            return;
          }
          resolve({
            accessToken: typeof response === "string" ? response : undefined,
          });
        },
        (error) => reject(normalizeToError(error, "Invalid OTP. Please try again.")),
        requestId
      );
    } catch (error) {
      reject(error);
    }
  });
}