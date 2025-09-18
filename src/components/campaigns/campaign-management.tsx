"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  Copy,
  DollarSign,
  Edit,
  Eye,
  Filter,
  MoreVertical,
  Pause,
  Play,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const campaigns = [
  {
    id: 1,
    name: "Professional Consulting - Lead Gen",
    status: "active",
    type: "Search",
    budget: 150,
    spend: 142.5,
    impressions: 12450,
    clicks: 423,
    ctr: 3.4,
    conversions: 23,
    cpa: 6.2,
    roas: 4.8,
    qualityScore: 8.2,
    lastUpdated: "2 hours ago",
    landingPage: "https://example.com/consulting",
  },
  {
    id: 2,
    name: "E-commerce Summer Sale",
    status: "paused",
    type: "Shopping",
    budget: 300,
    spend: 287.6,
    impressions: 34200,
    clicks: 1240,
    ctr: 3.6,
    conversions: 45,
    cpa: 6.39,
    roas: 3.9,
    qualityScore: 7.8,
    lastUpdated: "1 day ago",
    landingPage: "https://example.com/summer-sale",
  },
  {
    id: 3,
    name: "SaaS Free Trial Campaign",
    status: "active",
    type: "Search",
    budget: 200,
    spend: 198.4,
    impressions: 8900,
    clicks: 365,
    ctr: 4.1,
    conversions: 12,
    cpa: 16.53,
    roas: 5.2,
    qualityScore: 9.1,
    lastUpdated: "30 minutes ago",
    landingPage: "https://example.com/free-trial",
  },
  {
    id: 4,
    name: "Local Service - HVAC Repair",
    status: "needs_attention",
    type: "Search",
    budget: 100,
    spend: 94.3,
    impressions: 5670,
    clicks: 108,
    ctr: 1.9,
    conversions: 8,
    cpa: 11.79,
    roas: 2.1,
    qualityScore: 6.5,
    lastUpdated: "5 hours ago",
    landingPage: "https://example.com/hvac",
  },
  {
    id: 5,
    name: "Brand Awareness - Display",
    status: "active",
    type: "Display",
    budget: 80,
    spend: 76.2,
    impressions: 45600,
    clicks: 228,
    ctr: 0.5,
    conversions: 3,
    cpa: 25.4,
    roas: 1.8,
    qualityScore: 7.2,
    lastUpdated: "4 hours ago",
    landingPage: "https://example.com/brand",
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

const getPerformanceIndicator = (
  value: number,
  threshold: number,
  higher_is_better = true,
) => {
  const isGood = higher_is_better ? value >= threshold : value <= threshold;
  return isGood ? (
    <TrendingUp className="h-3 w-3 text-green-500" />
  ) : (
    <TrendingDown className="h-3 w-3 text-red-500" />
  );
};

export function CampaignManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    const matchesType = typeFilter === "all" || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalSpend = filteredCampaigns.reduce(
    (sum, campaign) => sum + campaign.spend,
    0,
  );
  const totalConversions = filteredCampaigns.reduce(
    (sum, campaign) => sum + campaign.conversions,
    0,
  );
  const avgRoas =
    filteredCampaigns.reduce((sum, campaign) => sum + campaign.roas, 0) /
    filteredCampaigns.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Campaign Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analyze and manage your Google Ads campaigns
          </p>
        </div>
        <Button asChild>
          <a href="/campaigns/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </a>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Campaigns
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {filteredCampaigns.length}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Spend
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            ${totalSpend.toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Conversions
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {totalConversions}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg. ROAS
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {avgRoas.toFixed(1)}x
          </p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Search Campaigns</Label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by campaign name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="needs_attention">Needs Attention</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Search">Search</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Display">Display</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Campaigns Table */}
      <Card className="p-6">
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedCampaigns.includes(campaign.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCampaigns([
                          ...selectedCampaigns,
                          campaign.id,
                        ]);
                      } else {
                        setSelectedCampaigns(
                          selectedCampaigns.filter((id) => id !== campaign.id),
                        );
                      }
                    }}
                  />
                  {getStatusIcon(campaign.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {campaign.name}
                      </h3>
                      <Badge variant="outline">{campaign.type}</Badge>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {campaign.landingPage} • Updated {campaign.lastUpdated}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Campaign
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {campaign.status === "active" ? (
                      <DropdownMenuItem>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Campaign
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <Play className="h-4 w-4 mr-2" />
                        Resume Campaign
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Campaign
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Performance Metrics */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${campaign.budget}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">Budget</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${campaign.spend}
                    </p>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      style={{ opacity: campaign.spend / campaign.budget }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Spend</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.impressions.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">Impressions</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.clicks}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">Clicks</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.ctr}%
                    </p>
                    {getPerformanceIndicator(campaign.ctr, 2.0)}
                  </div>
                  <p className="text-xs text-gray-500">CTR</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.conversions}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">Conversions</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${campaign.cpa}
                    </p>
                    {getPerformanceIndicator(campaign.cpa, 10.0, false)}
                  </div>
                  <p className="text-xs text-gray-500">CPA</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.roas}x
                    </p>
                    {getPerformanceIndicator(campaign.roas, 3.0)}
                  </div>
                  <p className="text-xs text-gray-500">ROAS</p>
                </div>
              </div>

              {/* Quality Score */}
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-xs text-gray-500">Quality Score:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        campaign.qualityScore >= 8
                          ? "bg-green-500"
                          : campaign.qualityScore >= 6
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${(campaign.qualityScore / 10) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {campaign.qualityScore}/10
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedCampaigns.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                {selectedCampaigns.length} campaign(s) selected
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Bulk Edit
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
