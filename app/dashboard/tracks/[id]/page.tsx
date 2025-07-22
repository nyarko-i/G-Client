import type { Metadata } from "next";
import TrackDetailsContent from "@/components/tracks/track-details-content";

// Metadata for track details page
export const metadata: Metadata = {
  title: "Track Details - LMS Portal",
  description: "Detailed view of course track information and management",
};

interface TrackDetailsPageProps {
  params: {
    id: string;
  };
}

/**
 * Track details page component
 * Shows detailed information about a specific track
 */
export default function TrackDetailsPage({ params }: TrackDetailsPageProps) {
  return <TrackDetailsContent trackId={params.id} />;
}
