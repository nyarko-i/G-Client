"use client";
import { useEffect, useState } from "react";
import StatsCards from "./stats-cards";
import TracksSection from "./tracks-section";
import AdvancedRevenueChart from "./advance-revenue-chart";
import LatestInvoices from "./latest-invoices";

/**
 * Main dashboard content component with entrance animations
 * Orchestrates all dashboard sections and provides staggered loading animations
 */
export default function DashboardContent() {
  // State to control animation timing
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger animations after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Header with fade-in animation */}
      <div
        className={`border-b border-gray-200 pb-4 transition-all duration-700 ease-out ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Welcome Admin
          <span className="text-2xl animate-wave">👋</span>
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Track activity, trends, and popular destinations in real time
        </p>
      </div>

      {/* Key Performance Indicators with staggered animation */}
      <div
        className={`transition-all duration-700 ease-out delay-150 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <StatsCards />
      </div>

      {/* Course Tracks Section with staggered animation */}
      <div
        className={`transition-all duration-700 ease-out delay-300 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <TracksSection />
      </div>

      {/* Bottom Section with Charts and Recent Activity */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-700 ease-out delay-450 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <AdvancedRevenueChart />
        <LatestInvoices />
      </div>
    </div>
  );
}
