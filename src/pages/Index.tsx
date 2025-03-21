
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Bell, Download, MoveUpRight, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/layouts/DashboardLayout";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import RatingVisualizer from "@/components/RatingVisualizer";
import ObjectivesTracker from "@/components/ObjectivesTracker";
import ProfileEditor from "@/components/ProfileEditor";
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const { profile, isLoading } = useUser();

  const userName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 'User';

  return (
    <DashboardLayout>
      <Helmet>
        <title>Dashboard | Performance Management System</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Welcome back, {isLoading ? 'Loading...' : userName}
          </p>
          <h1 className="text-3xl font-semibold">Performance Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="mr-1 h-4 w-4" />
            Notifications
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setProfileEditorOpen(true)}
          >
            <UserCog className="mr-1 h-4 w-4" />
            Profile
          </Button>
          <Button size="sm">
            <Download className="mr-1 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance metrics */}
      <div className="mb-8">
        <PerformanceMetrics />
      </div>

      {/* Objectives and Rating */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ObjectivesTracker />
        </div>
        <div>
          <div className="space-y-8">
            <RatingVisualizer currentScore={85} />
            
            {/* Quick actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    {
                      title: "Schedule Review Meeting",
                      description: "Set up your next performance discussion",
                      icon: <UserCog className="h-5 w-5" />,
                      onClick: () => {
                        console.log("Schedule review clicked");
                      },
                    },
                    {
                      title: "Update Objectives",
                      description: "Review and modify your current objectives",
                      icon: <MoveUpRight className="h-5 w-5" />,
                      onClick: () => {
                        window.location.href = "/objectives";
                      },
                    },
                    {
                      title: "Download Contract",
                      description: "Get a PDF version of your contract",
                      icon: <Download className="h-5 w-5" />,
                      onClick: () => {
                        console.log("Download contract clicked");
                      },
                    },
                  ].map((action, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-secondary"
                      onClick={action.onClick}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {action.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{action.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Profile Editor */}
      <ProfileEditor 
        open={profileEditorOpen}
        onOpenChange={setProfileEditorOpen}
      />
    </DashboardLayout>
  );
};

export default Index;
