"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { TrendingUp, Users, DollarSign, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Interface for individual stat card data
 */
interface StatCardData {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
}

/**
 * Statistics cards data configuration
 * Contains all the key metrics displayed on the dashboard
 */
const statsData: StatCardData[] = [
  {
    title: "Total Learners",
    value: "120",
    change: "18% vs last month",
    changeType: "increase",
    icon: Users,
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Revenue",
    value: "$12,450",
    change: "10% vs last month",
    changeType: "increase",
    icon: DollarSign,
    iconBgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Invoice",
    value: "100",
    change: "2% vs last month",
    changeType: "increase",
    icon: FileText,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

/**
 * Individual stat card component with animations
 * Displays a single metric with icon, value, and trend information
 * Enhanced with hover effects and number counting animation
 */
function StatCard({ stat, index }: { stat: StatCardData; index: number }) {
  const Icon = stat.icon;
  const [displayValue, setDisplayValue] = useState("0");
  const [isVisible, setIsVisible] = useState(false);

  // Extract numeric value for animation
  const numericValue = Number.parseInt(stat.value.replace(/[^0-9]/g, ""));
  const prefix = stat.value.replace(/[0-9,]/g, "");

  // Animate number counting
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 1500;
    const increment = numericValue / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayValue(stat.value);
        clearInterval(timer);
      } else {
        const formattedValue = Math.floor(start).toLocaleString();
        setDisplayValue(prefix + formattedValue);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, numericValue, stat.value, prefix]);

  return (
    <Card
      className={`overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer group ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
              {stat.title}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2 transition-all duration-300 group-hover:text-blue-600">
              {displayValue}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm text-green-600 font-medium transition-colors duration-300 group-hover:text-green-700">
                {stat.change}
              </span>
            </div>
          </div>
          <div
            className={`p-3 rounded-full ${stat.iconBgColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
          >
            <Icon
              className={`h-6 w-6 ${stat.iconColor} transition-all duration-300 group-hover:scale-110`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Stats cards container component
 * Renders all key performance indicator cards in a responsive grid with staggered animations
 */
export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <StatCard key={index} stat={stat} index={index} />
      ))}
    </div>
  );
}
