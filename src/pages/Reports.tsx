
import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileBarChart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Sample data for reports
const reportData = [
  {
    id: 1,
    period: "Q1 2023",
    overallScore: 82,
    rating: "Very Good",
    status: "Completed",
    date: "2023-03-31",
  },
  {
    id: 2,
    period: "Q2 2023",
    overallScore: 85,
    rating: "Very Good",
    status: "Completed",
    date: "2023-06-30",
  },
  {
    id: 3,
    period: "Q3 2023",
    overallScore: 88,
    rating: "Very Good",
    status: "In Progress",
    date: "2023-09-30",
  },
];

// Data for performance comparison chart
const performanceData = [
  { name: "Q1 2022", Self: 78, Department: 75, Organization: 72 },
  { name: "Q2 2022", Self: 80, Department: 78, Organization: 76 },
  { name: "Q3 2022", Self: 82, Department: 80, Organization: 79 },
  { name: "Q4 2022", Self: 85, Department: 82, Organization: 80 },
  { name: "Q1 2023", Self: 82, Department: 83, Organization: 81 },
  { name: "Q2 2023", Self: 85, Department: 84, Organization: 82 },
  { name: "Q3 2023", Self: 88, Department: 85, Organization: 83 },
];

const Reports = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>Reports | Performance Management System</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold">Performance Reports</h1>
          <p className="text-muted-foreground">
            View and analyze your performance reports
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="mr-1 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Performance Comparison Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="Self"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
                <Bar
                  dataKey="Department"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
                <Bar
                  dataKey="Organization"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  animationDuration={2000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-medium">
            <div className="flex items-center">
              <FileBarChart className="mr-2 h-5 w-5" />
              Previous Reports
            </div>
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Overall Score</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {report.period}
                  </TableCell>
                  <TableCell>{report.overallScore}%</TableCell>
                  <TableCell>{report.rating}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        report.status === "Completed"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {report.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(report.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Reports;
