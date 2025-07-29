"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Trash2, Calendar, User } from "lucide-react"; // Import icons
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import EditTrackModal from "./edit-track-modal";

// Type definition for a single track
interface TrackData {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  instructor: string;
  students: number;
  rating: number;
  technologies: string[];
  status: "active" | "inactive" | "draft";
}

// Props for the track details component
interface TrackDetailsContentProps {
  trackId: string;
}

export default function TrackDetailsContent({
  trackId,
}: TrackDetailsContentProps) {
  const router = useRouter();
  const [track, setTrack] = useState<TrackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch track details from API when component mounts or trackId changes
  useEffect(() => {
    if (!trackId) return;

    (async () => {
      try {
        const res = await fetch(`/api/tracks/${trackId}`);
        const json = await res.json();

        if (json.success && json.track) {
          const t = json.track;

          // Normalize backend response to match our TrackData structure
          setTrack({
            id: t.id || t._id,
            title: t.name || t.title || "Untitled",
            description: t.description || "",
            price: t.price ?? 0,
            duration: t.duration || "N/A",
            image: t.image || "/placeholder.jpg",
            instructor: t.instructor || "Unknown",
            students: t.students ?? 0,
            rating: t.rating ?? 0,
            technologies: Array.isArray(t.technologies) ? t.technologies : [],
            status: (t.status as "active" | "inactive" | "draft") || "draft",
          });
        } else {
          toast.error("Invalid track response");
        }
      } catch (e) {
        toast.error("Error fetching track");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [trackId]);

  // Handle delete action
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this track?")) return;

    try {
      const res = await fetch(`/api/tracks/${track?.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.success) {
        toast.success("Track deleted");
        router.push("/dashboard/tracks"); // Redirect to track list
      } else {
        toast.error("Failed to delete");
      }
    } catch (e) {
      toast.error("Error deleting track");
      console.error(e);
    }
  };

  // Update local track state after editing
  const handleUpdate = (updated: TrackData) => setTrack(updated);

  // Loading indicator
  if (isLoading) return <div className="p-4 text-gray-600">Loading…</div>;

  // Error message if track not found
  if (!track)
    return <div className="p-4 text-red-500 of-track">Track not found</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      {/* Back navigation */}
      <button
        onClick={() => router.back()}
        className="text-2xl hover:text-gray-700"
      >
        ←
      </button>

      {/* Track image section */}
      <Card className="p-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full h-64">
            <Image
              src={track.image}
              alt={track.title}
              fill
              className="object-cover rounded-t"
              priority
            />
          </div>
        </CardContent>
      </Card>

      {/* Title, instructor, duration, and price */}
      <div className="flex items-start justify-between">
        <div>
          {/* Title */}
          <h2 className="text-3xl font-bold">{track.title}</h2>

          {/* Duration and Instructor with Icons */}
          <div className="text-sm text-gray-500 flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{track.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{track.instructor}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="text-xl font-semibold text-blue-600">
          ${track.price}
        </div>
      </div>

      {/* Technologies badges */}
      <div className="flex gap-2 flex-wrap">
        {track.technologies.map((tech, idx) => (
          <Badge key={idx} variant="secondary">
            {tech}
          </Badge>
        ))}
      </div>

      {/* Description section */}
      <p className="text-gray-700">{track.description}</p>

      {/* Extra stats: students, rating, status */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-600 border-t pt-4">
        <span>Students: {track.students}</span>
        <span>Rating: ⭐ {track.rating} / 5</span>
        <span>
          Status: <Badge variant="outline">{track.status}</Badge>
        </span>
      </div>

      {/* Action buttons: Edit / Delete */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Edit modal for updating track */}
      {track && (
        <EditTrackModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onUpdate={handleUpdate}
          track={track}
        />
      )}
    </div>
  );
}
