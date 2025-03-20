
import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/layouts/DashboardLayout";
import ObjectivesTracker from "@/components/ObjectivesTracker";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Objectives = () => {
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
        <Button>
          <PlusCircle className="mr-1 h-4 w-4" />
          New Objective
        </Button>
      </div>

      {/* Objectives tracker */}
      <ObjectivesTracker />
    </DashboardLayout>
  );
};

export default Objectives;
