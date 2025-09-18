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
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  Copy,
  Edit,
  Eye,
  Filter,
  Lightbulb,
  MoreVertical,
  Pause,
  Play,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const mockAds = [
  {
    id: 1,
    type: "Responsive Search Ad",
    campaign: "Professional Consulting - Lead Gen",
    adGroup: "Business Consulting - Exact",
    status: "active",
    headlines: [
      "Expert Business Consulting",
      "Transform Your Business Today",
      "Proven Strategy Solutions",
    ],
    descriptions: [
      "Unlock your business potential with our proven consulting strategies. Free consultation available.",
      "Join 500+ successful businesses. Expert guidance, measurable results.",
    ],
    finalUrl: "https://example.com/consulting",
    impressions: 12450,
    clicks: 423,
    ctr: 3.4,
    conversions: 23,
    cpa: 6.2,
    qualityScore: 8.2,
    lastUpdated: "2 hours ago",
    isWinning: true,
  },
  {
    id: 2,
    type: "Responsive Search Ad",
    campaign: "Professional Consulting - Lead Gen",
    adGroup: "Business Consulting - Exact",
    status: "active",
    headlines: [
      "Professional Business Advisor",
      "Get Results That Matter",
      "Strategic Business Solutions",
    ],
    descriptions: [
      "Professional consulting services for growing businesses. Contact us for a free strategy session.",
      "Trusted by 300+ companies. Proven track record, guaranteed satisfaction.",
    ],
    finalUrl: "https://example.com/consulting",
    impressions: 11200,
    clicks: 356,
    ctr: 3.2,
    conversions: 18,
    cpa: 7.8,
    qualityScore: 7.8,
    lastUpdated: "3 hours ago",
    isWinning: false,
  },
  {
    id: 3,
    type: "Responsive Display Ad",
    campaign: "Brand Awareness - Display",
    adGroup: "Business Professionals",
    status: "paused",
    headlines: ["Leading Business Consultants", "Drive Growth & Success"],
    descriptions: [
      "Transform your business with expert guidance from our team of experienced consultants.",
    ],
    finalUrl: "https://example.com/services",
    impressions: 45600,
    clicks: 228,
    ctr: 0.5,
    conversions: 3,
    cpa: 25.4,
    qualityScore: 7.2,
    lastUpdated: "1 day ago",
    isWinning: false,
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

export function AdManagement() {
  const [selectedTab, setSelectedTab] = useState("all-ads");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [showCreateAd, setShowCreateAd] = useState(false);

  const [newAd, setNewAd] = useState({
    type: "responsive_search",
    campaign: "",
    adGroup: "",
    headlines: [""],
    descriptions: [""],
    finalUrl: "",
  });

  const filteredAds = mockAds.filter((ad) => {
    const matchesSearch =
      ad.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.headlines.some((h) =>
        h.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesStatus = statusFilter === "all" || ad.status === statusFilter;
    const matchesCampaign =
      campaignFilter === "all" || ad.campaign === campaignFilter;
    return matchesSearch && matchesStatus && matchesCampaign;
  });

  const addHeadline = () => {
    if (newAd.headlines.length < 15) {
      setNewAd({
        ...newAd,
        headlines: [...newAd.headlines, ""],
      });
    }
  };

  const addDescription = () => {
    if (newAd.descriptions.length < 4) {
      setNewAd({
        ...newAd,
        descriptions: [...newAd.descriptions, ""],
      });
    }
  };

  const removeHeadline = (index: number) => {
    const newHeadlines = newAd.headlines.filter((_, i) => i !== index);
    setNewAd({ ...newAd, headlines: newHeadlines });
  };

  const removeDescription = (index: number) => {
    const newDescriptions = newAd.descriptions.filter((_, i) => i !== index);
    setNewAd({ ...newAd, descriptions: newDescriptions });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ad Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, manage, and optimize your ad copy and creative assets
          </p>
        </div>
        <Button onClick={() => setShowCreateAd(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Ad
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all-ads">All Ads</TabsTrigger>
          <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="all-ads" className="space-y-6">
          {/* Filters */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Ads</Label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by campaign, ad group, or ad copy..."
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
                    <SelectItem value="needs_attention">
                      Needs Attention
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Campaign</Label>
                <Select
                  value={campaignFilter}
                  onValueChange={setCampaignFilter}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    <SelectItem value="Professional Consulting - Lead Gen">
                      Professional Consulting
                    </SelectItem>
                    <SelectItem value="Brand Awareness - Display">
                      Brand Awareness
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Ads List */}
          <div className="space-y-4">
            {filteredAds.map((ad) => (
              <Card key={ad.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(ad.status)}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {ad.type}
                        </h3>
                        {ad.isWinning && (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800"
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Winning
                          </Badge>
                        )}
                        {getStatusBadge(ad.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {ad.campaign} • {ad.adGroup}
                      </p>
                      <p className="text-xs text-gray-400">
                        Updated {ad.lastUpdated}
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
                        Preview Ad
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Ad
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate Ad
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Performance
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {ad.status === "active" ? (
                        <DropdownMenuItem>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause Ad
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>
                          <Play className="h-4 w-4 mr-2" />
                          Resume Ad
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Ad
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Ad Preview */}
                <div className="mb-4 p-4 border rounded bg-white dark:bg-gray-800">
                  <div className="text-xs text-green-600 mb-1">Ad</div>
                  <div className="text-blue-600 hover:underline cursor-pointer text-sm mb-1">
                    {ad.finalUrl}
                  </div>
                  <div className="text-lg text-blue-600 hover:underline cursor-pointer mb-1">
                    {ad.headlines.slice(0, 3).join(" • ")}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {ad.descriptions[0]}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {ad.impressions.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Impressions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {ad.clicks}
                    </p>
                    <p className="text-xs text-gray-500">Clicks</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {ad.ctr}%
                      </p>
                      {ad.ctr >= 3.0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">CTR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {ad.conversions}
                    </p>
                    <p className="text-xs text-gray-500">Conversions</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${ad.cpa}
                      </p>
                      {ad.cpa <= 8.0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">CPA</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {ad.qualityScore}/10
                      </p>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <p className="text-xs text-gray-500">Quality Score</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ab-testing" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">A/B Testing Overview</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 border-2 border-green-200 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Winner: Ad Variation A</h4>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +24% CTR
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Expert Business Consulting • Transform Your Business Today
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">3.4%</p>
                    <p className="text-gray-500">CTR</p>
                  </div>
                  <div>
                    <p className="font-medium">423</p>
                    <p className="text-gray-500">Clicks</p>
                  </div>
                  <div>
                    <p className="font-medium">23</p>
                    <p className="text-gray-500">Conversions</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Ad Variation B</h4>
                  <Badge variant="outline">Testing</Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Professional Business Advisor • Get Results That Matter
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">3.2%</p>
                    <p className="text-gray-500">CTR</p>
                  </div>
                  <div>
                    <p className="font-medium">356</p>
                    <p className="text-gray-500">Clicks</p>
                  </div>
                  <div>
                    <p className="font-medium">18</p>
                    <p className="text-gray-500">Conversions</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6 flex space-x-4">
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Set Up New A/B Test
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Results
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ad Copy Templates</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-medium mb-2">Lead Generation Template</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Headlines:</span>
                    <ul className="ml-4 text-gray-600 dark:text-gray-400">
                      <li>• Expert [Service] Solutions</li>
                      <li>• Transform Your [Business/Life]</li>
                      <li>• Free Consultation Available</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium">Descriptions:</span>
                    <ul className="ml-4 text-gray-600 dark:text-gray-400">
                      <li>
                        • Proven strategies for [target]. Get started with a
                        free consultation.
                      </li>
                      <li>
                        • Join [X]+ satisfied clients. Expert guidance,
                        guaranteed results.
                      </li>
                    </ul>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-2">E-commerce Template</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Headlines:</span>
                    <ul className="ml-4 text-gray-600 dark:text-gray-400">
                      <li>• Premium [Product] On Sale</li>
                      <li>• Free Shipping & Returns</li>
                      <li>• Shop [Brand] Official Store</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium">Descriptions:</span>
                    <ul className="ml-4 text-gray-600 dark:text-gray-400">
                      <li>
                        • Discover bestselling [product] with [features]. Free
                        shipping on orders over $[X].
                      </li>
                      <li>
                        • Authentic [brand] products. 30-day returns. 4.8/5
                        stars from customers.
                      </li>
                    </ul>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Creative Assets</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4 text-center">
                <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Logo 1200x300</span>
                </div>
                <h4 className="font-medium mb-2">Company Logo</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Used in 5 campaigns
                </p>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Card>

              <Card className="p-4 text-center">
                <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Image 1200x628</span>
                </div>
                <h4 className="font-medium mb-2">Hero Image</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Used in 3 campaigns
                </p>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Card>

              <Card className="p-4 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="h-32 flex items-center justify-center">
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
                <h4 className="font-medium mb-2">Upload New Asset</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Add images, logos, or videos
                </p>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Ad Modal/Form (simplified for now) */}
      {showCreateAd && (
        <Card className="fixed inset-4 z-50 overflow-auto bg-white dark:bg-gray-900 border shadow-2xl">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create New Ad</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateAd(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ad Type</Label>
                <Select
                  value={newAd.type}
                  onValueChange={(value) => setNewAd({ ...newAd, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="responsive_search">
                      Responsive Search Ad
                    </SelectItem>
                    <SelectItem value="responsive_display">
                      Responsive Display Ad
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Campaign</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulting">
                      Professional Consulting - Lead Gen
                    </SelectItem>
                    <SelectItem value="brand">
                      Brand Awareness - Display
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Final URL</Label>
              <Input
                placeholder="https://example.com/landing-page"
                value={newAd.finalUrl}
                onChange={(e) =>
                  setNewAd({ ...newAd, finalUrl: e.target.value })
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Headlines (3-15)</Label>
                <Button variant="outline" size="sm" onClick={addHeadline}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Headline
                </Button>
              </div>
              <div className="space-y-2">
                {newAd.headlines.map((headline, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder={`Headline ${index + 1}`}
                      value={headline}
                      onChange={(e) => {
                        const newHeadlines = [...newAd.headlines];
                        newHeadlines[index] = e.target.value;
                        setNewAd({ ...newAd, headlines: newHeadlines });
                      }}
                      maxLength={30}
                    />
                    <span className="text-xs text-gray-500 min-w-fit">
                      {headline.length}/30
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHeadline(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Descriptions (2-4)</Label>
                <Button variant="outline" size="sm" onClick={addDescription}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Description
                </Button>
              </div>
              <div className="space-y-2">
                {newAd.descriptions.map((description, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Textarea
                      placeholder={`Description ${index + 1}`}
                      value={description}
                      onChange={(e) => {
                        const newDescriptions = [...newAd.descriptions];
                        newDescriptions[index] = e.target.value;
                        setNewAd({ ...newAd, descriptions: newDescriptions });
                      }}
                      maxLength={90}
                      rows={2}
                    />
                    <div className="flex flex-col items-center mt-2">
                      <span className="text-xs text-gray-500 min-w-fit">
                        {description.length}/90
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDescription(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateAd(false)}>
                Cancel
              </Button>
              <Button>Create Ad</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
