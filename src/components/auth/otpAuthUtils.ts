// ============================================================
// OTP AUTH CONSTANTS + HELPERS
// ============================================================

export const OTP_LENGTH = 4;

export const RESEND_COOLDOWN_SECONDS = 60;

export type AuthStep = "phone" | "otp";

// ============================================================
// MSG91 ERROR MESSAGE
// ============================================================

export function getMsg91ErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const errorObject = error as {
      message?: unknown;
      error?: unknown;
      msg?: unknown;
      response?: {
        data?: {
          message?: unknown;
          error?: unknown;
          msg?: unknown;
        };
      };
    };

    if (typeof errorObject.message === "string") {
      return errorObject.message;
    }

    if (typeof errorObject.error === "string") {
      return errorObject.error;
    }

    if (typeof errorObject.msg === "string") {
      return errorObject.msg;
    }

    const responseData = errorObject.response?.data;

    if (responseData) {
      if (typeof responseData.message === "string") {
        return responseData.message;
      }

      if (typeof responseData.error === "string") {
        return responseData.error;
      }

      if (typeof responseData.msg === "string") {
        return responseData.msg;
      }
    }
  }

  return "Something went wrong. Please try again.";
}

// ============================================================
// JWT CHECK
// ============================================================

export function isLikelyJwt(value: string): boolean {
  const parts = value.split(".");

  return (
    parts.length === 3 &&
    parts.every((part) => part.trim().length > 0)
  );
}

// ============================================================
// ACCESS TOKEN EXTRACTION
// ============================================================

export function extractMsg91AccessToken(
  value: unknown
): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return isLikelyJwt(value) ? value : null;
  }

  if (typeof value !== "object") {
    return null;
  }

  const objectValue = value as Record<string, unknown>;

  const directTokenKeys = [
    "accessToken",
    "access-token",
    "access_token",
    "token",
    "jwt",
  ];

  for (const key of directTokenKeys) {
    const token = objectValue[key];

    if (
      typeof token === "string" &&
      token.trim().length > 0
    ) {
      return token;
    }
  }

  const nestedKeys = [
    "data",
    "response",
    "result",
  ];

  for (const key of nestedKeys) {
    const nestedToken = extractMsg91AccessToken(
      objectValue[key]
    );

    if (nestedToken) {
      return nestedToken;
    }
  }

  const message = objectValue.message;

  if (
    typeof message === "string" &&
    isLikelyJwt(message)
  ) {
    return message;
  }

  return null;
}

// ============================================================
// SAFE DEBUG SHAPE
// ============================================================

export function getSafeMsg91ResponseShape(
  value: unknown
): Record<string, unknown> | string | null {
  if (typeof value === "string") {
    return {
      type: "string",
      length: value.length,
      looksLikeJwt: isLikelyJwt(value),
    };
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const objectValue = value as Record<string, unknown>;

  return {
    type: "object",
    keys: Object.keys(objectValue),
    hasAccessToken: Boolean(
      objectValue.accessToken ||
        objectValue["access-token"] ||
        objectValue.access_token ||
        objectValue.token ||
        objectValue.jwt
    ),
  };
}