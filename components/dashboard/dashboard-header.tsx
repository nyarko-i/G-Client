"use client";
import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      {/* Menu button (now always visible) */}
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-700"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Search bar with fixed max width */}
      <form className="relative flex-1 max-w-md mx-4" action="#" method="GET">
        <label htmlFor="search-field" className="sr-only">
          Search
        </label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="search-field"
          name="search"
          type="search"
          placeholder="Search..."
          className="pl-9 pr-3 py-2 text-sm w-full"
        />
      </form>

      {/* Notification icon */}
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-700 hover:text-gray-900"
      >
        <Bell className="h-6 w-6" />
        <span className="sr-only">View notifications</span>
      </Button>
    </div>
  );
}
