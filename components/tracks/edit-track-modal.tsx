"use client";

import { useState, useEffect, ChangeEvent } from "react";
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
import { toast } from "sonner";
import { TrackData } from "@/lib/types/track";

interface EditTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTrack: TrackData) => void;
  track: TrackData | null;
}

export default function EditTrackModal({
  isOpen,
  onClose,
  onUpdate,
  track,
}: EditTrackModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    duration: "",
    instructor: "",
    description: "",
    technologies: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title,
        price: track.price.toString(),
        duration: track.duration,
        instructor: track.instructor,
        description: track.description,
        technologies: track.technologies.join(", "),
      });
    }
  }, [track]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!track?.id) return toast.error("Missing track ID.");

    const form = new FormData();
    form.append("name", formData.title); // API expects 'name'
    form.append("price", formData.price);
    form.append("duration", formData.duration);
    form.append("instructor", formData.instructor);
    form.append("description", formData.description);
    form.append("technologies", formData.technologies);

    if (selectedImage) {
      form.append("image", selectedImage);
    }

    try {
      const res = await fetch(`/api/tracks/${track.id}`, {
        method: "PUT",
        body: form,
      });

      const json = await res.json();

      if (json.success && json.data) {
        toast.success("Track updated successfully");
        onUpdate(json.data); // Send updated data back to parent
        onClose(); // Close modal
      } else {
        toast.error(json.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Track</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Track Name</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <Input
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Instructor</Label>
            <Input
              name="instructor"
              value={formData.instructor}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Image (upload new to replace)</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {selectedImage && (
              <p className="text-xs text-gray-500">
                Selected: {selectedImage.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Technologies (comma separated)</Label>
            <Input
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
