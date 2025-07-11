// lib/api/auth.ts

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

interface ErrorPayload {
  message?: string;
  [key: string]: unknown;
}

async function apiRequest<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  }).catch(() => {
    throw new Error("Network error: please check your connection");
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  let payload: ErrorPayload = {};

  try {
    payload = isJson ? await response.json() : { message: await response.text() };
  } catch {
    payload = {};
  }

  if (!response.ok) {
    console.error("API error payload for", endpoint, ":", payload);
    const message =
      typeof payload.message === "string" && payload.message.trim()
        ? payload.message
        : response.statusText || "Something went wrong";
    throw new Error(message);
  }

  return payload as unknown as T;
}

// === AUTH API CALLS (proxied via Next.js rewrites) ===

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

export const login = (data: LoginRequest): Promise<ApiResponse<{ token: string; user: User }>> =>
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

// Optional future usage
// export const updateProfile = (data: Partial<User>): Promise<ApiResponse<null>> =>
//   apiRequest("/api/auth/update", {
//     method: "PUT",
//     body: JSON.stringify(data),
//   });
