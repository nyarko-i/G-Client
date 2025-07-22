"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface TracksGridProps {
  tracks: Track[];
}

function TrackCard({ track, index }: { track: Track; index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Link href={`/dashboard/tracks/${track.id}`} passHref>
      <Card
        className={`
          p-0 rounded-2xl overflow-hidden border-0 cursor-pointer transform transition-all duration-700
          hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
        aria-label={`View track ${track.title}`}
      >
        {/* Image flush to top */}
        <div className="relative w-full h-40">
          <Image
            src={track.image || "/placeholder.svg"}
            alt={track.title}
            fill
            className="object-cover rounded-t-2xl"
            priority={index < 3}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-white text-gray-900 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
              ${track.price}
            </span>
          </div>
        </div>

        {/* Content below image */}
        <CardContent className="p-4 space-y-2">
          <h3 className="text-base font-semibold text-gray-900">
            {track.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2">
            {track.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{track.students ?? 0}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{track.duration}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span>{track.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {track.technologies?.slice(0, 3).map((tech, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-xs transition-all hover:scale-105 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
              >
                {tech}
              </Badge>
            ))}
            {track.technologies?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{track.technologies.length - 3}
              </Badge>
            )}
          </div>

          <div className="text-sm text-gray-500">
            <span className="font-medium">Instructor:</span> {track.instructor}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function TracksGrid({ tracks }: TracksGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tracks.map((track, index) => (
        <TrackCard key={track.id} track={track} index={index} />
      ))}
    </div>
  );
}
