"use client";

import Link from "next/link";
import { useState } from "react";

interface CampaignData {
  // Step 1: Landing Page Analysis
  landingPageUrl: string;
  businessType: string;

  // Step 2: Campaign Setup
  campaignName: string;
  campaignType: string;

  // Step 3: Targeting
  locations: string[];
  languages: string[];
  ageRange: string;
  gender: string;

  // Step 4: Budget & Bidding
  dailyBudget: number;
  biddingStrategy: string;
  targetCpa: number;

  // Step 5: Keywords
  keywords: Array<{
    text: string;
    matchType: string;
    bid: number;
  }>;
  negativeKeywords: string[];

  // Step 6: Ad Creation
  headlines: string[];
  descriptions: string[];
}

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
];

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    landingPageUrl: "",
    businessType: "",
    campaignName: "",
    campaignType: "search",
    locations: ["United States"],
    languages: ["English"],
    ageRange: "18-65",
    gender: "all",
    dailyBudget: 100,
    biddingStrategy: "target_cpa",
    targetCpa: 50,
    keywords: [],
    negativeKeywords: [],
    headlines: [],
    descriptions: [],
  });

  const [analysisResults, setAnalysisResults] = useState<{
    businessType: string;
    suggestedName: string;
    keywords: string[];
    headlines: string[];
    descriptions: string[];
    qualityScore: number;
    recommendations: string[];
  } | null>(null);

  const steps = [
    {
      id: 1,
      name: "Landing Page Analysis",
      description: "Analyze your landing page",
    },
    { id: 2, name: "Campaign Setup", description: "Configure basic settings" },
    { id: 3, name: "Targeting", description: "Define your audience" },
    { id: 4, name: "Budget & Bidding", description: "Set budget and bids" },
    { id: 5, name: "Keywords", description: "Add keywords" },
    { id: 6, name: "Ad Creation", description: "Create ad copy" },
    { id: 7, name: "Review & Launch", description: "Review and launch" },
  ];

  const analyzeLandingPage = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResults({
        businessType: "lead_generation",
        suggestedName: `${new URL(campaignData.landingPageUrl).hostname} - Lead Generation`,
        keywords: [
          "business consulting",
          "professional services",
          "expert advice",
        ],
        headlines: [
          "Expert Business Consulting",
          "Professional Services",
          "Get Results Today",
        ],
        descriptions: [
          "Transform your business with expert guidance",
          "Proven strategies for success",
        ],
        qualityScore: 8.5,
        recommendations: [
          "Add phone number for call tracking",
          "Include customer testimonials",
          "Optimize form fields",
        ],
      });
      setCampaignData((prev) => ({
        ...prev,
        businessType: "lead_generation",
        campaignName: `${new URL(campaignData.landingPageUrl).hostname} - Lead Generation`,
        keywords: [
          { text: "business consulting", matchType: "phrase", bid: 2.5 },
          { text: "professional services", matchType: "broad", bid: 1.8 },
          { text: "expert advice", matchType: "exact", bid: 3.2 },
        ],
        headlines: [
          "Expert Business Consulting",
          "Professional Services",
          "Get Results Today",
        ],
        descriptions: [
          "Transform your business with expert guidance",
          "Proven strategies for success",
        ],
      }));
      setIsAnalyzing(false);
    }, 3000);
  };

  const generateKeywords = () => {
    const newKeywords = [
      { text: "business consultant near me", matchType: "phrase", bid: 2.8 },
      { text: "management consulting", matchType: "broad", bid: 2.2 },
      { text: "strategy consulting", matchType: "exact", bid: 3.5 },
      { text: "business advisor", matchType: "phrase", bid: 2.1 },
    ];
    setCampaignData((prev) => ({
      ...prev,
      keywords: [...prev.keywords, ...newKeywords],
    }));
  };

  const addKeyword = () => {
    setCampaignData((prev) => ({
      ...prev,
      keywords: [...prev.keywords, { text: "", matchType: "phrase", bid: 2.0 }],
    }));
  };

  const removeKeyword = (index: number) => {
    setCampaignData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  const addHeadline = () => {
    if (campaignData.headlines.length < 15) {
      setCampaignData((prev) => ({
        ...prev,
        headlines: [...prev.headlines, ""],
      }));
    }
  };

  const addDescription = () => {
    if (campaignData.descriptions.length < 4) {
      setCampaignData((prev) => ({
        ...prev,
        descriptions: [...prev.descriptions, ""],
      }));
    }
  };

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

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Landing Page URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  placeholder="https://example.com/landing-page"
                  value={campaignData.landingPageUrl}
                  onChange={(e) =>
                    setCampaignData((prev) => ({
                      ...prev,
                      landingPageUrl: e.target.value,
                    }))
                  }
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={analyzeLandingPage}
                  disabled={!campaignData.landingPageUrl || isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </div>
                  ) : (
                    "Analyze"
                  )}
                </button>
              </div>
            </div>

            {analysisResults && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    Analysis Complete
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Detected Business Type</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      {analysisResults.businessType.replace("_", " ")}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Quality Score</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: `${(analysisResults.qualityScore / 10) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-medium">
                        {analysisResults.qualityScore}/10
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Suggested Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.keywords.map(
                      (keyword: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                        >
                          {keyword}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">
                    Optimization Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {analysisResults.recommendations.map(
                      (rec: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-sm"
                        >
                          <svg
                            className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          <span>{rec}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                placeholder="Enter campaign name"
                value={campaignData.campaignName}
                onChange={(e) =>
                  setCampaignData((prev) => ({
                    ...prev,
                    campaignName: e.target.value,
                  }))
                }
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaignTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      campaignData.campaignType === type.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setCampaignData((prev) => ({
                        ...prev,
                        campaignType: type.value,
                      }))
                    }
                  >
                    <h3 className="font-semibold">{type.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {type.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      campaignData.businessType === type.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      setCampaignData((prev) => ({
                        ...prev,
                        businessType: type.value,
                      }))
                    }
                  >
                    <h3 className="font-semibold">{type.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {type.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Locations
              </label>
              <select
                value={campaignData.locations[0]}
                onChange={(e) =>
                  setCampaignData((prev) => ({
                    ...prev,
                    locations: [e.target.value],
                  }))
                }
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age Range
                </label>
                <select
                  value={campaignData.ageRange}
                  onChange={(e) =>
                    setCampaignData((prev) => ({
                      ...prev,
                      ageRange: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55-64">55-64</option>
                  <option value="65+">65+</option>
                  <option value="18-65">All Ages (18-65)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  value={campaignData.gender}
                  onChange={(e) =>
                    setCampaignData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Audience Insights
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Based on your business type and targeting, this audience size is
                estimated at <strong>2.3M - 4.1M people</strong>. Consider
                adding interests or custom audiences for more precise targeting.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="100"
                    value={campaignData.dailyBudget}
                    onChange={(e) =>
                      setCampaignData((prev) => ({
                        ...prev,
                        dailyBudget: Number(e.target.value),
                      }))
                    }
                    className="block w-full pl-8 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bidding Strategy
                </label>
                <select
                  value={campaignData.biddingStrategy}
                  onChange={(e) =>
                    setCampaignData((prev) => ({
                      ...prev,
                      biddingStrategy: e.target.value,
                    }))
                  }
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="target_cpa">Target CPA</option>
                  <option value="target_roas">Target ROAS</option>
                  <option value="maximize_conversions">
                    Maximize Conversions
                  </option>
                  <option value="manual_cpc">Manual CPC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target CPA
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="50"
                    value={campaignData.targetCpa}
                    onChange={(e) =>
                      setCampaignData((prev) => ({
                        ...prev,
                        targetCpa: Number(e.target.value),
                      }))
                    }
                    className="block w-full pl-8 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Budget Recommendations
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>
                  • Monthly budget: $
                  {(campaignData.dailyBudget * 30.4).toFixed(0)} ($
                  {campaignData.dailyBudget}/day)
                </li>
                <li>
                  • Expected clicks:{" "}
                  {Math.round(campaignData.dailyBudget / 2.5)} per day
                </li>
                <li>
                  • Estimated conversions:{" "}
                  {Math.round((campaignData.dailyBudget / 2.5) * 0.03)} per day
                </li>
              </ul>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Keywords</h3>
              <button
                onClick={generateKeywords}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Generate More Keywords
              </button>
            </div>

            <div className="space-y-3">
              {campaignData.keywords.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                >
                  <input
                    type="text"
                    placeholder="Enter keyword"
                    value={keyword.text}
                    onChange={(e) => {
                      const newKeywords = [...campaignData.keywords];
                      newKeywords[index].text = e.target.value;
                      setCampaignData((prev) => ({
                        ...prev,
                        keywords: newKeywords,
                      }));
                    }}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <select
                    value={keyword.matchType}
                    onChange={(e) => {
                      const newKeywords = [...campaignData.keywords];
                      newKeywords[index].matchType = e.target.value;
                      setCampaignData((prev) => ({
                        ...prev,
                        keywords: newKeywords,
                      }));
                    }}
                    className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="exact">Exact</option>
                    <option value="phrase">Phrase</option>
                    <option value="broad">Broad</option>
                  </select>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.10"
                      value={keyword.bid}
                      onChange={(e) => {
                        const newKeywords = [...campaignData.keywords];
                        newKeywords[index].bid = Number(e.target.value);
                        setCampaignData((prev) => ({
                          ...prev,
                          keywords: newKeywords,
                        }));
                      }}
                      className="w-20 pl-6 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => removeKeyword(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                onClick={addKeyword}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Keyword
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  Headlines (3-15 required)
                </h3>
                <button
                  onClick={addHeadline}
                  disabled={campaignData.headlines.length >= 15}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Add Headline
                </button>
              </div>

              <div className="space-y-2">
                {campaignData.headlines.map((headline, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={`Headline ${index + 1}`}
                      value={headline}
                      onChange={(e) => {
                        const newHeadlines = [...campaignData.headlines];
                        newHeadlines[index] = e.target.value;
                        setCampaignData((prev) => ({
                          ...prev,
                          headlines: newHeadlines,
                        }));
                      }}
                      maxLength={30}
                      className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <span className="text-xs text-gray-500 min-w-fit">
                      {headline.length}/30
                    </span>
                    <button
                      onClick={() => {
                        const newHeadlines = campaignData.headlines.filter(
                          (_, i) => i !== index,
                        );
                        setCampaignData((prev) => ({
                          ...prev,
                          headlines: newHeadlines,
                        }));
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  Descriptions (2-4 required)
                </h3>
                <button
                  onClick={addDescription}
                  disabled={campaignData.descriptions.length >= 4}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Add Description
                </button>
              </div>

              <div className="space-y-2">
                {campaignData.descriptions.map((description, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <textarea
                      placeholder={`Description ${index + 1}`}
                      value={description}
                      onChange={(e) => {
                        const newDescriptions = [...campaignData.descriptions];
                        newDescriptions[index] = e.target.value;
                        setCampaignData((prev) => ({
                          ...prev,
                          descriptions: newDescriptions,
                        }));
                      }}
                      maxLength={90}
                      rows={2}
                      className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <div className="flex flex-col items-center mt-2">
                      <span className="text-xs text-gray-500 min-w-fit">
                        {description.length}/90
                      </span>
                      <button
                        onClick={() => {
                          const newDescriptions =
                            campaignData.descriptions.filter(
                              (_, i) => i !== index,
                            );
                          setCampaignData((prev) => ({
                            ...prev,
                            descriptions: newDescriptions,
                          }));
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Preview */}
            {campaignData.headlines.length > 0 &&
              campaignData.descriptions.length > 0 && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Ad Preview
                  </h4>
                  <div className="border rounded p-3 bg-gray-50 dark:bg-gray-900">
                    <div className="text-xs text-green-600 mb-1">Ad</div>
                    <div className="text-blue-600 hover:underline cursor-pointer mb-1 text-sm">
                      {campaignData.landingPageUrl}
                    </div>
                    <div className="text-lg text-blue-600 hover:underline cursor-pointer">
                      {campaignData.headlines
                        .filter((h) => h)
                        .slice(0, 3)
                        .join(" • ")}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {campaignData.descriptions.filter((d) => d)[0]}
                    </div>
                  </div>
                </div>
              )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Campaign Summary</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Campaign Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>{" "}
                      {campaignData.campaignName}
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>{" "}
                      {campaignData.campaignType}
                    </div>
                    <div>
                      <span className="text-gray-500">Business Type:</span>{" "}
                      {campaignData.businessType}
                    </div>
                    <div>
                      <span className="text-gray-500">Landing Page:</span>{" "}
                      {campaignData.landingPageUrl}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Budget & Targeting
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Daily Budget:</span> $
                      {campaignData.dailyBudget}
                    </div>
                    <div>
                      <span className="text-gray-500">Target CPA:</span> $
                      {campaignData.targetCpa}
                    </div>
                    <div>
                      <span className="text-gray-500">Locations:</span>{" "}
                      {campaignData.locations.join(", ")}
                    </div>
                    <div>
                      <span className="text-gray-500">Age Range:</span>{" "}
                      {campaignData.ageRange}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Keywords
                  </h4>
                  <div className="text-sm">
                    <span className="text-gray-500">
                      {campaignData.keywords.length} keywords configured
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Ad Copy
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Headlines:</span>{" "}
                      {campaignData.headlines.filter((h) => h).length}
                    </div>
                    <div>
                      <span className="text-gray-500">Descriptions:</span>{" "}
                      {campaignData.descriptions.filter((d) => d).length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">
                Ready to Launch!
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Landing page analyzed and optimized</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Keywords researched and configured</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Ad copy created and previewed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Budget and targeting configured</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer">
                  Google Ads Manager
                </h1>
              </Link>
              <div className="ml-10 flex space-x-8">
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/campaigns"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  Campaigns
                </Link>
                <Link
                  href="/api-setup"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  API Setup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Campaign
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Step-by-step campaign creation with intelligent analysis
              </p>
            </div>
            <Link
              href="/campaigns"
              className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Campaigns
            </Link>
          </div>

          {/* Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Step {currentStep} of {steps.length}:{" "}
                {steps[currentStep - 1]?.name}
              </h2>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% Complete
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {steps[currentStep - 1]?.description}
            </p>
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border p-6 mb-6">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Previous
            </button>

            {currentStep === steps.length ? (
              <button className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Launch Campaign
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
              >
                Next
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
