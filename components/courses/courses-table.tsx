"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { Course } from "@/lib/types/course";

export interface CoursesTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

export default function CoursesTable({
  courses,
  onEdit,
  onDelete,
}: CoursesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const perPage = 6;

  const totalPages = Math.ceil(courses.length / perPage);
  const start = (currentPage - 1) * perPage;
  const pageItems = courses.slice(start, start + perPage);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [courses]);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      onDelete(id);
      toast.success(`"${title}" deleted`);
    }
  };

  const initials = (a: string) =>
    a
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  const color = (a: string) =>
    [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
    ][a.length % 8];

  return (
    <Card
      className={`
      transition-all duration-700
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
    `}
    >
      <CardContent className="p-0">
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-medium">
          <div className="col-span-4">COURSES</div>
          <div className="col-span-3">AUTHOR</div>
          <div className="col-span-3">DATE CREATED</div>
          <div className="col-span-2 text-center">ACTIONS</div>
        </div>

        <div className="divide-y">
          {pageItems.map((c, i) => (
            <div
              key={c.id}
              className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-all duration-300 group
                ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4"
                }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Course */}
              <div className="col-span-4 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
                  <Image
                    src={c.picture || "/placeholder.svg"}
                    alt={c.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600">
                    {c.title}
                  </p>
                  <p className="text-sm text-gray-500">{c.track}</p>
                </div>
              </div>

              {/* Author */}
              <div className="col-span-3 flex items-center space-x-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs ${color(
                    c.author
                  )}`}
                >
                  {initials(c.author)}
                </div>
                <span className="text-gray-900">{c.author}</span>
              </div>

              {/* Date */}
              <div className="col-span-3 flex items-center">
                <span className="text-gray-600">{c.dateCreated}</span>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(c)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(c.id!, c.title)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {pageItems.length === 0 && (
          <div className="p-8 text-center text-gray-500">No courses found.</div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <Button
                  key={idx}
                  variant={currentPage === idx + 1 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
