const MSG91_SCRIPT_ID = "msg91-otp-widget-script";

const MSG91_SCRIPT_URL =
  "https://verify.msg91.com/otp-provider.js";

let scriptPromise: Promise<void> | null = null;
let widgetInitialized = false;

/*
 * =========================================================
 * MSG91 CONFIG
 * =========================================================
 */

const getWidgetId = (): string => {
  const widgetId =
    import.meta.env.VITE_MSG91_WIDGET_ID;

  if (!widgetId) {
    throw new Error(
      "VITE_MSG91_WIDGET_ID is not configured."
    );
  }

  return widgetId;
};

const getWidgetToken = (): string => {
  const token =
    import.meta.env.VITE_MSG91_WIDGET_TOKEN;

  if (!token) {
    throw new Error(
      "VITE_MSG91_WIDGET_TOKEN is not configured."
    );
  }

  return token;
};

/*
 * =========================================================
 * LOAD MSG91 SCRIPT
 * =========================================================
 */

const loadMsg91Script = (): Promise<void> => {
  if (window.initSendOTP) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<void>(
    (resolve, reject) => {
      const existingScript =
        document.getElementById(
          MSG91_SCRIPT_ID
        ) as HTMLScriptElement | null;

      if (existingScript) {
        existingScript.addEventListener(
          "load",
          () => resolve(),
          { once: true }
        );

        existingScript.addEventListener(
          "error",
          () => {
            reject(
              new Error(
                "Unable to load MSG91 OTP SDK."
              )
            );
          },
          { once: true }
        );

        return;
      }

      const script =
        document.createElement("script");

      script.id = MSG91_SCRIPT_ID;
      script.src = MSG91_SCRIPT_URL;
      script.type = "text/javascript";
      script.async = true;

      script.onload = () => resolve();

      script.onerror = () => {
        scriptPromise = null;

        reject(
          new Error(
            "Unable to load MSG91 OTP SDK."
          )
        );
      };

      document.head.appendChild(script);
    }
  );

  return scriptPromise;
};

/*
 * =========================================================
 * INITIALIZE MSG91 WIDGET
 * =========================================================
 */

export const initializeMsg91Widget =
  async (): Promise<void> => {
    await loadMsg91Script();

    if (widgetInitialized) {
      return;
    }

    if (!window.initSendOTP) {
      throw new Error(
        "MSG91 OTP SDK loaded but initSendOTP is unavailable."
      );
    }

    const configuration: Msg91Configuration = {
      widgetId: getWidgetId(),
      tokenAuth: getWidgetToken(),

      exposeMethods: true,

      success: (data: Msg91OtpResponse) => {
        console.log(
          "MSG91 WIDGET SUCCESS:",
          data
        );
      },

      failure: (error: unknown) => {
        console.error(
          "MSG91 WIDGET FAILURE:",
          error
        );
      },
    };

    window.initSendOTP(
      configuration as Parameters<
        NonNullable<typeof window.initSendOTP>
      >[0]
    );

    widgetInitialized = true;
  };

/*
 * =========================================================
 * SEND OTP RESULT
 * =========================================================
 */

export interface Msg91SendOtpResult {
  response: Msg91OtpResponse;
  reqId: string | null;
}

/*
 * =========================================================
 * EXTRACT REQUEST ID
 * =========================================================
 */

const extractReqId = (
  response: unknown
): string | null => {
  if (
    !response ||
    typeof response !== "object"
  ) {
    return null;
  }

  const object =
    response as Record<string, unknown>;

  // -----------------------------------------
  // Direct reqId fields
  // -----------------------------------------

  const directReqId =
    object.reqId ??
    object.reqid ??
    object.req_id ??
    object.requestId ??
    object.requestID ??
    object.request_id;

  if (
    typeof directReqId === "string" &&
    directReqId.trim()
  ) {
    return directReqId.trim();
  }

  // -----------------------------------------
  // MSG91 Web SDK:
  // reqId is returned inside "message"
  // -----------------------------------------

  if (
    typeof object.message === "string" &&
    object.message.trim()
  ) {
    return object.message.trim();
  }

  // -----------------------------------------
  // Nested response/data
  // -----------------------------------------

  const nestedObjects = [
    object.data,
    object.response,
  ];

  for (const nestedValue of nestedObjects) {
    if (
      !nestedValue ||
      typeof nestedValue !== "object"
    ) {
      continue;
    }

    const nested =
      nestedValue as Record<string, unknown>;

    const nestedReqId =
      nested.reqId ??
      nested.reqid ??
      nested.req_id ??
      nested.requestId ??
      nested.requestID ??
      nested.request_id;

    if (
      typeof nestedReqId === "string" &&
      nestedReqId.trim()
    ) {
      return nestedReqId.trim();
    }

    // MSG91 may also put it in message

    if (
      typeof nested.message === "string" &&
      nested.message.trim()
    ) {
      return nested.message.trim();
    }
  }

  return null;
};

/*
 * =========================================================
 * SEND OTP
 * =========================================================
 */

export const sendMsg91Otp =
  async (
    phone: string
  ): Promise<Msg91SendOtpResult> => {
    await initializeMsg91Widget();

    if (!window.sendOtp) {
      throw new Error(
        "MSG91 sendOtp method is unavailable."
      );
    }

    const identifier =
      `91${phone}`;

    return new Promise(
      (resolve, reject) => {
        window.sendOtp!(
          identifier,

          (data) => {
            /*
             * IMPORTANT:
             * Keep this log temporarily.
             * It lets us see the exact MSG91
             * Web SDK response.
             */

            console.log(
              "MSG91 SEND OTP RAW RESPONSE:",
              data
            );

            let reqId =
              extractReqId(data);

            /*
             * Some SDK versions may expose
             * additional widget data.
             */

            if (
              !reqId &&
              window.getWidgetData
            ) {
              try {
                const widgetData =
                  window.getWidgetData();

                console.log(
                  "MSG91 WIDGET DATA:",
                  widgetData
                );

                reqId =
                  extractReqId(
                    widgetData
                  );
              } catch (widgetError) {
                console.warn(
                  "Unable to read MSG91 widget data:",
                  widgetError
                );
              }
            }

            console.log(
              "MSG91 EXTRACTED REQ ID:",
              reqId
            );

            resolve({
              response: data,
              reqId,
            });
          },

          (error) => {
            console.error(
              "MSG91 SEND OTP RAW ERROR:",
              error
            );

            reject(error);
          }
        );
      }
    );
  };

/*
 * =========================================================
 * VERIFY OTP
 * =========================================================
 */

export const verifyMsg91Otp =
  async (
    otp: string,
    reqId?: string | null
  ): Promise<Msg91OtpResponse> => {
    await initializeMsg91Widget();

    if (!window.verifyOtp) {
      throw new Error(
        "MSG91 verifyOtp method is unavailable."
      );
    }

    return new Promise(
      (resolve, reject) => {
        window.verifyOtp!(
          otp,

          (data) => {
            console.log(
              "MSG91 VERIFY OTP RESPONSE:",
              data
            );

            resolve(data);
          },

          (error) => {
            console.error(
              "MSG91 VERIFY OTP ERROR:",
              error
            );

            reject(error);
          },

          reqId || undefined
        );
      }
    );
  };

/*
 * =========================================================
 * RETRY OTP
 * =========================================================
 */

export const retryMsg91Otp =
  async (
    reqId?: string | null
  ): Promise<Msg91OtpResponse> => {
    await initializeMsg91Widget();

    if (!window.retryOtp) {
      throw new Error(
        "MSG91 retryOtp method is unavailable."
      );
    }

    return new Promise(
      (resolve, reject) => {
        window.retryOtp!(
          "11",

          (data) => {
            console.log(
              "MSG91 RETRY OTP RESPONSE:",
              data
            );

            resolve(data);
          },

          (error) => {
            console.error(
              "MSG91 RETRY OTP ERROR:",
              error
            );

            reject(error);
          },

          reqId || undefined
        );
      }
    );
  };