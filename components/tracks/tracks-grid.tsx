"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

// Interface for each track item
interface Track {
  id: string;
  title: string;
  description: string;
  image: string;
  status: "active" | "inactive" | "draft";
  technologies?: string[];
  duration: string;
  instructor: string;
}

// Props for the full list of tracks
interface TracksGridProps {
  tracks: Track[];
}

// Grid component to display tracks
export default function TracksGrid({ tracks }: TracksGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tracks.map((track) => (
        <div
          key={track.id}
          onClick={() => router.push(`/dashboard/tracks/${track.id}`)}
          className="rounded-2xl shadow hover:shadow-md cursor-pointer transition border overflow-hidden bg-white"
        >
          {/* Track image header */}
          <div className="relative w-full h-44">
            <Image
              src={track.image}
              alt={track.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Track info */}
          <div className="p-4 space-y-2">
            {/* Title */}
            <CardTitle className="text-lg font-bold">{track.title}</CardTitle>

            {/* Short description */}
            <p className="text-sm text-gray-700 line-clamp-3">
              {track.description}
            </p>

            {/* Duration and Instructor */}
            <div className="gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1 pb-2">
                <Calendar className="w-4 h-4" />
                <span>{track.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{track.instructor}</span>
              </div>
            </div>

            {/* Track status */}
            <Badge variant="outline">{track.status}</Badge>

            {/* Technologies badges */}
            {track.technologies?.length ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {track.technologies.map((tech, i) => (
                  <Badge key={i} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
