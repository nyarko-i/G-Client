"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import TracksGrid from "./tracks-grid";
import AddTrackModal from "./add-track-modal";

interface Track {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  students: number;
  instructor: string;
  rating: number;
  technologies: string[];
  status: "active" | "inactive" | "draft";
}

export default function TracksPageContent() {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: "1",
      title: "Software Engineering",
      description: "Unlock your potential with comprehensive training",
      price: 400,
      duration: "12 weeks",
      image: "/images/dashboard/tracks/software.jpg",
      students: 12,
      instructor: "John Doe",
      rating: 4.5,
      technologies: ["NodeJS", "ReactJS", "MongoDB"],
      status: "active",
    },
    {
      id: "2",
      title: "Cloud Computing",
      description: "Unlock your potential with comprehensive training",
      price: 350,
      duration: "10 weeks",
      image: "/images/dashboard/tracks/cloud.jpg",
      students: 8,
      instructor: "Jane Smith",
      rating: 4.3,
      technologies: ["Azure", "AWS", "Docker"],
      status: "active",
    },
    {
      id: "3",
      title: "Data Science",
      description: "Unlock your potential with comprehensive training",
      price: 400,
      duration: "14 weeks",
      image: "/images/dashboard/tracks/data.jpg",
      students: 15,
      instructor: "Mike Johnson",
      rating: 4.7,
      technologies: ["Python", "PowerBI", "TensorFlow"],
      status: "active",
    },
    {
      id: "4",
      title: "UI/UX",
      description: "Unlock your potential with comprehensive training",
      price: 250,
      duration: "8 weeks",
      image: "/images/dashboard/tracks/UI.jpg",
      students: 6,
      instructor: "Sarah Wilson",
      rating: 4.4,
      technologies: ["Figma", "Sketch", "Adobe XD"],
      status: "active",
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAddTrack = useCallback(
    (newTrack: Omit<Track, "id" | "students" | "rating" | "status">) => {
      const track: Track = {
        ...newTrack,
        id: (tracks.length + 1).toString(),
        students: 0,
        rating: 0,
        status: "active",
      };
      setTracks((prev) => [...prev, track]);
      setIsAddModalOpen(false);
    },
    [tracks]
  );

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

        {/* Tracks Grid */}
        <div
          className={`transition-all duration-700 ease-out delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <TracksGrid tracks={tracks} />
        </div>

        {/* Add Track Modal */}
        <AddTrackModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddTrack}
        />
      </div>
    </DashboardLayout>
  );
}
