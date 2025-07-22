"use client";

import { useState } from "react";
import Image from "next/image";
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

// Types
interface TrackFormData {
  title: string;
  price: string;
  duration: string;
  instructor: string;
  description: string;
  technologies: string;
}

interface Track {
  title: string;
  price: number;
  duration: string;
  instructor: string;
  description: string;
  technologies: string[];
  image: string;
}

interface AddTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (track: Track) => void;
}

export default function AddTrackModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTrackModalProps) {
  const [formData, setFormData] = useState<TrackFormData>({
    title: "",
    price: "",
    duration: "",
    instructor: "",
    description: "",
    technologies: "",
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTrack: Track = {
      ...formData,
      price: Number(formData.price),
      technologies: formData.technologies.split(",").map((tech) => tech.trim()),
      image:
        preview ||
        "/placeholder.svg?height=200&width=300&text=" +
          encodeURIComponent(formData.title),
    };

    onSubmit(newTrack);

    // Reset form
    setFormData({
      title: "",
      price: "",
      duration: "",
      instructor: "",
      description: "",
      technologies: "",
    });
    setPreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Track
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
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

          {/* Price */}
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

          {/* Duration */}
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

          {/* Instructor */}
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

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Track Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {preview && (
              <div className="relative w-full h-64 mt-2 border rounded-md overflow-hidden">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* Technologies */}
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

          {/* Description */}
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

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Track
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
