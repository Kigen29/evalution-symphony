
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  Cog,
  Home,
  LineChart,
  Menu,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: <Home size={20} />,
  },
  {
    name: "Objectives",
    path: "/objectives",
    icon: <LineChart size={20} />,
  },
  {
    name: "Performance Contract",
    path: "/contract",
    icon: <ClipboardList size={20} />,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <BarChart3 size={20} />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <Cog size={20} />,
  },
];

const Sidebar = () => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 bg-background p-2 rounded-md shadow-md"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar shadow-lg transition-all duration-300 ease-in-out",
          isCollapsed ? "w-0 -translate-x-full" : "w-64 translate-x-0"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between px-6 py-6">
            <h1 className="text-xl font-semibold">Performance</h1>
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="rounded-full p-1 hover:bg-secondary"
                aria-label="Collapse sidebar"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* User profile summary */}
          <div className="mb-6 px-6">
            <div className="flex items-center space-x-3 rounded-lg bg-secondary p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-muted-foreground">
                  Administrator
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )
                }
                onClick={() => isMobile && setIsCollapsed(true)}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-auto p-4 text-center">
            <p className="text-xs text-muted-foreground">
              Performance Management System v1.0
            </p>
          </div>
        </div>
      </aside>

      {/* Collapsed sidebar button (for desktop) */}
      {isCollapsed && !isMobile && (
        <button
          className="fixed top-4 left-4 z-30 rounded-md bg-background p-2 shadow-md"
          onClick={toggleSidebar}
          aria-label="Expand sidebar"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Overlay for mobile */}
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
