"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import CoursesTable from "./courses-table";
import AddCourseModal from "./add-course-modal";
import EditCourseModal from "./edit-course-modal";
import { Course } from "@/lib/types/course";

/** Sample courses data */
const coursesData: Course[] = [
  {
    id: "1",
    title: "ReactJS",
    author: "ReactJS",
    track: "Software Development",
    dateCreated: "Jan 5, 2022",
    description: "Learn React fundamentals and advanced concepts",
    picture: "/placeholder.svg?height=100&width=100&text=ReactJS",
    status: "active",
  },
  // … the other 7 items …
];

/** Available tracks for course creation */
const availableTracks = [
  "Software Development",
  "Cloud Computing",
  "Data Science",
  "UI/UX Design",
  "Mobile Development",
] as const;

export default function CoursesPageContent() {
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(coursesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Page entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter whenever searchTerm or courses change
  useEffect(() => {
    setFilteredCourses(
      courses.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.track.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, courses]);

  /** Add a new course */
  const handleAddCourse = (
    newCourse: Omit<Course, "id" | "dateCreated" | "status">
  ) => {
    const created: Course = {
      ...newCourse,
      id: String(courses.length + 1),
      dateCreated: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "active",
    };
    setCourses((prev) => [...prev, created]);
    setIsAddModalOpen(false);
  };

  /** Open edit modal */
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  };

  /** Update an existing course */
  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
    setEditingCourse(null);
    setIsEditModalOpen(false);
  };

  /** Delete a course */
  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div
          className={`flex items-center justify-between transition-all duration-700 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-sm text-gray-600 mt-1">
              Filter, sort, and access detailed courses
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add course
          </Button>
        </div>

        {/* Search Bar */}
        <div
          className={`transition-all duration-700 ease-out delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search course"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Courses Table */}
        <div
          className={`transition-all duration-700 ease-out delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CoursesTable
            courses={filteredCourses}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
          />
        </div>

        {/* Add Course Modal */}
        <AddCourseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCourse}
          availableTracks={availableTracks as unknown as string[]}
        />

        {/* Edit Course Modal */}
        <EditCourseModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCourse(null);
          }}
          onSubmit={handleUpdateCourse}
          course={editingCourse!}
          availableTracks={availableTracks as unknown as string[]}
        />
      </div>
    </DashboardLayout>
  );
}
