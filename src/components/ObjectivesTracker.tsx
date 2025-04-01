import React, { useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  ClipboardList,
  Edit,
  Filter,
  Plus,
  Trash2,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ObjectiveDialog from "./ObjectiveDialog";
import ProgressUpdateDialog from "./ProgressUpdateDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Objective } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getObjectives, 
  createObjective, 
  updateObjective, 
  updateObjectiveProgress, 
  deleteObjective 
} from "@/services/ObjectivesService";

type ObjectiveStatus = "On Track" | "At Risk" | "Delayed" | "Completed";

const ObjectivesTracker = () => {
  const queryClient = useQueryClient();
  const [expandedObjective, setExpandedObjective] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | undefined>(undefined);
  const [updatingObjective, setUpdatingObjective] = useState<Objective | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '' as '' | ObjectiveStatus,
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  const { data: objectives = [], isLoading } = useQuery({
    queryKey: ['objectives', filters],
    queryFn: () => getObjectives(filters)
  });

  const createObjectiveMutation = useMutation({
    mutationFn: (data: Omit<Objective, "id" | "progress">) => createObjective(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectives'] });
      toast.success('Objective added successfully');
    },
    onError: (error) => {
      console.error('Error adding objective:', error);
      toast.error('Failed to add objective');
    }
  });

  const updateObjectiveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Objective> }) => 
      updateObjective(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectives'] });
      toast.success('Objective updated successfully');
    },
    onError: (error) => {
      console.error('Error updating objective:', error);
      toast.error('Failed to update objective');
    }
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ id, progress, status }: { id: string, progress: number, status: ObjectiveStatus }) => {
      return updateObjective(id, { progress, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectives'] });
      toast.success('Progress updated successfully');
    },
    onError: (error) => {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  });

  const deleteObjectiveMutation = useMutation({
    mutationFn: (id: string) => deleteObjective(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectives'] });
      toast.success('Objective deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting objective:', error);
      toast.error('Failed to delete objective');
    }
  });

  const toggleObjective = (id: string) => {
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

  const handleAddObjective = () => {
    setEditingObjective(undefined);
    setDialogOpen(true);
  };

  const handleEditObjective = (objective: Objective) => {
    setEditingObjective(objective);
    setDialogOpen(true);
  };

  const handleUpdateProgress = (objective: Objective) => {
    setUpdatingObjective(objective);
    setProgressDialogOpen(true);
  };

  const handleSaveObjective = async (data: Omit<Objective, "id" | "progress">) => {
    if (editingObjective) {
      updateObjectiveMutation.mutate({ 
        id: editingObjective.id, 
        data 
      });
    } else {
      createObjectiveMutation.mutate(data);
    }
    
    setDialogOpen(false);
    setEditingObjective(undefined);
  };

  const handleSaveProgress = async (objectiveId: string, updates: { progress: number; status: ObjectiveStatus; notes?: string }) => {
    updateProgressMutation.mutate({
      id: objectiveId,
      progress: updates.progress,
      status: updates.status
    });
    
    setProgressDialogOpen(false);
    setUpdatingObjective(undefined);
  };

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setObjectiveToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteObjective = async () => {
    if (objectiveToDelete !== null) {
      deleteObjectiveMutation.mutate(objectiveToDelete);
    }
    setDeleteDialogOpen(false);
    setObjectiveToDelete(null);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: key === 'status' ? (value as '' | ObjectiveStatus) : value 
    }));
  };

  const completedCount = objectives.filter((obj) => obj.status === "Completed").length;
  const atRiskCount = objectives.filter((obj) => obj.status === "At Risk").length;
  const inProgressCount = objectives.filter(
    (obj) => obj.status !== "Completed"
  ).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-medium">
          SMART Objectives
        </CardTitle>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="mr-1 h-4 w-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Filter Objectives</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Statuses</SelectItem>
                        <SelectItem value="On Track">On Track</SelectItem>
                        <SelectItem value="At Risk">At Risk</SelectItem>
                        <SelectItem value="Delayed">Delayed</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sort By</label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) => handleFilterChange('sortBy', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created_at">Date Created</SelectItem>
                        <SelectItem value="due_date">Due Date</SelectItem>
                        <SelectItem value="progress">Progress</SelectItem>
                        <SelectItem value="weight">Weight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sort Order</label>
                    <Select
                      value={filters.sortOrder}
                      onValueChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort Order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button size="sm" className="h-8" onClick={handleAddObjective}>
            <Plus className="mr-1 h-4 w-4" />
            Add Objective
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 rounded-lg bg-secondary p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-xl font-medium">
                  {isLoading ? <Skeleton className="h-6 w-12" /> : `${completedCount}/${objectives.length}`}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-secondary p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">In Progress</div>
                <div className="text-xl font-medium">
                  {isLoading ? <Skeleton className="h-6 w-12" /> : `${inProgressCount}/${objectives.length}`}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-secondary p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">At Risk</div>
                <div className="text-xl font-medium">
                  {isLoading ? <Skeleton className="h-6 w-12" /> : `${atRiskCount}/${objectives.length}`}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-lg border shadow-sm">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="mt-2 h-4 w-64" />
                  </div>
                </div>
              ))
            ) : objectives.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <ClipboardList className="mb-2 h-8 w-8 text-muted-foreground" />
                <h3 className="mb-1 text-lg font-medium">No objectives yet</h3>
                <p className="text-sm text-muted-foreground">
                  Click the "Add Objective" button to create your first SMART objective.
                </p>
                <Button onClick={handleAddObjective} className="mt-4">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Objective
                </Button>
              </div>
            ) : (
              objectives.map((objective) => (
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
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateProgress(objective);
                            }}
                          >
                            <BarChart className="mr-1 h-3 w-3" />
                            Update Progress
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditObjective(objective);
                            }}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={(e) => confirmDelete(objective.id, e)}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>

      <ObjectiveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        objective={editingObjective}
        onSave={handleSaveObjective}
        isEditing={!!editingObjective}
      />

      {updatingObjective && (
        <ProgressUpdateDialog
          open={progressDialogOpen}
          onOpenChange={setProgressDialogOpen}
          objective={updatingObjective}
          onSave={handleSaveProgress}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              objective from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteObjective} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ObjectivesTracker;
