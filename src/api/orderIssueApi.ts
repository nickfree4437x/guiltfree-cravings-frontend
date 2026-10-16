
export interface CreateOrderIssuePayload {
  orderNumber: string;
  issueType: string;
  message: string;
}

interface CreateOrderIssueResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    orderNumber: string;
    issueType: string;
    message: string;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    createdAt: string;
  };
}

export const createOrderIssue = async (
  payload: CreateOrderIssuePayload,
  token: string
): Promise<CreateOrderIssueResponse> => {
  const apiBaseUrl = (
    import.meta.env.VITE_API_URL ||
    "https://guiltfreecravings.com/api"
  ).replace(/\/+$/, "");

  const response = await fetch(
    `${apiBaseUrl}/order-issues`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Unable to submit your issue. Please try again."
    );
  }

  if (!result?.success) {
    throw new Error(
      result?.message || "Issue submission failed."
    );
  }

  return result as CreateOrderIssueResponse;
};
