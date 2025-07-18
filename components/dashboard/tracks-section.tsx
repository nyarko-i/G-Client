"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 1. Define the TrackData interface
interface TrackData {
  id: string;
  title: string;
  price: number;
  duration: string;
  image: string;
  technologies: string[];
}

// 2. Provide your sample data array
const tracksData: TrackData[] = [
  {
    id: "1",
    title: "Software Engineering",
    price: 400,
    duration: "12 weeks",
    image: "/images/dashboard/tracks/software.jpg",
    technologies: ["NodeJs", "ReactJs"],
  },
  {
    id: "2",
    title: "Cloud Computing",
    price: 350,
    duration: "12 weeks",
    image: "/images/dashboard/tracks/cloud.jpg",
    technologies: ["Azure", "AWS"],
  },
  {
    id: "3",
    title: "Data Science",
    price: 400,
    duration: "12 weeks",
    image: "/images/dashboard/tracks/data.jpg",
    technologies: ["PowerBI", "Python"],
  },
  {
    id: "4",
    title: "UI/UX",
    price: 250,
    duration: "8 weeks",
    image: "/images/dashboard/tracks/UI.jpg",
    technologies: ["Figma", "Sketch"],
  },
];

// 3. Helper to assign each tech badge its color classes
function getTechColorClass(tech: string): string {
  const map: Record<string, string> = {
    NodeJs: "bg-green-100 text-green-800 border-none",
    ReactJs: "bg-blue-100 text-blue-800 border-none",
    Azure: "bg-sky-100 text-sky-800 border-none",
    AWS: "bg-indigo-100 text-indigo-800 border-none",
    PowerBI: "bg-pink-100 text-pink-800 border-none",
    Python: "bg-blue-100 text-blue-800 border-none",
    Figma: "bg-orange-100 text-orange-800 border-none",
    Sketch: "bg-rose-100 text-rose-800 border-none",
  };
  return map[tech] || "bg-gray-100 text-gray-800 border-none";
}

// 4. Individual TrackCard component
function TrackCard({ track, index }: { track: TrackData; index: number }) {
  const [mounted, setMounted] = useState(false);

  // Staggered entrance animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), index * 100);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <Card
      className={`
        p-0 rounded-2xl overflow-hidden border-0 cursor-pointer transform
        transition-all duration-700
        hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
    >
      {/* Image flush to the very top */}
      <div className="relative w-full h-40">
        <Image
          src={track.image}
          alt={track.title}
          fill
          className="object-cover rounded-t-2xl"
          priority
        />
        {/* Price badge */}
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-white text-gray-900 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
            ${track.price}
          </span>
        </div>
      </div>

      {/* White content area below */}
      <CardContent className="p-4 space-y-2">
        <h3 className="text-base font-semibold text-gray-900">{track.title}</h3>
        <div className="flex items-center text-sm text-gray-600 gap-2">
          <Calendar className="w-4 h-4" />
          <span>{track.duration}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {track.technologies.map((tech, i) => (
            <Badge
              key={i}
              variant="outline"
              className={`text-xs font-medium px-2 py-1 rounded-full ${getTechColorClass(
                tech
              )}`}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main TracksSection export
export default function TracksSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Tracks</h2>
        <button className="text-blue-600 hover:underline text-sm font-medium cursor-pointer">
          View all
        </button>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tracksData.map((track, idx) => (
          <TrackCard key={track.id} track={track} index={idx} />
        ))}
      </div>
    </div>
  );
}
