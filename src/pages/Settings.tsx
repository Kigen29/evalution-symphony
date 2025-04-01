
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BellRing, User, Shield, Bell, Globe } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { updateProfile } from "@/services/ProfileService";
import { useForm } from "react-hook-form";
import { Profile } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

const Settings = () => {
  const { profile, refreshProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleProfileUpdate = async (data: Partial<Profile>) => {
    try {
      setIsLoading(true);
      await updateProfile(data);
      await refreshProfile();
      toast.success("Profile updated successfully");
      // Invalidate any queries that might depend on profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Settings | Performance Management System</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and system settings
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="animate-fade-in space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    defaultValue={profile?.firstName || ""} 
                    onChange={(e) => {
                      // Debounce this in a real application
                      if (e.target.value !== profile?.firstName) {
                        handleProfileUpdate({ firstName: e.target.value });
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    defaultValue={profile?.lastName || ""} 
                    onChange={(e) => {
                      if (e.target.value !== profile?.lastName) {
                        handleProfileUpdate({ lastName: e.target.value });
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" disabled />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input 
                    id="position" 
                    defaultValue={profile?.position || ""}
                    onChange={(e) => {
                      if (e.target.value !== profile?.position) {
                        handleProfileUpdate({ position: e.target.value });
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    defaultValue={profile?.department || ""}
                    onValueChange={(value) => {
                      if (value !== profile?.department) {
                        handleProfileUpdate({ department: value });
                      }
                    }}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="it">Information Technology</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager</Label>
                  <Input 
                    id="manager" 
                    defaultValue={profile?.manager || ""}
                    onChange={(e) => {
                      if (e.target.value !== profile?.manager) {
                        handleProfileUpdate({ manager: e.target.value });
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={() => refreshProfile()} 
                  disabled={isLoading}
                >
                  Refresh Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="animate-fade-in space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  icon: <BellRing className="h-4 w-4 text-blue-500" />,
                  title: "Performance Reviews",
                  description: "Get notified when a review is scheduled or completed",
                },
                {
                  icon: <BellRing className="h-4 w-4 text-green-500" />,
                  title: "Objective Updates",
                  description: "Receive alerts when objectives are updated or status changes",
                },
                {
                  icon: <BellRing className="h-4 w-4 text-purple-500" />,
                  title: "Reminders",
                  description: "Get reminders for upcoming deadlines and meetings",
                },
                {
                  icon: <BellRing className="h-4 w-4 text-amber-500" />,
                  title: "System Announcements",
                  description: "Be informed about system updates and new features",
                },
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                      {notification.icon}
                    </div>
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked={index < 3} />
                </div>
              ))}
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="animate-fade-in space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">System Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc-8">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="utc+0">GMT (UTC+0)</SelectItem>
                      <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                      <SelectItem value="utc+3">East Africa Time (UTC+3)</SelectItem>
                      <SelectItem value="utc+8">China Standard Time (UTC+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="font-medium">Compact View</p>
                  <p className="text-sm text-muted-foreground">
                    Use a more compact UI layout
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="font-medium">Dashboard Auto-refresh</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh dashboard data every 15 minutes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="animate-fade-in space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;

