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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Grid3X3,
  Image,
  List,
  MoreVertical,
  Plus,
  Search,
  Tag,
  Trash2,
  Upload,
  Video,
  Zap,
} from "lucide-react";
import { useState } from "react";

const mockAssets = [
  {
    id: 1,
    name: "Company Logo - Primary",
    type: "image",
    format: "PNG",
    size: "1200x300",
    fileSize: "245 KB",
    campaigns: ["Professional Consulting", "Brand Awareness"],
    status: "active",
    uploadedDate: "2024-01-15",
    performance: {
      impressions: 125000,
      clicks: 3200,
      ctr: 2.56,
    },
    tags: ["logo", "branding", "primary"],
  },
  {
    id: 2,
    name: "Hero Image - Consulting Services",
    type: "image",
    format: "JPG",
    size: "1200x628",
    fileSize: "890 KB",
    campaigns: ["Professional Consulting"],
    status: "active",
    uploadedDate: "2024-01-12",
    performance: {
      impressions: 89000,
      clicks: 2100,
      ctr: 2.36,
    },
    tags: ["hero", "consulting", "services"],
  },
  {
    id: 3,
    name: "Product Demo Video",
    type: "video",
    format: "MP4",
    size: "1920x1080",
    fileSize: "12.5 MB",
    campaigns: ["SaaS Free Trial"],
    status: "active",
    uploadedDate: "2024-01-10",
    performance: {
      impressions: 45000,
      clicks: 1800,
      ctr: 4.0,
    },
    tags: ["demo", "video", "saas"],
  },
  {
    id: 4,
    name: "Mobile App Screenshot",
    type: "image",
    format: "PNG",
    size: "750x1334",
    fileSize: "420 KB",
    campaigns: ["Mobile App Campaign"],
    status: "needs_review",
    uploadedDate: "2024-01-08",
    performance: {
      impressions: 23000,
      clicks: 460,
      ctr: 2.0,
    },
    tags: ["mobile", "app", "screenshot"],
  },
  {
    id: 5,
    name: "Square Social Media Logo",
    type: "image",
    format: "PNG",
    size: "1200x1200",
    fileSize: "180 KB",
    campaigns: ["Social Media Campaigns"],
    status: "archived",
    uploadedDate: "2024-01-05",
    performance: {
      impressions: 67000,
      clicks: 890,
      ctr: 1.33,
    },
    tags: ["logo", "square", "social"],
  },
  {
    id: 6,
    name: "Customer Testimonial Video",
    type: "video",
    format: "MP4",
    size: "1280x720",
    fileSize: "8.2 MB",
    campaigns: ["Brand Awareness"],
    status: "active",
    uploadedDate: "2024-01-03",
    performance: {
      impressions: 34000,
      clicks: 1200,
      ctr: 3.53,
    },
    tags: ["testimonial", "video", "customer"],
  },
];

const assetTemplates = [
  {
    id: 1,
    name: "Responsive Display Ad",
    description: "Complete set of images for responsive display campaigns",
    requirements: [
      "Logo: 1200x300 (4:1 ratio)",
      "Landscape: 1200x628 (1.91:1 ratio)",
      "Square: 1200x1200 (1:1 ratio)",
    ],
    estimatedTime: "15 minutes",
  },
  {
    id: 2,
    name: "Shopping Campaign",
    description: "Product images optimized for shopping campaigns",
    requirements: [
      "Product Image: 800x800 minimum",
      "Lifestyle Image: 1200x1200",
      "Detail Shots: 600x600 minimum",
    ],
    estimatedTime: "20 minutes",
  },
  {
    id: 3,
    name: "Video Campaign",
    description: "Video assets for YouTube and display campaigns",
    requirements: [
      "Main Video: 16:9 aspect ratio",
      "Square Video: 1:1 aspect ratio",
      "Vertical Video: 9:16 aspect ratio",
    ],
    estimatedTime: "30 minutes",
  },
];

const getAssetIcon = (type: string) => {
  switch (type) {
    case "image":
      return <Image className="h-5 w-5 text-blue-500" />;
    case "video":
      return <Video className="h-5 w-5 text-purple-500" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "needs_review":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "archived":
      return <Clock className="h-4 w-4 text-gray-500" />;
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
    case "needs_review":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Needs Review
        </Badge>
      );
    case "archived":
      return <Badge variant="outline">Archived</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export function AssetManagement() {
  const [selectedTab, setSelectedTab] = useState("all-assets");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesType = typeFilter === "all" || asset.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || asset.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Asset Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload, organize, and manage your creative assets for Google Ads
            campaigns
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Assets
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all-assets">All Assets</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="auto-generate">Auto-Generate</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="all-assets" className="space-y-6">
          {/* Filters and Search */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <Label htmlFor="search">Search Assets</Label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by name, tags, or campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="needs_review">Needs Review</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Assets Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssets.map((asset) => (
                <Card key={asset.id} className="overflow-hidden">
                  {/* Asset Preview */}
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {asset.type === "image" ? (
                      <div className="text-center">
                        <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">{asset.size}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Video className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">{asset.size}</p>
                      </div>
                    )}
                  </div>

                  {/* Asset Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getAssetIcon(asset.type)}
                        <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {asset.name}
                        </h3>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{asset.format}</span>
                        <span className="text-gray-500">{asset.fileSize}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {getStatusIcon(asset.status)}
                        {getStatusBadge(asset.status)}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {asset.tags.slice(0, 2).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {asset.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{asset.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        Used in {asset.campaigns.length} campaign
                        {asset.campaigns.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6">
              <div className="space-y-4">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {getAssetIcon(asset.type)}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {asset.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{asset.format}</span>
                          <span>{asset.size}</span>
                          <span>{asset.fileSize}</span>
                          <span>Uploaded {asset.uploadedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {asset.performance.impressions.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Impressions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {asset.performance.clicks.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {asset.performance.ctr}%
                        </p>
                        <p className="text-xs text-gray-500">CTR</p>
                      </div>
                      {getStatusBadge(asset.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Asset Templates</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Pre-configured asset sets optimized for different campaign types
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assetTemplates.map((template) => (
                <Card key={template.id} className="p-6">
                  <h4 className="font-semibold mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {template.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <h5 className="text-sm font-medium">Requirements:</h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {template.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{template.estimatedTime}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Use Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="auto-generate" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              AI-Powered Asset Generation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Generate professional assets automatically using AI and brand
              guidelines
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Generate Display Ads</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Create responsive display ads from your brand assets and
                    campaign content
                  </p>
                  <Button>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Ads
                  </Button>
                </div>
              </Card>

              <Card className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <Image className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Resize & Optimize</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Automatically resize existing assets to all required
                    dimensions
                  </p>
                  <Button variant="outline">
                    <Image className="h-4 w-4 mr-2" />
                    Resize Assets
                  </Button>
                </div>
              </Card>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Brand Guidelines</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Set up your brand guidelines to ensure consistent asset generation
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Primary Brand Color</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-8 h-8 bg-blue-600 rounded border" />
                  <Input value="#3B82F6" readOnly className="flex-1" />
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <div>
                <Label>Secondary Brand Color</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-8 h-8 bg-gray-600 rounded border" />
                  <Input value="#6B7280" readOnly className="flex-1" />
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <div>
                <Label>Brand Font</Label>
                <Select defaultValue="inter">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="helvetica">Helvetica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Logo Style</Label>
                <Select defaultValue="horizontal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="icon">Icon Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Image className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Images
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                24
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Video className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Videos
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                8
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Impressions
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                483K
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg. CTR
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                2.8%
              </p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Top Performing Assets
            </h3>
            <div className="space-y-4">
              {filteredAssets
                .sort((a, b) => b.performance.ctr - a.performance.ctr)
                .slice(0, 5)
                .map((asset, index) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      {getAssetIcon(asset.type)}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {asset.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {asset.campaigns[0]}{" "}
                          {asset.campaigns.length > 1 &&
                            `+${asset.campaigns.length - 1} more`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {asset.performance.impressions.toLocaleString()}
                        </p>
                        <p className="text-gray-500">Impressions</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {asset.performance.clicks.toLocaleString()}
                        </p>
                        <p className="text-gray-500">Clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {asset.performance.ctr}%
                        </p>
                        <p className="text-gray-500">CTR</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Modal (simplified) */}
      {showUpload && (
        <Card className="fixed inset-4 z-50 overflow-auto bg-white dark:bg-gray-900 border shadow-2xl">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upload Assets</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowUpload(false)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drag and drop your files here
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Or click to browse and select files
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Select Files
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
