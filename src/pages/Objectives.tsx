
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/layouts/DashboardLayout";
import ObjectivesTracker from "@/components/ObjectivesTracker";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ObjectiveDialog from "@/components/ObjectiveDialog";
import { Objective } from "@/lib/supabase";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createObjective } from "@/services/ObjectivesService";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

const Objectives = () => {
  const { user } = useUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const createObjectiveMutation = useMutation({
    mutationFn: (data: Omit<Objective, "id" | "progress">) => createObjective(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectives'] });
      toast.success('Objective added successfully');
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error adding objective:', error);
      toast.error('Failed to add objective');
    }
  });

  const handleSaveObjective = (values: Omit<Objective, "id" | "progress">) => {
    if (!user) {
      toast.error('You must be logged in to create objectives');
      return;
    }
    
    createObjectiveMutation.mutate(values);
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Objectives | Performance Management System</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold">SMART Objectives</h1>
          <p className="text-muted-foreground">
            Manage and track your performance objectives
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <PlusCircle className="mr-1 h-4 w-4" />
          New Objective
        </Button>
      </div>

      {/* Objectives tracker */}
      <ObjectivesTracker />

      {/* Add Objective Dialog triggered from header button */}
      <ObjectiveDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveObjective}
        isEditing={false}
      />
    </DashboardLayout>
  );
};

export default Objectives;
