"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddCourseModal from "./add-course-modal";
import EditCourseModal from "./edit-course-modal";
import CoursesTable from "./courses-table";
import { Course } from "@/lib/types/course";
import { getCourses, updateCourse, deleteCourse } from "@/lib/api/auth";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

export default function CoursesPageContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  // Load courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data || []);
      } catch {
        toast.error("Failed to load courses");
      }
    };

    fetchCourses();
  }, []);

  // Add course to state
  const handleAddCourse = (newCourse: Course) => {
    if (!newCourse) return;
    setCourses((prev) => [newCourse, ...prev]);
  };

  // Update course
  const handleUpdateCourse = async (
    updatedData: Partial<Course> & { pictureFile?: File }
  ) => {
    if (!editCourse) return;

    const formData = new FormData();
    formData.append("title", updatedData.title || "");
    formData.append("track", updatedData.track || "");
    formData.append("description", updatedData.description || "");
    formData.append("author", updatedData.author || "");
    formData.append("status", updatedData.status || "draft");
    if (updatedData.pictureFile) {
      formData.append("picture", updatedData.pictureFile);
    }

    try {
      const res = await updateCourse(editCourse.id!, formData);
      if (res.data) {
        setCourses((prev) =>
          prev.map((c) => (c.id === editCourse.id ? res.data! : c))
        );
        toast.success("Course updated");
      }
      setEditCourse(null);
    } catch {
      toast.error("Failed to update course");
    }
  };

  // Delete course
  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success("Course deleted");
    } catch {
      toast.error("Failed to delete course");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Courses</h2>
          <Button onClick={() => setIsAddOpen(true)}>Add Course</Button>
        </div>

        {/* Courses Table */}
        <CoursesTable
          courses={courses}
          onEdit={(course) => setEditCourse(course)}
          onDelete={handleDeleteCourse}
        />

        {/* Add Course Modal */}
        <AddCourseModal
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          onSubmit={handleAddCourse}
        />

        {/* Edit Course Modal */}
        {editCourse && (
          <EditCourseModal
            isOpen={!!editCourse}
            onClose={() => setEditCourse(null)}
            course={editCourse}
            onSubmit={handleUpdateCourse}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
