/**
 * TypeScript type definitions for learner data
 * Provides type safety for learner-related data structures
 */

/**
 * Learner status enumeration
 */
export enum LearnerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

/**
 * Learner interface
 */
export interface Learner {
  id: string
  name: string
  email: string
  dateJoined: string
  coursesEnrolled: number
  status: LearnerStatus
  avatar?: string
  program?: string
  gender?: string
  contact?: string
  country?: string
  paidStatus?: string // e.g., "Paid", "Unpaid"
  description?: string
}
