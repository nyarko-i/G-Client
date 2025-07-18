import type { Metadata } from "next";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardContent from "@/components/dashboard/dashboard-content";

// Metadata for the dashboard page
export const metadata: Metadata = {
  title: "Admin Dashboard - LMS Portal",
  description:
    "LMS administrator dashboard with analytics and course management",
};

/**
 * Main dashboard page component
 * Combines the dashboard layout with content
 *  main entry point after successful authentication
 */
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
