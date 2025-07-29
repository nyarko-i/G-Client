export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data?: TData;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contact: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OTPVerificationRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

interface TrackResponse {
  success: boolean;
  message: string;
  track: unknown; // You can define a better type here if you know the shape of track
}

async function apiRequest<T>(
  endpoint: string,
  init: RequestInit = {},
  options?: { trackResponsePatch?: boolean }
): Promise<T> {
  const isFormData = init.body instanceof FormData;

  const response = await fetch(endpoint, {
    ...init,
    headers: isFormData
      ? init.headers
      : {
          "Content-Type": "application/json",
          ...init.headers,
        },
  }).catch(() => {
    throw new Error("Network error: please check your connection");
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  let payload: unknown;

  try {
    payload = isJson ? await response.json() : { message: await response.text() };
  } catch {
    payload = { message: "Invalid response format" };
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String((payload as Record<string, unknown>).message)
        : response.statusText || "Something went wrong";
    throw new Error(message);
  }

  if (options?.trackResponsePatch && typeof payload === "object" && payload !== null && "track" in payload) {
    const trackPayload = payload as TrackResponse;
    return {
      success: trackPayload.success,
      message: trackPayload.message,
      data: trackPayload.track,
    } as unknown as T;
  }

  return payload as T;
}

// === AUTH ENDPOINTS ===

export const signupAdmin = (data: RegisterRequest): Promise<ApiResponse<null>> =>
  apiRequest("/api/auth/signup/admin", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const signupLearner = (data: RegisterRequest): Promise<ApiResponse<null>> =>
  apiRequest("/api/auth/signup/learner", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const login = (
  data: LoginRequest
): Promise<ApiResponse<{ token: string; user: User }>> =>
  apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const verifyEmail = (data: OTPVerificationRequest): Promise<ApiResponse<null>> =>
  apiRequest("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const resendToken = (email: string): Promise<ApiResponse<null>> =>
  apiRequest("/api/auth/resend-token", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const forgotPassword = (data: ForgotPasswordRequest): Promise<ApiResponse<null>> =>
  apiRequest("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const resetPassword = (data: ResetPasswordRequest): Promise<ApiResponse<null>> =>
  apiRequest(`/api/auth/reset-password/${encodeURIComponent(data.token)}`, {
    method: "POST",
    body: JSON.stringify({
      password: data.password,
      confirmPassword: data.password,
    }),
  });

export const changePassword = (data: ChangePasswordRequest): Promise<ApiResponse<null>> =>
  apiRequest("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const logout = (): Promise<ApiResponse<null>> =>
  apiRequest("/api/auth/logout", {
    method: "POST",
  });

export const checkAuth = (): Promise<ApiResponse<{ user: User }>> =>
  apiRequest("/api/auth/check-auth", {
    method: "GET",
  });

// Track upload example with response patching for backend "track" field
export const uploadTrack = (formData: FormData): Promise<ApiResponse<unknown>> =>
  apiRequest("/api/tracks", {
    method: "POST",
    body: formData,
  }, {
    trackResponsePatch: true,
  });
