"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  DollarSign,
  FileText,
  Home,
  Image,
  Layers,
  Menu,
  PenTool,
  Plus,
  Search,
  Settings,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, current: true },
  { name: "Campaigns", href: "/campaigns", icon: Target, current: false },
  {
    name: "Create Campaign",
    href: "/campaigns/create",
    icon: Plus,
    current: false,
  },
  { name: "Ad Management", href: "/ads", icon: PenTool, current: false },
  { name: "Keywords", href: "/keywords", icon: Search, current: false },
  { name: "Assets", href: "/assets", icon: Image, current: false },
  { name: "Analytics", href: "/analytics", icon: BarChart3, current: false },
  { name: "Audiences", href: "/audiences", icon: Users, current: false },
  { name: "Automation", href: "/automation", icon: Zap, current: false },
  { name: "Reports", href: "/reports", icon: FileText, current: false },
];

const stats = [
  {
    name: "Active Campaigns",
    value: "12",
    change: "+4.75%",
    changeType: "positive",
  },
  {
    name: "Total Spend",
    value: "$2,340",
    change: "+54.02%",
    changeType: "positive",
  },
  {
    name: "Conversions",
    value: "89",
    change: "-1.39%",
    changeType: "negative",
  },
  { name: "ROAS", value: "4.2x", change: "+10.18%", changeType: "positive" },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-40 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Layers className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold">Ads Manager</span>
              </div>
            </div>
            <nav className="flex-1 space-y-1 py-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    item.current
                      ? "bg-blue-50 border-r-2 border-blue-600 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group flex items-center px-6 py-2 text-sm font-medium",
                  )}
                >
                  <item.icon
                    className={cn(
                      item.current
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 h-5 w-5",
                    )}
                  />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-200 dark:border-gray-700 px-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Layers className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Ads Manager
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 py-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    item.current
                      ? "bg-blue-50 border-r-2 border-blue-600 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                    "group flex items-center px-6 py-2 text-sm font-medium",
                  )}
                >
                  <item.icon
                    className={cn(
                      item.current
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300",
                      "mr-3 h-5 w-5",
                    )}
                  />
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Account info */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Google Ads Account
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    ID: 123-456-7890
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-72">
        <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">
          <main className="flex-1">
            <div className="py-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
