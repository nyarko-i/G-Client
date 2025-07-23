"use client";

import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Course } from "@/lib/types/course";
import Image from "next/image";

// Props for the modal component
export interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: Course) => void;
  availableTracks: string[];
}

export default function AddCourseModal({
  isOpen,
  onClose,
  onSubmit,
  availableTracks,
}: AddCourseModalProps) {
  // Form state (without id/picture/status/dateCreated)
  const [formData, setFormData] = useState<
    Omit<Course, "id" | "picture" | "dateCreated" | "status">
  >({
    title: "",
    author: "",
    track: "",
    description: "",
  });

  // Image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // File input reference (to trigger programmatically)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle text input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle dropdown track selection
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, track: value }));
  };

  // Handle file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set base64 preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger hidden file input when user clicks the area
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Submit the course
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCourse: Course = {
      ...formData,
      picture:
        imagePreview ||
        `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(
          formData.title
        )}`,
    };

    onSubmit(newCourse);

    // Reset form
    setFormData({ title: "", author: "", track: "", description: "" });
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Author Name */}
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Track Selection */}
          <div className="space-y-2">
            <Label htmlFor="track">Track</Label>
            <Select value={formData.track} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a track" />
              </SelectTrigger>
              <SelectContent>
                {availableTracks.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Course Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>Picture</Label>
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
              onClick={handleImageClick}
            >
              {/* Show preview if available, else placeholder */}
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="mx-auto rounded object-cover"
                />
              ) : (
                <>
                  <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload an image
                  </p>
                </>
              )}
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Create Course</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
