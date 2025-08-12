import type { Metadata } from "next";
import LearnersPageContent from "@/components/learner/learners-page-content";

// Metadata for the learners page
export const metadata: Metadata = {
  title: "Manage Learners - LMS Portal",
  description:
    "Filter, sort, and access detailed learner profiles in the Learning Management System",
};

/**
 * Learners page component
 * Main page for displaying all available learners in a table layout
 */
export default function LearnersPage() {
  return <LearnersPageContent />;
}
