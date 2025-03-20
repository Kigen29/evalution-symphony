
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="animate-fade-in ml-0 min-h-screen transition-all duration-300 md:ml-64 lg:ml-64">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
