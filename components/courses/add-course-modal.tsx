"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getTracks, createCourse } from "@/lib/api/auth"; // adjust if your API fn is uploadCourse
import { Track } from "@/lib/types/track";
import { Course } from "@/lib/types/course";

interface AddCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (course: Course) => void;
}

export default function AddCourseModal({
  open,
  onOpenChange,
  onSubmit,
}: AddCourseModalProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [formData, setFormData] = useState<{
    title: string;
    track: string;
    description: string;
    pictureFile: File | null;
  }>({
    title: "",
    track: "",
    description: "",
    pictureFile: null,
  });

  // Fetch tracks when modal opens
  useEffect(() => {
    if (!open) return;

    const fetchTracks = async () => {
      try {
        const res = await getTracks();
        // defensive: make sure res.data is an array
        const tracksData = Array.isArray(res.data) ? res.data : [];
        setTracks(tracksData);
      } catch (err) {
        console.error("getTracks error:", err);
        toast.error("Failed to load tracks");
        setTracks([]);
      }
    };

    fetchTracks();
  }, [open]);

  // Generic change handler (inputs + select + textarea)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // TypeScript-safe file handler (no 'possibly null' error)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // explicit local variable and guards satisfy TS
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    // FileList.item(0) returns File | null according to DOM typing; guard again
    const file = files.item(0);
    if (!file) return;

    setFormData((prev) => ({ ...prev, pictureFile: file }));
  };

  const handleSubmit = async () => {
    const { title, track, description, pictureFile } = formData;

    if (!title || !track || !description || !pictureFile) {
      toast.error("Please fill all fields and select a picture.");
      return;
    }

    const payload = new FormData();
    payload.append("title", title);
    payload.append("track", track);
    payload.append("description", description);
    payload.append("picture", pictureFile);

    try {
      const res = await createCourse(payload); // rename to uploadCourse if that's what your API exports
      if (res?.data) {
        onSubmit(res.data as Course);
        toast.success("Course added successfully");
        onOpenChange(false);
        setFormData({
          title: "",
          track: "",
          description: "",
          pictureFile: null,
        });
      }
    } catch (err) {
      console.error("createCourse error:", err);
      toast.error("Failed to add course");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Course title"
            />
          </div>

          <div>
            <Label htmlFor="track">Track</Label>
            <select
              id="track"
              name="track"
              value={formData.track}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select a track</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {/* use `name` because your API returns `name` on track */}
                  {/* If your track shape differs, adjust here */}
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows={4}
              placeholder="Course description"
            />
          </div>

          <div>
            <Label htmlFor="picture">Picture</Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {formData.pictureFile && (
            <div className="mt-2 w-40 h-24 relative rounded overflow-hidden border">
              <Image
                src={URL.createObjectURL(formData.pictureFile)}
                alt="Selected picture preview"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          <Button onClick={handleSubmit} className="w-full">
            Add Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
