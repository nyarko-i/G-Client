import type { Metadata } from "next";
import TracksPageContent from "@/components/tracks/tracks-page-content";

// Metadata for the tracks page
export const metadata: Metadata = {
  title: "Manage Tracks - LMS Portal",
  description:
    "View, sort, and access detailed tracks in the Learning Management System",
};

/**
 * Tracks page component
 * Main page for displaying all available tracks in a grid layout
 */
export default function TracksPage() {
  return <TracksPageContent />;
}
