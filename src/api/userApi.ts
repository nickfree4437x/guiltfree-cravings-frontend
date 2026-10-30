import axios from "axios";

// ─── Types: User Profile ──────────────────────────────────
export interface UserProfile {
  id: number;
  name: string | null;
  phone: string;
  email: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

// ─── Types: Order Issues ──────────────────────────────────
export type CustomerOrderIssueStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface CustomerOrderIssue {
  id: number;
  orderId: number;
  orderNumber: string;
  issueType: string;
  message: string;
  status: CustomerOrderIssueStatus;
  createdAt: string;
  updatedAt: string;
  order: {
    orderNumber: string;
    orderStatus: string;
    paymentStatus: string;
  };
}

export interface CustomerOrderIssuesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CustomerOrderIssuesResponse {
  success: boolean;
  message: string;
  data: CustomerOrderIssue[];
  pagination: CustomerOrderIssuesPagination;
}

// ─── Types: Order Issue Conversation ──────────────────────
export type IssueMessageSender = "CUSTOMER" | "ADMIN";

export interface CustomerIssueMessage {
  id: number;
  issueId: number;
  senderType: IssueMessageSender;
  senderId: number;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerIssueConversation {
  issue: {
    id: number;
    orderNumber: string;
    issueType: string;
    status: CustomerOrderIssueStatus;
    createdAt: string;
  };
  messages: CustomerIssueMessage[];
}

interface CustomerIssueConversationResponse {
  success: boolean;
  message?: string;
  data: CustomerIssueConversation;
}

interface CustomerIssueMessageResponse {
  success: boolean;
  message?: string;
  data: CustomerIssueMessage;
}

// ─── API Responses: Profile ───────────────────────────────
interface ProfileResponse {
  success: boolean;
  message?: string;
  data: UserProfile;
}

// ─── Axios Instance ───────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://guiltfreecravings.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Auth Token + Interceptor ─────────────────────────────
const AUTH_TOKEN_KEY = "guiltfree_auth_token";

const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

// Attach Authorization: Bearer <token> to every request.
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── API: Get My Profile ──────────────────────────────────
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await api.get<ProfileResponse>("/users/me");

  if (!response.data.success) {
    throw new Error(response.data.message || "Unable to load your profile.");
  }

  return response.data.data;
};

// ─── API: Update My Profile ───────────────────────────────
export const updateMyProfile = async (
  payload: UpdateProfilePayload
): Promise<UserProfile> => {
  const response = await api.patch<ProfileResponse>("/users/me", payload);

  if (!response.data.success) {
    throw new Error(response.data.message || "Unable to update your profile.");
  }

  return response.data.data;
};

// ─── API: Get My Order Issues ─────────────────────────────
export const getMyOrderIssues = async (
  page = 1,
  limit = 10
): Promise<CustomerOrderIssuesResponse> => {
  const response = await api.get<CustomerOrderIssuesResponse>(
    "/order-issues/my-issues",
    {
      params: { page, limit },
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Unable to load your issues.");
  }

  return response.data;
};

// ─── API: Get Messages for My Order Issue ─────────────────
export const getMyOrderIssueMessages = async (
  issueId: number
): Promise<CustomerIssueConversation> => {
  const response = await api.get<CustomerIssueConversationResponse>(
    `/order-issues/my-issues/${issueId}/messages`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Unable to load the conversation."
    );
  }

  // Expected response:
  // { success: true, data: { issue: {...}, messages: [...] } }
  return response.data.data;
};

// ─── API: Send Message for My Order Issue ──────────────────
export const sendMyOrderIssueMessage = async (
  issueId: number,
  message: string
): Promise<CustomerIssueMessage> => {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    throw new Error("Please enter a message.");
  }

  if (trimmedMessage.length > 2000) {
    throw new Error("Message cannot exceed 2000 characters.");
  }

  const response = await api.post<CustomerIssueMessageResponse>(
    `/order-issues/my-issues/${issueId}/messages`,
    {
      message: trimmedMessage,
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Unable to send your message.");
  }

  return response.data.data;
};

export default api;