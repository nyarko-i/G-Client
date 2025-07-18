"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ComposedChart,
  Tooltip,
  TooltipProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

/** Extended data */
const data = [
  { month: "Jan", revenue: 4000, growth: 12 },
  { month: "Feb", revenue: 3000, growth: -25 },
  { month: "Mar", revenue: 5000, growth: 67 },
  { month: "Apr", revenue: 2800, growth: -44 },
  { month: "May", revenue: 3900, growth: 39 },
  { month: "Jun", revenue: 4200, growth: 8 },
];

/** Calculate totals */
const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
const avgGrowth = data.reduce((sum, d) => sum + d.growth, 0) / data.length;

/** Custom tooltip renderer */
function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        {payload.map((entry) => (
          <div key={entry.dataKey as string} className="text-sm">
            <strong>{entry.name}:</strong> {entry.value}
            {entry.dataKey === "revenue" ? "$" : "%"}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function AdvancedRevenueChart() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <Card
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } hover:shadow-lg`}
    >
      <CardHeader className="transition-colors duration-300 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              Revenue Analytics
            </CardTitle>
            <CardDescription>
              Revenue and growth trends over 6 months
            </CardDescription>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${totalRevenue.toLocaleString()}
            </div>
            <div
              className={`flex items-center text-sm ${
                avgGrowth >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {avgGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {avgGrowth.toFixed(1)}% avg growth
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />

            <YAxis
              yAxisId="revenue"
              orientation="left"
              tickLine={false}
              axisLine={false}
              className="text-xs"
              tickFormatter={(value: number) =>
                `$${(value / 1000).toFixed(0)}k`
              }
            />

            <YAxis
              yAxisId="growth"
              orientation="right"
              tickLine={false}
              axisLine={false}
              className="text-xs"
              tickFormatter={(value: number) => `${value}%`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
              className="transition-all duration-300 hover:opacity-80"
            />

            <Line
              yAxisId="growth"
              type="monotone"
              dataKey="growth"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--chart-2))", r: 4, strokeWidth: 2 }}
              activeDot={{
                r: 6,
                stroke: "hsl(var(--chart-2))",
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
