"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Pause,
  Play,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    name: "Total Spend",
    value: "$12,340",
    change: "+54.02%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "Last 30 days",
  },
  {
    name: "Active Campaigns",
    value: "23",
    change: "+4",
    changeType: "positive" as const,
    icon: Target,
    description: "Currently running",
  },
  {
    name: "Conversions",
    value: "342",
    change: "-1.39%",
    changeType: "negative" as const,
    icon: Users,
    description: "This month",
  },
  {
    name: "Avg. ROAS",
    value: "4.2x",
    change: "+10.18%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "Return on ad spend",
  },
];

const recentCampaigns = [
  {
    id: 1,
    name: "Professional Consulting - Lead Gen",
    status: "active",
    spend: "$1,234",
    conversions: 23,
    ctr: "3.2%",
    roas: "4.8x",
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    name: "E-commerce Summer Sale",
    status: "paused",
    spend: "$2,876",
    conversions: 45,
    ctr: "2.8%",
    roas: "3.9x",
    lastUpdated: "1 day ago",
  },
  {
    id: 3,
    name: "SaaS Free Trial Campaign",
    status: "active",
    spend: "$987",
    conversions: 12,
    ctr: "4.1%",
    roas: "5.2x",
    lastUpdated: "30 minutes ago",
  },
  {
    id: 4,
    name: "Local Service - HVAC Repair",
    status: "needs_attention",
    spend: "$567",
    conversions: 8,
    ctr: "1.9%",
    roas: "2.1x",
    lastUpdated: "5 hours ago",
  },
];

const quickActions = [
  {
    title: "Create New Campaign",
    description: "Launch a new campaign with automated setup",
    icon: Plus,
    href: "/campaigns/create",
    color: "bg-blue-500",
  },
  {
    title: "Analyze Performance",
    description: "Deep dive into campaign performance metrics",
    icon: BarChart3,
    href: "/analytics",
    color: "bg-green-500",
  },
  {
    title: "Optimize Keywords",
    description: "Review and optimize keyword performance",
    icon: Target,
    href: "/keywords",
    color: "bg-purple-500",
  },
  {
    title: "Create Ad Assets",
    description: "Generate new ad creatives and assets",
    icon: Eye,
    href: "/assets",
    color: "bg-orange-500",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "paused":
      return <Pause className="h-4 w-4 text-yellow-500" />;
    case "needs_attention":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Active
        </Badge>
      );
    case "paused":
      return <Badge variant="secondary">Paused</Badge>;
    case "needs_attention":
      return <Badge variant="destructive">Needs Attention</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage your Google Ads campaigns
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stat.changeType === "positive" ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {stat.change}
              </span>
              <span className="text-gray-500 ml-2">{stat.description}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start text-left"
              asChild
            >
              <a href={action.href}>
                <div
                  className={`h-8 w-8 ${action.color} rounded-full flex items-center justify-center mb-2`}
                >
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {action.description}
                  </p>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </Card>

      {/* Recent Campaigns */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Campaigns
          </h2>
          <Button variant="outline" size="sm" asChild>
            <a href="/campaigns">View All</a>
          </Button>
        </div>
        <div className="space-y-4">
          {recentCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {getStatusIcon(campaign.status)}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {campaign.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Updated {campaign.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {campaign.spend}
                  </p>
                  <p className="text-xs text-gray-500">Spend</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {campaign.conversions}
                  </p>
                  <p className="text-xs text-gray-500">Conversions</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {campaign.ctr}
                  </p>
                  <p className="text-xs text-gray-500">CTR</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {campaign.roas}
                  </p>
                  <p className="text-xs text-gray-500">ROAS</p>
                </div>
                {getStatusBadge(campaign.status)}
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Overview
        </h2>
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Performance chart will be displayed here
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Integration with Google Ads API required
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
