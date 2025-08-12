/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/learner/learners-table.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Learner } from "@/lib/types/learner";

type Props = {
  learners: Learner[];
  onView: (learner: Learner) => void;
  learnersPerPage?: number;
};

export default function LearnersTable({
  learners,
  onView,
  learnersPerPage = 6,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  // Defensive: ensure learners is an array
  const source = Array.isArray(learners) ? learners : [];

  const totalPages = Math.max(1, Math.ceil(source.length / learnersPerPage));
  const startIndex = (currentPage - 1) * learnersPerPage;
  const currentLearners = useMemo(
    () => source.slice(startIndex, startIndex + learnersPerPage),
    [source, startIndex, learnersPerPage]
  );

  // Helpers
  const formatDate = (raw?: string) => {
    if (!raw) return "—";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return raw;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }); // "Jan 6, 2022"
  };

  const formatAmount = (val: any) => {
    if (val == null) return "—";
    // if numeric
    if (typeof val === "number") return `$${val.toLocaleString()}`;
    const s = String(val).trim();
    if (s === "") return "—";
    // already has $ or currency symbol
    if (/^\$|£|€/.test(s)) return s;
    // pure number string
    if (/^\d+(\.\d+)?$/.test(s)) return `$${Number(s).toLocaleString()}`;
    return s;
  };

  const getInitials = (name?: string) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // If the current page becomes invalid (e.g. learners shrink), clamp it
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  return (
    <Card className="transition-all duration-300">
      <CardContent className="p-0">
        {/* Header (matches visual from your screenshot) */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm text-gray-700 rounded-t-lg">
          <div className="col-span-3">LEARNERS</div>
          <div className="col-span-3">COURSES</div>
          <div className="col-span-2">DATE JOINED</div>
          <div className="col-span-2">AMOUNT</div>
          <div className="col-span-1">GENDER</div>
          <div className="col-span-1 text-center">ACTIONS</div>
        </div>

        {/* Body */}
        <div className="divide-y">
          {currentLearners.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No learners found.
            </div>
          ) : (
            currentLearners.map((learner, idx) => (
              <div
                key={learner.id ?? `${learner.email}-${idx}`}
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-gray-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                {/* Learner (avatar + name) */}
                <div className="col-span-3 flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-100 text-blue-600 text-sm font-medium">
                    {learner.avatar ? (
                      // Using unoptimized to avoid next/image domain setup issues — remove if you already configured domains
                      <Image
                        src={learner.avatar}
                        alt={learner.name ?? "Learner"}
                        width={40}
                        height={40}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="px-0">{getInitials(learner.name)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {learner.name ?? "—"}
                    </p>
                    {/* optional secondary line you can enable:
                        <p className="text-xs text-gray-500">{learner.program}</p>
                    */}
                  </div>
                </div>

                {/* Courses column shows program or email (your screenshot used email in that column) */}
                <div className="col-span-3 flex items-center">
                  <span className="text-gray-600">
                    {/* prefer program/track if present, otherwise email */}
                    {learner.program || learner.email || "—"}
                  </span>
                </div>

                {/* Date joined */}
                <div className="col-span-2 flex items-center">
                  <span className="text-gray-600">
                    {formatDate(learner.dateJoined)}
                  </span>
                </div>

                {/* Amount (from paidStatus/amount fields) */}
                <div className="col-span-2 flex items-center">
                  <span className="text-gray-900">
                    {formatAmount(
                      (learner as any).paidStatus ??
                        (learner as any).amount ??
                        (learner as any).payment ??
                        "—"
                    )}
                  </span>
                </div>

                {/* Gender */}
                <div className="col-span-1 flex items-center">
                  <span className="text-gray-600">{learner.gender ?? "—"}</span>
                </div>

                {/* Actions (eye) */}
                <div className="col-span-1 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(learner)}
                    className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition"
                    aria-label={`View ${learner.name}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-blue-600 hover:text-blue-700"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-md text-sm flex items-center justify-center ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-blue-600 border"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="text-blue-600 hover:text-blue-700"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
