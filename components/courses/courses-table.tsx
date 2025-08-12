"use client";

import React from "react";
import Image from "next/image";
import { Course } from "@/lib/types/course";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  if (!Array.isArray(courses) || courses.length === 0) {
    return <p className="text-sm text-muted-foreground">No courses found.</p>;
  }

  return (
    <div className="overflow-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Track</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courses.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                {c.picture ? (
                  <Image
                    src={c.picture}
                    alt={c.title}
                    width={60}
                    height={40}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-[60px] h-[40px] bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    No Image
                  </div>
                )}
              </TableCell>
              <TableCell>{c.title}</TableCell>
              <TableCell>{c.author}</TableCell>
              <TableCell>{c.track}</TableCell>
              <TableCell>
                <Badge variant={c.status === "active" ? "default" : "outline"}>
                  {c.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {c.dateCreated ?? "—"}
              </TableCell>
              <TableCell className="text-center space-x-2">
                <button
                  onClick={() => onEdit(c)}
                  className="underline text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(c.id!)}
                  className="underline text-red-600"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
