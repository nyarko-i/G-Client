// lib/api/auth.ts

/** Generic shape of an API response */
export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data?: TData;
}

/** User object */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

/** Register request payload */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contact: string;
}

/** Login request payload */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Verify email request payload */
export interface OTPVerificationRequest {
  email: string;
  otp: string;
}

/** Forgot password request payload */
export interface ForgotPasswordRequest {
  email: string;
}

/** Reset password request payload */
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

/** Change password request payload */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/** Shape of an error payload we expect from the API */
interface ErrorPayload {
  message?: string;
  [key: string]: unknown;
}

/**
 * Perform a fetch against your proxied API, parse JSON, and handle errors.
 * Note: `endpoint` must start with "/api"
 */
async function apiRequest<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  }).catch(() => {
    throw new Error("Network error: please check your connection");
  });

  // Attempt to parse JSON; if it fails, treat as empty object
  const payload: ErrorPayload = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Log full payload for debugging
    console.error("API error payload for", endpoint, ":", payload);

    // Extract a string message if present
    const message = typeof payload.message === "string"
      ? payload.message
      : response.statusText;

    throw new Error(message);
  }

  // At this point, payload conforms to T
  return payload as unknown as T;
}

/** API functions — all calling /api/... which Next.js will proxy to your Azure host */

// Admin signup
export function signupAdmin(data: RegisterRequest): Promise<ApiResponse<null>> {
  return apiRequest<ApiResponse<null>>("/api/auth/signup/admin", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Learner signup
export function signupLearner(data: RegisterRequest): Promise<ApiResponse<null>> {
  return apiRequest<ApiResponse<null>>("/api/auth/signup/learner", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Login
export function login(
  data: LoginRequest
): Promise<ApiResponse<{ token: string; user: User }>> {
  return apiRequest<ApiResponse<{ token: string; user: User }>>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

// Verify email
export function verifyEmail(data: OTPVerificationRequest): Promise<ApiResponse<null>> {
  return apiRequest<ApiResponse<null>>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Resend OTP token
export function resendToken(): Promise<ApiResponse<null>> {
  return apiRequest<ApiResponse<null>>("/api/auth/resend-token", {
    method: "POST",
  });
}

// Forgot password
export function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ApiResponse<null>> {
  return apiRequest<ApiResponse<null>>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Reset password
export function resetPassword(
  data: ResetPasswordRequest
): Promise<ApiResponse<null>> {
  return apiRequest<ApiResponse<null>>(
    `/api/auth/reset-password/${encodeURIComponent(data.token)}`,
    {
      method: "POST",
      body: JSON.stringify({ password: data.password }),
    }
  );
}

// Change password
export function changePassword(
  data: ChangePasswordRequest
): Promise<ApiResponse<null>> {
  return apiRequest<ApiResponse<null>>("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Logout
export function logout(): Promise<ApiResponse<null>> {
  return apiRequest<ApiResponse<null>>("/api/auth/logout", {
    method: "POST",
  });
}

// Check authentication (get current user)
export function checkAuth(): Promise<ApiResponse<{ user: User }>> {
  return apiRequest<ApiResponse<{ user: User }>>("/api/auth/check-auth", {
    method: "GET",
  });
}

// Optional: update profile if your API supports it
// export function updateProfile(data: Partial<User>): Promise<ApiResponse<null>> {
//   return apiRequest<ApiResponse<null>>("/api/auth/update", {
//     method: "PUT",
//     body: JSON.stringify(data),
//   });
// }
