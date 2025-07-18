"use client";

import type React from "react";
import { useState } from "react";
import DashboardSidebar from "./dashboard-sidebar";
import DashboardHeader from "./dashboard-header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // for desktop

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
        isCollapsed={isCollapsed}
      />

      {/* Main content area */}
      <div className={isCollapsed ? "lg:pl-20" : "lg:pl-64"}>
        <DashboardHeader
          onMenuClick={() => {
            if (window.innerWidth < 1024) {
              setSidebarOpen(true); // open sidebar on mobile
            } else {
              toggleSidebar(); // toggle collapse on desktop
            }
          }}
        />

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
