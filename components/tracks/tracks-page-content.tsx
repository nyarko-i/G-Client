"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import TracksGrid from "./tracks-grid";
import AddTrackModal from "./add-track-modal";
import { toast } from "sonner";

// Interface for cleaned/formatted track data used in the app
interface Track {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  students?: number;
  instructor: string;
  rating?: number;
  technologies?: string[];
  status: "active" | "inactive" | "draft";
}

// Interface for raw track data as received from the API
interface ApiTrack {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  price?: number;
  duration?: string;
  image?: string;
  instructor?: string;
  students?: number;
  rating?: number;
  technologies?: string[];
  status?: string;
}

export default function TracksPageContent() {
  // State to store list of tracks
  const [tracks, setTracks] = useState<Track[]>([]);
  // State to handle loading state while fetching data
  const [isLoading, setIsLoading] = useState(true);
  // State to control visibility of AddTrack modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // Used to control animation timing
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch tracks from API and format the data
  const fetchTracks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tracks");
      const result = await response.json();

      let rawTracks: ApiTrack[] = [];

      // Handle different possible response structures
      if (Array.isArray(result)) {
        rawTracks = result;
      } else if (result.success && Array.isArray(result.data)) {
        rawTracks = result.data;
      } else if (Array.isArray(result.tracks)) {
        rawTracks = result.tracks;
      } else {
        console.error("Unexpected API response:", result);
        toast.error("Failed to load tracks");
        return;
      }

      // Clean and standardize the track data
      const cleanedTracks: Track[] = rawTracks.map((track: ApiTrack) => ({
        id: track.id || track._id || crypto.randomUUID(),
        title: track.name || track.title || "Untitled",
        description: track.description || "",
        price: track.price ?? 0,
        duration: track.duration || "",
        image: track.image || "/placeholder.jpg",
        instructor: track.instructor || "Unknown",
        technologies: Array.isArray(track.technologies)
          ? track.technologies
          : [],
        status: (track.status as "active" | "inactive" | "draft") || "draft",
        students: track.students ?? 0,
        rating: track.rating ?? 0,
      }));

      setTracks(cleanedTracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      toast.error("Network error while loading tracks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch tracks when component mounts
  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  // Trigger animation after short delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div
          className={`flex items-center justify-between transition-all duration-700 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Tracks</h1>
            <p className="text-sm text-gray-600 mt-1">
              View, sort, and access detailed tracks
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Track
          </Button>
        </div>

        {/* Track Grid Section */}
        <div
          className={`transition-all duration-700 ease-out delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {isLoading ? (
            <p className="text-gray-500 text-sm">Loading tracks...</p>
          ) : tracks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tracks found.</p>
          ) : (
            <TracksGrid tracks={tracks} />
          )}
        </div>

        {/* Add Track Modal */}
        <AddTrackModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={fetchTracks}
        />
      </div>
    </DashboardLayout>
  );
}
