"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  Globe,
  Lightbulb,
  Loader2,
  PenTool,
  Plus,
  Search,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface CampaignData {
  // Basic Info
  name: string;
  type: string;
  businessType: string;
  landingPageUrl: string;

  // Targeting
  locations: string[];
  languages: string[];
  audiences: string[];

  // Budget & Bidding
  dailyBudget: number;
  biddingStrategy: string;
  targetCpa: number;
  targetRoas: number;

  // Keywords
  keywords: Array<{
    text: string;
    matchType: string;
    bid: number;
  }>;
  negativeKeywords: string[];

  // Ad Copy
  headlines: string[];
  descriptions: string[];

  // Analysis Results
  landingPageAnalysis: {
    businessType: string;
    primaryKeywords: string[];
    conversionGoal: string;
    targetAudience: string;
    competitorInsights: Array<{
      domain: string;
      adSpend: string;
      topKeywords: string[];
    }>;
    recommendations: string[];
    qualityScore: number;
  } | null;
  keywordSuggestions: Array<{
    text: string;
    matchType: string;
    bid: number;
    volume?: number;
    competition?: string;
  }>;
  competitorAnalysis:
    | {
        domain: string;
        adSpend: string;
        topKeywords: string[];
      }[]
    | null;
}

const steps = [
  {
    id: 1,
    name: "Landing Page Analysis",
    description: "Analyze your landing page",
  },
  {
    id: 2,
    name: "Campaign Setup",
    description: "Configure basic campaign settings",
  },
  { id: 3, name: "Targeting", description: "Define your target audience" },
  {
    id: 4,
    name: "Keywords & Bidding",
    description: "Set up keywords and bids",
  },
  { id: 5, name: "Ad Creation", description: "Create compelling ad copy" },
  { id: 6, name: "Review & Launch", description: "Review and launch campaign" },
];

const businessTypes = [
  {
    value: "lead_generation",
    label: "Lead Generation",
    description: "Professional services, consultants",
  },
  {
    value: "ecommerce",
    label: "E-commerce",
    description: "Online retail, product sales",
  },
  {
    value: "saas",
    label: "SaaS",
    description: "Software trials, subscriptions",
  },
  {
    value: "local_service",
    label: "Local Service",
    description: "Location-based services",
  },
  { value: "general", label: "General", description: "Other business types" },
];

const campaignTypes = [
  {
    value: "search",
    label: "Search Network",
    description: "Text ads on Google search results",
  },
  {
    value: "display",
    label: "Display Network",
    description: "Visual ads across the web",
  },
  {
    value: "shopping",
    label: "Shopping",
    description: "Product ads with images and prices",
  },
  {
    value: "video",
    label: "Video",
    description: "Video ads on YouTube and partner sites",
  },
];

const mockLandingPageAnalysis = {
  isAnalyzing: false,
  results: {
    businessType: "lead_generation",
    primaryKeywords: [
      "business consulting",
      "management consultant",
      "strategy advisor",
    ],
    conversionGoal: "form_submission",
    targetAudience: "Business owners and executives",
    competitorInsights: [
      {
        domain: "competitor1.com",
        adSpend: "$2,500",
        topKeywords: ["business consultant", "strategy"],
      },
      {
        domain: "competitor2.com",
        adSpend: "$1,800",
        topKeywords: ["management consulting", "advisor"],
      },
    ],
    recommendations: [
      "Add phone number tracking for call conversions",
      "Optimize form fields to reduce abandonment",
      "Add testimonials section for trust building",
    ],
    qualityScore: 8.2,
  },
};

export function CampaignCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    type: "",
    businessType: "",
    landingPageUrl: "",
    locations: [],
    languages: ["en"],
    audiences: [],
    dailyBudget: 100,
    biddingStrategy: "target_cpa",
    targetCpa: 50,
    targetRoas: 400,
    keywords: [],
    negativeKeywords: [],
    headlines: [],
    descriptions: [],
    landingPageAnalysis: null,
    keywordSuggestions: [],
    competitorAnalysis: null,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const analyzeLandingPage = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setCampaignData({
        ...campaignData,
        landingPageAnalysis: mockLandingPageAnalysis.results,
        businessType: mockLandingPageAnalysis.results.businessType,
        name: `${campaignData.landingPageUrl.split("/")[2]} - Lead Generation`,
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const generateKeywords = () => {
    const suggestions = [
      {
        text: "business consulting",
        matchType: "exact",
        bid: 2.5,
        volume: 1200,
        competition: "high",
      },
      {
        text: "management consultant",
        matchType: "phrase",
        bid: 3.2,
        volume: 800,
        competition: "medium",
      },
      {
        text: "strategy advisor",
        matchType: "broad",
        bid: 1.8,
        volume: 600,
        competition: "low",
      },
      {
        text: "business strategy consultant",
        matchType: "phrase",
        bid: 2.9,
        volume: 450,
        competition: "medium",
      },
      {
        text: "management consulting services",
        matchType: "broad",
        bid: 2.1,
        volume: 380,
        competition: "high",
      },
    ];

    setCampaignData({
      ...campaignData,
      keywordSuggestions: suggestions,
      keywords: suggestions
        .slice(0, 3)
        .map((s) => ({ text: s.text, matchType: s.matchType, bid: s.bid })),
    });
  };

  const generateAdCopy = () => {
    const headlines = [
      "Expert Business Consulting",
      "Transform Your Business Today",
      "Proven Strategy Solutions",
      "Professional Business Advisor",
      "Get Results That Matter",
    ];

    const descriptions = [
      "Unlock your business potential with our proven consulting strategies. Free consultation available.",
      "Join 500+ successful businesses. Expert guidance, measurable results, guaranteed satisfaction.",
    ];

    setCampaignData({
      ...campaignData,
      headlines,
      descriptions,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="landingPage">Landing Page URL</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  id="landingPage"
                  placeholder="https://example.com/landing-page"
                  value={campaignData.landingPageUrl}
                  onChange={(e) =>
                    setCampaignData({
                      ...campaignData,
                      landingPageUrl: e.target.value,
                    })
                  }
                />
                <Button
                  onClick={analyzeLandingPage}
                  disabled={!campaignData.landingPageUrl || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>

            {campaignData.landingPageAnalysis && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Analysis Complete
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Detected Business Type</h4>
                    <Badge variant="secondary">
                      {campaignData.landingPageAnalysis.businessType.replace(
                        "_",
                        " ",
                      )}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Quality Score</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: `${(campaignData.landingPageAnalysis.qualityScore / 10) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-medium">
                        {campaignData.landingPageAnalysis.qualityScore}/10
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">
                    Primary Keywords Detected
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {campaignData.landingPageAnalysis.primaryKeywords.map(
                      (keyword: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">
                    Optimization Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {campaignData.landingPageAnalysis.recommendations.map(
                      (rec: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-sm"
                        >
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </Card>
            )}
          </div>
        );

      default:
        return <div>Step content under development</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Campaign
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Step-by-step campaign creation with intelligent analysis
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href="/campaigns">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </a>
        </Button>
      </div>

      {/* Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.name}
          </h2>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {steps[currentStep - 1]?.description}
        </p>
      </Card>

      {/* Step Content */}
      <Card className="p-6">{renderStepContent()}</Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep === steps.length ? (
          <Button className="bg-green-600 hover:bg-green-700">
            <Target className="h-4 w-4 mr-2" />
            Launch Campaign
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
