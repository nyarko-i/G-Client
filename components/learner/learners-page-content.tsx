/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import LearnersTable from "./learners-table";
import ViewLearnerModal from "./view-learner-modal";
import type { Learner } from "@/lib/types/learner";
import { getLearners } from "@/lib/api/learners";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function LearnersPageContent() {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [filteredLearners, setFilteredLearners] = useState<Learner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingLearner, setViewingLearner] = useState<Learner | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch learners
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const res: any = await getLearners();

        let fetchedLearners: Learner[] = [];
        if (Array.isArray(res)) {
          fetchedLearners = res;
        } else if (Array.isArray(res?.data)) {
          fetchedLearners = res.data;
        } else if (Array.isArray(res?.learners)) {
          fetchedLearners = res.learners;
        } else if (Array.isArray(res?.data?.data)) {
          fetchedLearners = res.data.data;
        }

        setLearners(fetchedLearners);
        setFilteredLearners(fetchedLearners);
      } catch (error: any) {
        toast.error(
          error instanceof Error
            ? error.message
            : String(error ?? "Failed to load learners.")
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Search filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredLearners(
      learners.filter(
        (learner) =>
          learner.name.toLowerCase().includes(term) ||
          learner.email.toLowerCase().includes(term) ||
          (learner.program ?? "").toLowerCase().includes(term) ||
          String(learner.status).toLowerCase().includes(term)
      )
    );
  }, [searchTerm, learners]);

  const handleViewLearner = (learner: Learner) => {
    setViewingLearner(learner);
    setIsViewModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div
          className={`flex items-center justify-between transition-all duration-700 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Learners
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Filter, sort, and access detailed learner profiles
            </p>
          </div>
        </div>

        {/* Search */}
        <div
          className={`transition-all duration-700 ease-out delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search learner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table or Loading */}
        {isLoadingData ? (
          <div className="space-y-2">
            {/* Skeleton table header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 rounded-t-lg">
              <Skeleton className="h-4 w-20 col-span-3" />
              <Skeleton className="h-4 w-20 col-span-3" />
              <Skeleton className="h-4 w-20 col-span-2" />
              <Skeleton className="h-4 w-20 col-span-2" />
              <Skeleton className="h-4 w-12 col-span-1" />
              <Skeleton className="h-4 w-12 col-span-1" />
            </div>
            {/* Skeleton rows */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 p-4 items-center border-b"
              >
                <div className="col-span-3 flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20 col-span-3" />
                <Skeleton className="h-4 w-20 col-span-2" />
                <Skeleton className="h-4 w-20 col-span-2" />
                <Skeleton className="h-4 w-12 col-span-1" />
                <Skeleton className="h-4 w-12 col-span-1" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`transition-all duration-700 ease-out delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <LearnersTable
              learners={filteredLearners}
              onView={handleViewLearner}
            />
          </div>
        )}

        {/* View modal */}
        {viewingLearner && (
          <ViewLearnerModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setViewingLearner(null);
            }}
            learner={viewingLearner}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
