
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/layouts/DashboardLayout";
import ObjectivesTracker from "@/components/ObjectivesTracker";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ObjectiveDialog from "@/components/ObjectiveDialog";
import { Objective } from "@/lib/supabase";

const Objectives = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

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
        onSave={(values) => {
          console.log("Values from page button:", values);
          setDialogOpen(false);
        }}
        isEditing={false}
      />
    </DashboardLayout>
  );
};

export default Objectives;
