
import React, { useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  ClipboardList,
  Edit,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Sample objectives data
const sampleObjectives = [
  {
    id: 1,
    title: "Improve customer satisfaction score",
    description:
      "Increase the average customer satisfaction rating from 4.2 to 4.5",
    kpi: "Customer Satisfaction Rating",
    weight: 20,
    target: "4.5/5.0",
    progress: 80,
    status: "On Track",
    dueDate: "2023-12-31",
  },
  {
    id: 2,
    title: "Reduce operational costs",
    description: "Decrease operational expenses by 15% through process optimization",
    kpi: "Percentage Cost Reduction",
    weight: 15,
    target: "15%",
    progress: 60,
    status: "At Risk",
    dueDate: "2023-12-31",
  },
  {
    id: 3,
    title: "Implement new compliance framework",
    description:
      "Roll out updated compliance procedures across all departments",
    kpi: "Implementation Completion",
    weight: 25,
    target: "100%",
    progress: 45,
    status: "Delayed",
    dueDate: "2023-12-31",
  },
  {
    id: 4,
    title: "Conduct staff training sessions",
    description:
      "Complete quarterly training sessions for all staff members",
    kpi: "Training Sessions Completed",
    weight: 10,
    target: "4 sessions",
    progress: 100,
    status: "Completed",
    dueDate: "2023-12-31",
  },
  {
    id: 5,
    title: "Develop strategic partnerships",
    description:
      "Establish at least 3 new strategic partnerships with key stakeholders",
    kpi: "New Partnerships",
    weight: 15,
    target: "3 partnerships",
    progress: 33,
    status: "On Track",
    dueDate: "2023-12-31",
  },
];

const ObjectivesTracker = () => {
  const [expandedObjective, setExpandedObjective] = useState<number | null>(
    null
  );

  const toggleObjective = (id: number) => {
    setExpandedObjective(expandedObjective === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-500/10 text-green-600";
      case "At Risk":
        return "bg-amber-500/10 text-amber-600";
      case "Delayed":
        return "bg-red-500/10 text-red-600";
      case "Completed":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-medium">
          SMART Objectives
        </CardTitle>
        <Button size="sm" className="h-8">
          <Plus className="mr-1 h-4 w-4" />
          Add Objective
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 rounded-lg bg-secondary p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-xl font-medium">1/5</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-secondary p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">In Progress</div>
                <div className="text-xl font-medium">3/5</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-secondary p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">At Risk</div>
                <div className="text-xl font-medium">1/5</div>
              </div>
            </div>
          </div>

          {/* Objectives list */}
          <div className="mt-6 space-y-3">
            {sampleObjectives.map((objective) => (
              <div
                key={objective.id}
                className={cn(
                  "overflow-hidden rounded-lg border transition-all duration-300 ease-in-out",
                  expandedObjective === objective.id
                    ? "shadow-md"
                    : "shadow-sm hover:shadow-md"
                )}
              >
                <div
                  className="flex cursor-pointer items-center justify-between p-4"
                  onClick={() => toggleObjective(objective.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="shrink-0">
                      {objective.status === "Completed" ? (
                        <ClipboardCheck className="h-5 w-5 text-green-600" />
                      ) : (
                        <ClipboardList className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{objective.title}</h4>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <span>
                          Weight: {objective.weight}%
                        </span>
                        <Badge
                          className={cn(
                            "font-normal",
                            getStatusColor(objective.status)
                          )}
                          variant="secondary"
                        >
                          {objective.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="hidden text-right sm:block">
                      <div className="text-sm font-medium">
                        {objective.progress}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Progress
                      </div>
                    </div>
                    <Progress
                      className="h-2 w-24"
                      value={objective.progress}
                      style={{ "--progress-width": `${objective.progress}%` } as React.CSSProperties}
                    />
                    {expandedObjective === objective.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                {expandedObjective === objective.id && (
                  <div className="animate-accordion-down border-t bg-secondary/50 px-4 py-3">
                    <div className="mb-3 text-sm">{objective.description}</div>
                    <div className="grid gap-3 md:grid-cols-4">
                      <div>
                        <div className="text-xs font-medium uppercase text-muted-foreground">
                          KPI
                        </div>
                        <div className="text-sm">{objective.kpi}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase text-muted-foreground">
                          Target
                        </div>
                        <div className="text-sm">{objective.target}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase text-muted-foreground">
                          Due Date
                        </div>
                        <div className="text-sm">
                          {new Date(objective.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Edit objective", objective.id);
                          }}
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectivesTracker;
