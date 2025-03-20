
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, FileText, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample contract data
const contractData = {
  employeeName: "John Doe",
  employeeId: "EMP-12345",
  department: "Finance",
  position: "Senior Accountant",
  supervisor: "Jane Smith",
  period: "January 2023 - December 2023",
  status: "In Progress",
  lastUpdated: "2023-09-15",
  signatureStatus: {
    employee: true,
    supervisor: false,
    reviewer: false,
  },
  completionPercentage: 65,
};

// Sample objectives
const contractObjectives = [
  {
    id: 1,
    objective: "Improve financial reporting accuracy",
    kpi: "Error rate in financial reports",
    weight: 25,
    target: "Reduce errors by 95%",
    timeline: "Quarterly",
  },
  {
    id: 2,
    objective: "Streamline accounts payable process",
    kpi: "Processing time for invoices",
    weight: 20,
    target: "Reduce to 2 business days",
    timeline: "Monthly",
  },
  {
    id: 3,
    objective: "Enhance budget forecasting",
    kpi: "Variance between forecast and actual",
    weight: 30,
    target: "Maximum 5% variance",
    timeline: "Bi-annually",
  },
  {
    id: 4,
    objective: "Implement new accounting software",
    kpi: "Implementation milestones",
    weight: 15,
    target: "100% completion",
    timeline: "End of Q3",
  },
  {
    id: 5,
    objective: "Conduct financial training sessions",
    kpi: "Training sessions conducted",
    weight: 10,
    target: "4 sessions",
    timeline: "Quarterly",
  },
];

const PerformanceContract = () => {
  const [section, setSection] = useState("overview");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <CardTitle className="text-xl font-medium">
            Performance Contract
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={section === "overview" ? "default" : "outline"}
              size="sm"
              onClick={() => setSection("overview")}
            >
              Overview
            </Button>
            <Button
              variant={section === "objectives" ? "default" : "outline"}
              size="sm"
              onClick={() => setSection("objectives")}
            >
              Objectives
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {section === "overview" ? (
          <div className="animate-fade-in p-6">
            <div className="mb-6 flex flex-col gap-6 sm:flex-row">
              <div className="flex-1 space-y-6">
                <div>
                  <Label className="text-xs font-normal text-muted-foreground">
                    Contract Status
                  </Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-500/10 text-blue-600"
                    >
                      {contractData.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Last updated: {new Date(contractData.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-normal text-muted-foreground">
                    Completion Progress
                  </Label>
                  <div className="flex items-center justify-between">
                    <Progress
                      className="h-2 flex-1"
                      value={contractData.completionPercentage}
                      style={{ "--progress-width": `${contractData.completionPercentage}%` } as React.CSSProperties}
                    />
                    <span className="ml-2 text-sm font-medium">
                      {contractData.completionPercentage}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-normal text-muted-foreground">
                    Signatures
                  </Label>
                  <div className="flex space-x-2">
                    <div
                      className={cn(
                        "flex items-center space-x-1 rounded-full px-3 py-1 text-xs",
                        contractData.signatureStatus.employee
                          ? "bg-green-500/10 text-green-600"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <UserCheck className="h-3 w-3" />
                      <span>Employee</span>
                    </div>
                    <div
                      className={cn(
                        "flex items-center space-x-1 rounded-full px-3 py-1 text-xs",
                        contractData.signatureStatus.supervisor
                          ? "bg-green-500/10 text-green-600"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <UserCheck className="h-3 w-3" />
                      <span>Supervisor</span>
                    </div>
                    <div
                      className={cn(
                        "flex items-center space-x-1 rounded-full px-3 py-1 text-xs",
                        contractData.signatureStatus.reviewer
                          ? "bg-green-500/10 text-green-600"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <UserCheck className="h-3 w-3" />
                      <span>Reviewer</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 rounded-lg border bg-muted/20 p-4">
                <div className="mb-3 flex items-center space-x-2 text-sm font-medium">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Contract Details</span>
                </div>
                <div className="grid gap-y-2 text-sm">
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Employee Name</div>
                    <div>{contractData.employeeName}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Employee ID</div>
                    <div>{contractData.employeeId}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Department</div>
                    <div>{contractData.department}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Position</div>
                    <div>{contractData.position}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Supervisor</div>
                    <div>{contractData.supervisor}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">
                      Performance Period
                    </div>
                    <div>{contractData.period}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="mb-2 flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <h3 className="text-sm font-medium">Document Sections</h3>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Employee Information",
                  "Strategic Objectives",
                  "Performance Indicators",
                  "Evaluation Criteria",
                  "Signature Fields",
                  "Comments Section",
                ].map((section, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 rounded-md border p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{section}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Strategic Objective</TableHead>
                  <TableHead>Key Performance Indicator</TableHead>
                  <TableHead className="w-[100px] text-center">
                    Weight (%)
                  </TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Timeline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contractObjectives.map((objective) => (
                  <TableRow key={objective.id}>
                    <TableCell className="font-medium">
                      {objective.id}
                    </TableCell>
                    <TableCell>{objective.objective}</TableCell>
                    <TableCell>{objective.kpi}</TableCell>
                    <TableCell className="text-center">
                      {objective.weight}
                    </TableCell>
                    <TableCell>{objective.target}</TableCell>
                    <TableCell>{objective.timeline}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total Weight:
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {contractObjectives.reduce(
                      (total, obj) => total + obj.weight,
                      0
                    )}
                    %
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceContract;
