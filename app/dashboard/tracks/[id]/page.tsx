// app/(dashboard)/tracks/[id]/page.tsx (or wherever your page component is)

import DashboardLayout from "@/components/dashboard/dashboard-layout";
import TrackDetailsContent from "@/components/tracks/track-details-content";

interface PageProps {
  params: { id: string };
}

export default function TrackDetailsPage({ params }: PageProps) {
  const { id } = params;

  return (
    <DashboardLayout>
      <TrackDetailsContent trackId={id} />
    </DashboardLayout>
  );
}
