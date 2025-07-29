"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

// Props expected from parent component
interface AddTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

export default function AddTrackModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTrackModalProps) {
  // Form state variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [instructor, setInstructor] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // Handles image selection and preview display
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  // Handles form submission logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!file) return toast.error("Please select an image file");
    if (title.trim().length === 0)
      return toast.error("Track title is required");
    if (description.trim().length < 10)
      return toast.error("Description must be at least 10 characters");

    setIsLoading(true);

    // Prepare form data for API
    const form = new FormData();
    form.append("name", title);
    form.append("description", description);
    form.append("price", price);
    form.append("duration", duration);
    form.append("instructor", instructor);
    form.append("technologies", technologies);
    form.append("image", file);

    try {
      const res = await fetch("/api/tracks", {
        method: "POST",
        body: form,
      });

      const json = await res.json();

      if (!json.success) {
        toast.error(json.message || "Failed to add track");
        setIsLoading(false);
        return;
      }

      // Reset form and refresh parent data
      toast.success("Track added!");
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview(null);
      setPrice("");
      setDuration("");
      setInstructor("");
      setTechnologies("");
      onClose();
      await onSubmit();
    } catch {
      toast.error("Network error while adding track");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Track</DialogTitle>
        </DialogHeader>

        {/* Track submission form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="image">Track Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {/* Display image preview if available */}
            {preview && (
              <div className="mt-2 w-full h-32 relative">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain rounded"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 12 weeks"
              required
            />
          </div>

          <div>
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input
              id="technologies"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g. React, Node.js"
              required
            />
          </div>

          {/* Submit button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Submitting..." : "Add Track"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
