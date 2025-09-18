"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  Lightbulb,
  MousePointer,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const performanceData = {
  overview: {
    totalSpend: 12340.5,
    totalImpressions: 245600,
    totalClicks: 8950,
    totalConversions: 342,
    averageCtr: 3.64,
    averageCpa: 36.08,
    averageRoas: 4.2,
    qualityScore: 8.1,
  },
  trends: {
    spend: { value: 12340.5, change: 15.4, trend: "up" },
    impressions: { value: 245600, change: 8.2, trend: "up" },
    clicks: { value: 8950, change: 12.1, trend: "up" },
    conversions: { value: 342, change: -2.3, trend: "down" },
    ctr: { value: 3.64, change: 5.7, trend: "up" },
    cpa: { value: 36.08, change: -8.1, trend: "down" },
    roas: { value: 4.2, change: 18.5, trend: "up" },
    qualityScore: { value: 8.1, change: 3.2, trend: "up" },
  },
};

const campaignPerformance = [
  {
    name: "Professional Consulting - Lead Gen",
    spend: 4250.3,
    impressions: 89400,
    clicks: 3240,
    conversions: 156,
    ctr: 3.62,
    cpa: 27.24,
    roas: 5.1,
    qualityScore: 8.4,
    trend: "up",
  },
  {
    name: "E-commerce Summer Sale",
    spend: 3890.2,
    impressions: 78200,
    clicks: 2880,
    conversions: 98,
    ctr: 3.68,
    cpa: 39.69,
    roas: 4.8,
    qualityScore: 7.9,
    trend: "up",
  },
  {
    name: "SaaS Free Trial Campaign",
    spend: 2100.45,
    impressions: 45600,
    clicks: 1850,
    conversions: 67,
    ctr: 4.06,
    cpa: 31.35,
    roas: 3.9,
    qualityScore: 8.7,
    trend: "stable",
  },
  {
    name: "Local Service - HVAC Repair",
    spend: 1560.3,
    impressions: 23100,
    clicks: 756,
    conversions: 15,
    ctr: 3.27,
    cpa: 104.02,
    roas: 2.1,
    qualityScore: 6.8,
    trend: "down",
  },
  {
    name: "Brand Awareness - Display",
    spend: 539.25,
    impressions: 9300,
    clicks: 224,
    conversions: 6,
    ctr: 2.41,
    cpa: 89.88,
    roas: 1.8,
    qualityScore: 7.2,
    trend: "stable",
  },
];

const insights = [
  {
    type: "opportunity",
    title: "Increase Budget for Top Performer",
    description:
      "Professional Consulting campaign has the highest ROAS (5.1x). Consider increasing budget by 20%.",
    impact: "Potential +$850 monthly revenue",
    priority: "high",
  },
  {
    type: "warning",
    title: "Poor Performance Alert",
    description:
      "HVAC Repair campaign has high CPA ($104.02). Review keywords and landing page optimization.",
    impact: "Could save $300+ monthly",
    priority: "high",
  },
  {
    type: "success",
    title: "Quality Score Improvement",
    description:
      "Average Quality Score increased to 8.1 (+3.2% this month). Well optimized campaigns!",
    impact: "Lower CPCs across all campaigns",
    priority: "medium",
  },
  {
    type: "opportunity",
    title: "Keyword Expansion Opportunity",
    description:
      "SaaS campaign has high CTR (4.06%) but low impression share. Add more relevant keywords.",
    impact: "Potential +15% more conversions",
    priority: "medium",
  },
];

const topKeywords = [
  {
    keyword: "business consulting",
    impressions: 12450,
    clicks: 423,
    ctr: 3.4,
    cpa: 28.5,
    conversions: 23,
  },
  {
    keyword: "management consultant",
    impressions: 8900,
    clicks: 365,
    ctr: 4.1,
    cpa: 31.2,
    conversions: 18,
  },
  {
    keyword: "strategy advisor",
    impressions: 6700,
    clicks: 201,
    ctr: 3.0,
    cpa: 42.15,
    conversions: 12,
  },
  {
    keyword: "business coach",
    impressions: 5400,
    clicks: 189,
    ctr: 3.5,
    cpa: 39.8,
    conversions: 9,
  },
  {
    keyword: "consulting services",
    impressions: 4800,
    clicks: 144,
    ctr: 3.0,
    cpa: 45.6,
    conversions: 7,
  },
];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  }
};

const getInsightIcon = (type: string) => {
  switch (type) {
    case "opportunity":
      return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return <BarChart3 className="h-5 w-5 text-blue-500" />;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High Priority</Badge>;
    case "medium":
      return <Badge variant="secondary">Medium Priority</Badge>;
    case "low":
      return <Badge variant="outline">Low Priority</Badge>;
    default:
      return <Badge variant="outline">Normal</Badge>;
  }
};

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("last_30_days");
  const [selectedMetric, setSelectedMetric] = useState("conversions");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Performance insights and reporting for your Google Ads campaigns
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_90_days">Last 90 Days</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Spend
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${performanceData.overview.totalSpend.toLocaleString()}
              </p>
            </div>
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">
              +{performanceData.trends.spend.change}%
            </span>
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Conversions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {performanceData.overview.totalConversions}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-red-600">
              {performanceData.trends.conversions.change}%
            </span>
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg. CPA
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${performanceData.overview.averageCpa}
              </p>
            </div>
            <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">
              {Math.abs(performanceData.trends.cpa.change)}%
            </span>
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg. ROAS
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {performanceData.overview.averageRoas}x
              </p>
            </div>
            <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">
              +{performanceData.trends.roas.change}%
            </span>
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Analysis</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="charts">Performance Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Campaign Performance Breakdown
            </h3>
            <div className="space-y-4">
              {campaignPerformance.map((campaign, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getTrendIcon(campaign.trend)}
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {campaign.name}
                      </h4>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${campaign.spend.toLocaleString()}
                      </p>
                      <p className="text-gray-500">Spend</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {campaign.impressions.toLocaleString()}
                      </p>
                      <p className="text-gray-500">Impressions</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {campaign.clicks.toLocaleString()}
                      </p>
                      <p className="text-gray-500">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {campaign.conversions}
                      </p>
                      <p className="text-gray-500">Conversions</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {campaign.ctr}%
                      </p>
                      <p className="text-gray-500">CTR</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${campaign.cpa}
                      </p>
                      <p className="text-gray-500">CPA</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {campaign.roas}x
                      </p>
                      <p className="text-gray-500">ROAS</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {campaign.qualityScore}/10
                      </p>
                      <p className="text-gray-500">Quality Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Top Performing Keywords
            </h3>
            <div className="space-y-3">
              {topKeywords.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {keyword.keyword}
                      </p>
                      <p className="text-sm text-gray-500">
                        {keyword.impressions.toLocaleString()} impressions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {keyword.clicks}
                      </p>
                      <p className="text-gray-500">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {keyword.ctr}%
                      </p>
                      <p className="text-gray-500">CTR</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${keyword.cpa}
                      </p>
                      <p className="text-gray-500">CPA</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {keyword.conversions}
                      </p>
                      <p className="text-gray-500">Conversions</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              AI-Powered Insights & Recommendations
            </h3>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {insight.title}
                        </h4>
                        {getPriorityBadge(insight.priority)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {insight.description}
                      </p>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {insight.impact}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Take Action
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Performance trend chart</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Shows clicks, conversions, and spend over time
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Campaign Comparison
              </h3>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Campaign comparison chart</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Compare performance across different campaigns
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Conversion funnel visualization
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Track user journey from impression to conversion
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Device Performance</h3>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MousePointer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Device breakdown chart</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Performance by desktop, mobile, and tablet
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
