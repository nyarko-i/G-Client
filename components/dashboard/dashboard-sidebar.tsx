"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/auth";
import { toast } from "sonner";
import Image from "next/image";

// Sidebar navigation items
const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { name: "Learners", href: "/dashboard/learners", icon: Users },
  { name: "Tracks", href: "/dashboard/tracks", icon: BookOpen },
  { name: "Courses", href: "/dashboard/courses", icon: GraduationCap },
  { name: "Report", href: "/dashboard/reports", icon: BarChart3 },
];

export default function DashboardSidebar({
  isOpen,
  onToggle,
  isCollapsed,
}: {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  isCollapsed: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Retrieve user email from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserEmail(parsed?.email ?? null);
      } catch (err) {
        console.error("Failed to parse user data from localStorage:", err);
      }
    }
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  // Active link checker
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex">
        <div
          className={`flex flex-col transition-all duration-300 ease-in-out bg-blue-600 px-4 pb-4 ${
            isCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Logo Section */}
          <div
            className={`flex shrink-0 items-center animate-fade-in ${
              isCollapsed ? "h-16 justify-center" : "h-24 px-0"
            }`}
          >
            {isCollapsed ? (
              // Small square logo when collapsed
              <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center shadow-sm">
                <Image
                  src="/images/register/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  style={{ height: "auto", width: "auto" }}
                />
              </div>
            ) : (
              // Larger centered logo with matching nav width
              <div className="w-full bg-white rounded-md p-3 shadow-md flex items-center justify-center mx-2">
                <Image
                  src="/images/register/logo.png"
                  alt="Your Logo"
                  width={64}
                  height={64}
                  style={{ height: "auto", width: "auto" }}
                />
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-1 flex-col mt-4">
            <ul className="flex-1 space-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 p-2 rounded-md transition-all duration-300 font-semibold text-sm ${
                      isActive(item.href)
                        ? "bg-blue-700 text-white"
                        : "text-blue-200 hover:bg-blue-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Footer Section */}
            <div className="mt-6 border-t border-blue-500 pt-4">
              {/* Email + Avatar */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white text-xs font-bold">
                  {userEmail?.[0]?.toUpperCase() ?? "U"}
                </div>
                {!isCollapsed && (
                  <div className="text-xs text-blue-200 truncate max-w-[120px]">
                    {userEmail ?? "user@example.com"}
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="ghost"
                className={`mt-3 flex items-center text-blue-200 hover:text-white hover:bg-blue-700 ${
                  isCollapsed ? "justify-center" : "justify-start"
                }`}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {!isCollapsed && <span>Logout</span>}
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 z-50 flex">
          <div
            className={`w-64 bg-blue-600 p-4 transition-transform ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggle(false)}
                className="text-white"
              >
                x
              </Button>
            </div>

            {/* Mobile Nav Items */}
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onToggle(false)}
                  className={`flex items-center gap-3 p-2 rounded-md text-sm font-semibold ${
                    isActive(item.href)
                      ? "bg-blue-700 text-white"
                      : "text-blue-200 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile Footer */}
            <div className="mt-6 border-t border-blue-500 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white text-xs font-bold">
                  {userEmail?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="text-xs text-blue-200 truncate max-w-[120px]">
                  {userEmail ?? "user@example.com"}
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="mt-3 flex w-full items-center justify-start text-blue-200 hover:text-white hover:bg-blue-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Click-away overlay */}
          <div className="flex-1" onClick={() => onToggle(false)} />
        </div>
      </div>
    </>
  );
}
