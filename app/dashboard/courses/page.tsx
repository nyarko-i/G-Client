import type { Metadata } from "next";
import CoursesPageContent from "@/components/courses/courses-page-content";

// Metadata for the courses page
export const metadata: Metadata = {
  title: "Manage Courses - LMS Portal",
  description:
    "Filter, sort, and access detailed courses in the Learning Management System",
};

/**
 * Courses page
 */
export default function CoursesPage() {
  return <CoursesPageContent />;
}
