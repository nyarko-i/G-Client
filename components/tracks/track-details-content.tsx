"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Users,
  Clock,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import EditTrackModal from "./edit-track-modal";

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
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface TrackDetailsContentProps {
  trackId: string;
}

const sampleTracks: Track[] = [
  {
    id: "1",
    title: "Software Development",
    description:
      "Lorem has been the industry's standard dummy text ever since the 1500s...",
    price: 400,
    duration: "12 weeks",
    image: "/images/dashboard/tracks/software.jpg",
    students: 12,
    instructor: "Benjamin",
    rating: 4.5,
    technologies: ["NodeJS", "ReactJS", "MongoDB", "Express"],
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
];

const getTrackById = (id: string): Track => {
  return sampleTracks.find((track) => track.id === id) || sampleTracks[0];
};

export default function TrackDetailsContent({
  trackId,
}: TrackDetailsContentProps) {
  const router = useRouter();
  const [track, setTrack] = useState<Track>(getTrackById(trackId));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteTrack = () => {
    toast.success("Track Deleted", {
      description: "The track has been successfully deleted",
    });
    router.push("/dashboard/tracks");
  };

  const handleUpdateTrack = (updatedTrack: Partial<Track>) => {
    setTrack((prev) => ({ ...prev, ...updatedTrack }));
    setIsEditModalOpen(false);
    toast.success("Track Updated", {
      description: "The track has been successfully updated",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div
          className={`flex items-center justify-between transition-all duration-700 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Track Details
              </h1>
              <p className="text-sm text-gray-600">
                View and manage track information
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteTrack}
              className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Track Card */}
        <Card
          className={`overflow-hidden transition-all duration-700 ease-out delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/2 relative h-64 md:h-auto min-h-[300px]">
              <Image
                src={track.image || "/images/default-track.jpg"} // ✅ Use fallback
                alt={track.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="md:w-1/2 p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {track.title}
                  </h2>
                  <Badge variant="secondary" className="text-lg font-semibold">
                    ${track.price}
                  </Badge>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(track.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600">
                    ({track.rating})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {track.students} Students
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {track.duration}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Instructor: {track.instructor}
                    </span>
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {track.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <Badge
                    variant={
                      track.status === "active" ? "default" : "secondary"
                    }
                    className="capitalize"
                  >
                    {track.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <CardContent className="border-t">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {track.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <EditTrackModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateTrack}
          track={track}
        />
      </div>
    </DashboardLayout>
  );
}
