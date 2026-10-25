// ─── Config ───────────────────────────────────────────────
const MSG91_SCRIPT_ID = "msg91-otp-widget-script";
const MSG91_SCRIPT_URL = "https://verify.msg91.com/otp-provider.js";

let scriptPromise: Promise<void> | null = null;
let widgetInitialized = false;

// ─── Env Config ───────────────────────────────────────────
const getWidgetId = (): string => {
  const id = import.meta.env.VITE_MSG91_WIDGET_ID;
  if (!id) throw new Error("VITE_MSG91_WIDGET_ID is not configured.");
  return id;
};

const getWidgetToken = (): string => {
  const token = import.meta.env.VITE_MSG91_WIDGET_TOKEN;
  if (!token) throw new Error("VITE_MSG91_WIDGET_TOKEN is not configured.");
  return token;
};

// ─── Load Script (cached) ─────────────────────────────────
const loadMsg91Script = (): Promise<void> => {
  if (window.initSendOTP) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(MSG91_SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Unable to load MSG91 OTP SDK.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = MSG91_SCRIPT_ID;
    script.src = MSG91_SCRIPT_URL;
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Unable to load MSG91 OTP SDK."));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
};

// ─── Init Widget (once) ───────────────────────────────────
export const initializeMsg91Widget = async (): Promise<void> => {
  await loadMsg91Script();
  if (widgetInitialized) return;

  if (!window.initSendOTP) {
    throw new Error("MSG91 OTP SDK loaded but initSendOTP is unavailable.");
  }

  const configuration: Msg91Configuration = {
    widgetId: getWidgetId(),
    tokenAuth: getWidgetToken(),
    exposeMethods: true,
    success: (data: Msg91OtpResponse) => {
      console.log("MSG91 WIDGET SUCCESS:", data);
    },
    failure: (error: unknown) => {
      console.error("MSG91 WIDGET FAILURE:", error);
    },
  };

  window.initSendOTP(
    configuration as Parameters<NonNullable<typeof window.initSendOTP>>[0]
  );
  widgetInitialized = true;
};

// ─── Types ────────────────────────────────────────────────
export interface Msg91SendOtpResult {
  response: Msg91OtpResponse;
  reqId: string | null;
}

// ─── Extract reqId (multi-shape) ──────────────────────────
const REQ_ID_KEYS = ["reqId", "reqid", "req_id", "requestId", "requestID", "request_id"];

const findReqId = (obj: Record<string, unknown>): string | null => {
  for (const key of REQ_ID_KEYS) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  // MSG91 Web SDK may put it in "message"
  if (typeof obj.message === "string" && obj.message.trim()) return obj.message.trim();
  return null;
};

const extractReqId = (response: unknown): string | null => {
  if (!response || typeof response !== "object") return null;

  const obj = response as Record<string, unknown>;

  // Direct match
  const direct = findReqId(obj);
  if (direct) return direct;

  // Nested: data / response
  for (const key of ["data", "response"]) {
    const nested = obj[key];
    if (!nested || typeof nested !== "object") continue;
    const nestedReqId = findReqId(nested as Record<string, unknown>);
    if (nestedReqId) return nestedReqId;
  }

  return null;
};

// ─── Send OTP ─────────────────────────────────────────────
export const sendMsg91Otp = async (phone: string): Promise<Msg91SendOtpResult> => {
  await initializeMsg91Widget();

  if (!window.sendOtp) {
    throw new Error("MSG91 sendOtp method is unavailable.");
  }

  const identifier = `91${phone}`;

  return new Promise((resolve, reject) => {
    window.sendOtp!(
      identifier,
      (data) => {
        console.log("MSG91 SEND OTP RAW RESPONSE:", data);

        let reqId = extractReqId(data);

        // Some SDK versions expose widget data
        if (!reqId && window.getWidgetData) {
          try {
            const widgetData = window.getWidgetData();
            console.log("MSG91 WIDGET DATA:", widgetData);
            reqId = extractReqId(widgetData);
          } catch (widgetError) {
            console.warn("Unable to read MSG91 widget data:", widgetError);
          }
        }

        console.log("MSG91 EXTRACTED REQ ID:", reqId);
        resolve({ response: data, reqId });
      },
      (error) => {
        console.error("MSG91 SEND OTP RAW ERROR:", error);
        reject(error);
      }
    );
  });
};

// ─── Verify OTP ───────────────────────────────────────────
export const verifyMsg91Otp = async (
  otp: string,
  reqId?: string | null
): Promise<Msg91OtpResponse> => {
  await initializeMsg91Widget();

  if (!window.verifyOtp) {
    throw new Error("MSG91 verifyOtp method is unavailable.");
  }

  return new Promise((resolve, reject) => {
    window.verifyOtp!(
      otp,
      (data) => {
        console.log("MSG91 VERIFY OTP RESPONSE:", data);
        resolve(data);
      },
      (error) => {
        console.error("MSG91 VERIFY OTP ERROR:", error);
        reject(error);
      },
      reqId || undefined
    );
  });
};

// ─── Retry OTP ────────────────────────────────────────────
export const retryMsg91Otp = async (
  reqId?: string | null
): Promise<Msg91OtpResponse> => {
  await initializeMsg91Widget();

  if (!window.retryOtp) {
    throw new Error("MSG91 retryOtp method is unavailable.");
  }

  return new Promise((resolve, reject) => {
    window.retryOtp!(
      "11",
      (data) => {
        console.log("MSG91 RETRY OTP RESPONSE:", data);
        resolve(data);
      },
      (error) => {
        console.error("MSG91 RETRY OTP ERROR:", error);
        reject(error);
      },
      reqId || undefined
    );
  });
};