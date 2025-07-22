"use client";

import type React from "react";
import { useState } from "react";
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

// a Course type (used for the form and submission)
interface Course {
  title: string;
  track: string;
  description: string;
  author: string;
  picture: string;
}

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: Course) => void;
  availableTracks: string[];
}

/**
 * Add course modal component
 * Form for creating new courses
 */
export default function AddCourseModal({
  isOpen,
  onClose,
  onSubmit,
  availableTracks,
}: AddCourseModalProps) {
  const [formData, setFormData] = useState<Omit<Course, "picture">>({
    title: "",
    track: "",
    description: "",
    author: "",
  });

  /**
   * Handles form input changes
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles select changes
   */
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      track: value,
    }));
  };

  /**
   * Handles form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCourse: Course = {
      ...formData,
      picture:
        "/placeholder.svg?height=100&width=100&text=" +
        encodeURIComponent(formData.title),
    };

    onSubmit(newCourse);

    // Reset form
    setFormData({
      title: "",
      track: "",
      description: "",
      author: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Course
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter course title"
              required
            />
          </div>

          {/* Track */}
          <div className="space-y-2">
            <Label htmlFor="track">Track</Label>
            <Select
              value={formData.track}
              onValueChange={handleSelectChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a track" />
              </SelectTrigger>
              <SelectContent>
                {availableTracks.map((track) => (
                  <SelectItem key={track} value={track}>
                    {track}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Picture Upload (Static for now) */}
          <div className="space-y-2">
            <Label>Picture</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Choose file — no file chosen
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter course description"
              rows={3}
              required
            />
          </div>

          {/* Author (hidden field, auto-filled) */}
          <input
            type="hidden"
            name="author"
            value={formData.title} // Use title as author for now
            onChange={handleInputChange}
          />

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create course
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
