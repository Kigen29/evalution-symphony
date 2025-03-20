
import React from "react";
import { Helmet } from "react-helmet";
import DashboardLayout from "@/layouts/DashboardLayout";
import PerformanceContract from "@/components/PerformanceContract";

const Contract = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>Performance Contract | Performance Management System</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Performance Contract</h1>
        <p className="text-muted-foreground">
          Review and manage your performance agreement
        </p>
      </div>

      {/* Contract */}
      <PerformanceContract />
    </DashboardLayout>
  );
};

export default Contract;
