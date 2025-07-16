/**
 * TypeScript type definitions for authentication
 * Provides type safety across the authentication system
 */

// bring in the request/response types so we can _use_ them locally
import type {
  LoginRequest,
  RegisterRequest,
  OTPVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  //AuthResponse,
} from "../api/auth"

// User role enumeration
export enum UserRole {
  ADMIN = "admin",
  INSTRUCTOR = "instructor",
  STUDENT = "student",
}

// User status enumeration
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  SUSPENDED = "suspended",
}

/**
 * Base user interface
 */
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

/**
 * Admin user interface extending base user
 */
export interface AdminUser extends User {
  role: UserRole.ADMIN
  permissions: string[]
  department?: string
}

/**
 * Authentication context interface
 */
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
}

/**
 * Form validation error interface
 */
export interface FormError {
  field: string
  message: string
}

/**
 * API error response interface
 */
export interface ApiError {
  success: false
  message: string
  errors?: FormError[]
  statusCode: number
}

/**
 * API success response interface
 */
export interface ApiSuccess<T = unknown> {
  success: true
  message: string
  data: T
}

/**
 * Generic API response type
 */
export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

// re‑export for convenience
export type {
  LoginRequest,
  RegisterRequest,
  OTPVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  //AuthResponse,
}
