"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import TracksGrid from "./tracks-grid";
import AddTrackModal from "./add-track-modal";
import { toast } from "sonner";

// Final Track interface for internal use
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

// Raw track data from the API before transforming
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
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchTracks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tracks");
      const result = await response.json();

      let rawTracks: ApiTrack[] = [];

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

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

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

        {/* Track Grid */}
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

        {/* Modal */}
        <AddTrackModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={fetchTracks}
        />
      </div>
    </DashboardLayout>
  );
}
