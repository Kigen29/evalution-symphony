
import React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  BarChart2,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Sample data for the chart
const performanceData = [
  { month: "Jan", score: 78 },
  { month: "Feb", score: 82 },
  { month: "Mar", score: 85 },
  { month: "Apr", score: 80 },
  { month: "May", score: 88 },
  { month: "Jun", score: 92 },
];

// Metrics data
const metricsData = [
  {
    title: "Performance Score",
    value: "85%",
    description: "Current rating: Very Good",
    icon: <Award className="h-5 w-5 text-blue-500" />,
    trend: "+5% from last period",
    trendUp: true,
  },
  {
    title: "Objectives Completed",
    value: "7/10",
    description: "70% completion rate",
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    progress: 70,
  },
  {
    title: "Time to Review",
    value: "12",
    description: "Days until next review",
    icon: <Clock className="h-5 w-5 text-orange-500" />,
  },
  {
    title: "Department Ranking",
    value: "3rd",
    description: "Top 10% of your division",
    icon: <BarChart2 className="h-5 w-5 text-purple-500" />,
  },
];

const PerformanceMetrics = () => {
  return (
    <div className="space-y-6">
      {/* Performance chart */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-medium">
              Performance Trend
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center">
                <span className="mr-1 h-2 w-2 rounded-full bg-blue-500"></span>
                Monthly Score
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={performanceData}
                margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="rgb(59, 130, 246)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="rgb(59, 130, 246)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    border: "none",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="rgb(59, 130, 246)"
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricsData.map((metric, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-secondary p-2">{metric.icon}</div>
                {metric.trend && (
                  <div
                    className={cn(
                      "flex items-center text-xs",
                      metric.trendUp ? "text-green-600" : "text-red-600"
                    )}
                  >
                    <TrendingUp
                      className={cn(
                        "mr-1 h-3 w-3",
                        !metric.trendUp && "rotate-180"
                      )}
                    />
                    {metric.trend}
                  </div>
                )}
              </div>
              <div className="mt-3 space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </h3>
                <p className="text-2xl font-semibold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
                {metric.progress !== undefined && (
                  <Progress
                    className="mt-2 h-1.5"
                    value={metric.progress}
                    style={{ "--progress-width": `${metric.progress}%` } as React.CSSProperties}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
