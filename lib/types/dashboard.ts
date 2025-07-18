/**
 * Dashboard type definitions for it's components
 */

/**
 * user interface for dashboard context 
 */

export interface DashboardUser{
    id: string;
    name: string;
    email: string;
    avatar?: string; 
    role: "admin" | "Super Admin";
}


/**
 * Statistics data interface
 */
export interface DashboardStats {
  totalLearners: {
    value: number
    change: number
    changeType: "increase" | "decrease"
  }
  revenue: {
    value: number
    change: number
    changeType: "increase" | "decrease"
  }
  invoices: {
    value: number
    change: number
    changeType: "increase" | "decrease"
  }
}

/**
 * Course track interface
 */
export interface CourseTrack {
  id: string
  title: string
  description?: string
  price: number
  duration: string
  image: string
  technologies: string[]
  studentsEnrolled: number
  instructor?: string
  status: "active" | "inactive" | "draft"
  createdAt: string
  updatedAt: string
}

/**
 * Revenue data interface for charts
 */
export interface RevenueData {
  month: string
  amount: number
  year: number
}

/**
 * Invoice interface
 */
export interface Invoice {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  amount: number
  status: "paid" | "pending" | "overdue"
  dueDate: string
  paidDate?: string
  courseId?: string
  courseName?: string
}

/**
 * Navigation item interface
 */
export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current: boolean
  badge?: number
}

/**
 * Dashboard analytics interface
 */
export interface DashboardAnalytics {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  completedCourses: number
  totalRevenue: number
  monthlyRevenue: RevenueData[]
  recentInvoices: Invoice[]
  popularCourses: CourseTrack[]
}
