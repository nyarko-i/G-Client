"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Same types as AddTrackModal for consistency
interface Track {
  title: string;
  price: number;
  duration: string;
  instructor: string;
  description: string;
  technologies: string[];
  image: string;
}

interface TrackFormData {
  title: string;
  price: string;
  duration: string;
  instructor: string;
  description: string;
  technologies: string;
}

interface EditTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (track: Track) => void;
  track: Track | null;
}

/**
 * Edit track modal component
 * Form for updating existing tracks
 */
export default function EditTrackModal({
  isOpen,
  onClose,
  onSubmit,
  track,
}: EditTrackModalProps) {
  const [formData, setFormData] = useState<TrackFormData>({
    title: "",
    price: "",
    duration: "",
    instructor: "",
    description: "",
    technologies: "",
  });

  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title || "",
        price: track.price?.toString() || "",
        duration: track.duration || "",
        instructor: track.instructor || "",
        description: track.description || "",
        technologies: track.technologies?.join(", ") || "",
      });
    }
  }, [track]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTrack: Track = {
      title: formData.title,
      price: Number(formData.price),
      duration: formData.duration,
      instructor: formData.instructor,
      description: formData.description,
      technologies: formData.technologies.split(",").map((tech) => tech.trim()),
      image: track?.image ?? "/placeholder.svg", // fallback image
    };

    onSubmit(updatedTrack);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Update Track
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Track name</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter track name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 12 weeks"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleInputChange}
              placeholder="Enter instructor name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Picture</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Choose file or file chosen
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies</Label>
            <Input
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter track description"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Update Track
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
