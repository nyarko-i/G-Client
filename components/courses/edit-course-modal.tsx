"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
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
import { Course } from "@/lib/types/course";

// Define the update payload format
export type UpdatedCoursePayload = Omit<Course, "status"> & {
  status: "active" | "inactive" | "draft";
  pictureFile?: File;
};

export interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onSubmit: (updated: UpdatedCoursePayload) => void;
}

export default function EditCourseModal({
  isOpen,
  onClose,
  course,
  onSubmit,
}: EditCourseModalProps) {
  const [title, setTitle] = useState(course.title);
  const [track, setTrack] = useState(course.track);
  const [description, setDescription] = useState(course.description);
  const [status, setStatus] = useState<"active" | "inactive" | "draft">(
    course.status || "draft"
  );
  const [pictureFile, setPictureFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  // Sync modal fields with selected course
  useEffect(() => {
    setTitle(course.title);
    setTrack(course.track);
    setDescription(course.description);
    setStatus(course.status || "draft");
    setPictureFile(undefined);
  }, [course]);

  // Handle update submission
  const handleSave = () => {
    if (!title || !track || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    const updated: UpdatedCoursePayload = {
      ...course,
      title,
      track,
      description,
      status,
      ...(pictureFile && { pictureFile }),
    };

    setLoading(true);
    try {
      onSubmit(updated);
      toast.success("Course updated");
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>

        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label>Track</Label>
          <Input value={track} onChange={(e) => setTrack(e.target.value)} />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <Label>Status</Label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={status}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setStatus(e.target.value as "active" | "inactive" | "draft")
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div>
          <Label>New Picture</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPictureFile(e.target.files?.[0])
            }
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
