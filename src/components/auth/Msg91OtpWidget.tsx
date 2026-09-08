import { useEffect } from "react";

declare global {
  interface Window {
    initSendOTP?: (configuration: {
      widgetId: string;
      tokenAuth: string;
      identifier?: string;
      exposeMethods?: boolean;
      success: (data: unknown) => void;
      failure: (error: unknown) => void;
    }) => void;
  }
}

interface Msg91OtpWidgetProps {
  identifier?: string;
  onSuccess?: (data: unknown) => void;
  onFailure?: (error: unknown) => void;
}

const Msg91OtpWidget = ({
  identifier,
  onSuccess,
  onFailure,
}: Msg91OtpWidgetProps) => {
  useEffect(() => {
    const configuration = {
      widgetId: "36696370514b323339383238",

      // ⚠️ Actual token frontend code mein expose nahi karna.
      // MSG91 dashboard se naya/appropriate client token use karo.
      tokenAuth: import.meta.env.VITE_MSG91_TOKEN_AUTH,

      identifier: identifier || "",

      exposeMethods: true,

      success: (data: unknown) => {
        console.log("MSG91 OTP success:", data);
        onSuccess?.(data);
      },

      failure: (error: unknown) => {
        console.error("MSG91 OTP failure:", error);
        onFailure?.(error);
      },
    };

    const loadOtpScript = (urls: string[]) => {
      let index = 0;

      const attempt = () => {
        if (index >= urls.length) return;

        const script = document.createElement("script");

        script.src = urls[index];
        script.async = true;

        script.onload = () => {
          if (typeof window.initSendOTP === "function") {
            window.initSendOTP(configuration);
          }
        };

        script.onerror = () => {
          index++;
          attempt();
        };

        document.head.appendChild(script);
      };

      attempt();
    };

    loadOtpScript([
      "https://verify.msg91.com/otp-provider.js",
      "https://verify.phone91.com/otp-provider.js",
    ]);
  }, [identifier, onSuccess, onFailure]);

  return null;
};

export default Msg91OtpWidget;