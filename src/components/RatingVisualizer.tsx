
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const ratingCategories = [
  {
    label: "Excellent",
    range: "90-100%",
    description: "Consistently exceeds all expectations and requirements",
    color: "#22c55e", // green-500
  },
  {
    label: "Very Good",
    range: "80-89%",
    description: "Frequently exceeds expectations and requirements",
    color: "#3b82f6", // blue-500
  },
  {
    label: "Good",
    range: "70-79%",
    description: "Consistently meets expectations and requirements",
    color: "#8b5cf6", // violet-500
  },
  {
    label: "Fair",
    range: "60-69%",
    description: "Meets some expectations but needs improvement",
    color: "#f59e0b", // amber-500
  },
  {
    label: "Poor",
    range: "Below 60%",
    description: "Does not meet expectations, requires significant improvement",
    color: "#ef4444", // red-500
  },
];

interface RatingVisualizerProps {
  currentScore?: number;
}

const RatingVisualizer: React.FC<RatingVisualizerProps> = ({
  currentScore = 85,
}) => {
  // Find which category the current score falls into
  const getCurrentCategory = () => {
    if (currentScore >= 90) return 0;
    if (currentScore >= 80) return 1;
    if (currentScore >= 70) return 2;
    if (currentScore >= 60) return 3;
    return 4;
  };

  const currentCategoryIndex = getCurrentCategory();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium">
          Performance Rating Scale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Current Score: {currentScore}%
            </span>
            <span className="text-sm font-medium">
              Rating:{" "}
              <span
                style={{ color: ratingCategories[currentCategoryIndex].color }}
              >
                {ratingCategories[currentCategoryIndex].label}
              </span>
            </span>
          </div>

          {/* Score indicator */}
          <div className="relative h-2 rounded-full bg-secondary">
            <div
              className="absolute left-0 top-0 h-2 rounded-full transition-all duration-1000 ease-in-out"
              style={{
                width: `${currentScore}%`,
                backgroundColor: ratingCategories[currentCategoryIndex].color,
              }}
            ></div>
            <div
              className="absolute -top-1 h-4 w-4 rounded-full border-2 border-background transition-all duration-1000 ease-in-out"
              style={{
                left: `calc(${currentScore}% - 8px)`,
                backgroundColor: ratingCategories[currentCategoryIndex].color,
              }}
            ></div>
          </div>

          {/* Rating scale */}
          <div className="mt-6 flex">
            <TooltipProvider>
              {ratingCategories.map((category, index) => (
                <Tooltip key={category.label}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex flex-1 flex-col items-center p-2 text-center",
                        index === currentCategoryIndex &&
                          "rounded-lg bg-secondary"
                      )}
                    >
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="mt-1 text-xs font-medium">
                        {category.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {category.range}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">{category.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingVisualizer;
