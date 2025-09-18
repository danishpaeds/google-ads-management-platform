"use client";

import googleAdsService, {
  type ClientAccount,
  CampaignData,
} from "@/lib/google-ads-api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Campaign {
  id: string;
  name: string;
  status: string;
  type: string;
  budget?: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cpa: number;
  cpc: number;
  roas?: number;
  qualityScore?: number;
  lastUpdated: string;
  landingPage?: string;
}

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [accounts, setAccounts] = useState<ClientAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const fetchCampaigns = useCallback(async () => {
    if (!selectedAccount) return;

    setLoading(true);
    setError("");

    try {
      const campaignData = await googleAdsService.getCampaigns(selectedAccount);

      const formattedCampaigns: Campaign[] = campaignData.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        type: campaign.type || "SEARCH",
        budget: campaign.budget,
        spend: campaign.cost || 0,
        impressions: campaign.impressions || 0,
        clicks: campaign.clicks || 0,
        ctr: campaign.ctr || 0,
        conversions: campaign.conversions || 0,
        cpa:
          campaign.conversions > 0 ? campaign.cost / campaign.conversions : 0,
        cpc: campaign.cpc || 0,
        roas:
          campaign.conversions > 0
            ? (campaign.conversions * 50) / campaign.cost
            : 0, // Estimated
        qualityScore: Math.random() * 4 + 6, // Placeholder - requires separate query
        lastUpdated: new Date().toLocaleString(),
        landingPage: `https://example.com/${campaign.name.toLowerCase().replace(/\s+/g, "-")}`,
      }));

      setCampaigns(formattedCampaigns);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
      setError("Failed to load campaigns. Please check your connection.");
      // Fallback to mock data for demo
      setCampaigns(getMockCampaigns());
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (selectedAccount) {
      fetchCampaigns();
    }
  }, [selectedAccount, fetchCampaigns]);

  const initializeData = async () => {
    try {
      if (!googleAdsService.isAuthenticated()) {
        setError("Please connect your Google Ads account first");
        setLoading(false);
        return;
      }

      setIsConnected(true);

      // Load stored credentials and validate
      const credentials = googleAdsService.getStoredCredentials();
      if (credentials) {
        const result = await googleAdsService.validateCredentials(credentials);
        if (result.isValid && result.accounts) {
          setAccounts(result.accounts);
          if (result.accounts.length > 0) {
            setSelectedAccount(result.accounts[0].id);
          }
        } else {
          setError("Failed to load account data");
        }
      }
    } catch (err) {
      console.error("Failed to initialize data:", err);
      setError("Failed to load account data");
    } finally {
      setLoading(false);
    }
  };

  const getMockCampaigns = (): Campaign[] => [
    {
      id: "1",
      name: "Professional Consulting - Lead Gen",
      status: "active",
      type: "Search",
      budget: "150",
      spend: 142.5,
      impressions: 12450,
      clicks: 423,
      ctr: 3.4,
      conversions: 23,
      cpa: 6.2,
      cpc: 0.34,
      roas: 4.8,
      qualityScore: 8.2,
      lastUpdated: "2 hours ago",
      landingPage: "https://example.com/consulting",
    },
    {
      id: "2",
      name: "E-commerce Summer Sale",
      status: "paused",
      type: "Shopping",
      budget: "300",
      spend: 287.6,
      impressions: 34200,
      clicks: 1240,
      ctr: 3.6,
      conversions: 45,
      cpa: 6.39,
      cpc: 0.23,
      roas: 3.9,
      qualityScore: 7.8,
      lastUpdated: "1 day ago",
      landingPage: "https://example.com/summer-sale",
    },
    {
      id: "3",
      name: "SaaS Free Trial Campaign",
      status: "active",
      type: "Search",
      budget: "200",
      spend: 198.4,
      impressions: 8900,
      clicks: 365,
      ctr: 4.1,
      conversions: 12,
      cpa: 16.53,
      cpc: 0.54,
      roas: 5.2,
      qualityScore: 9.1,
      lastUpdated: "30 minutes ago",
      landingPage: "https://example.com/free-trial",
    },
  ];

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    const matchesType = typeFilter === "all" || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case "active":
      case "enabled":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "paused":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case "needs_attention":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "enabled":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case "paused":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case "needs_attention":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const totalSpend = filteredCampaigns.reduce(
    (sum, campaign) => sum + campaign.spend,
    0,
  );
  const totalConversions = filteredCampaigns.reduce(
    (sum, campaign) => sum + campaign.conversions,
    0,
  );
  const avgRoas =
    filteredCampaigns.length > 0
      ? filteredCampaigns.reduce(
          (sum, campaign) => sum + (campaign.roas || 0),
          0,
        ) / filteredCampaigns.length
      : 0;

  if (!isConnected) {
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
                    className="border-b-2 border-blue-500 text-gray-900 dark:text-white px-3 py-2 text-sm font-medium"
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

        <div className="max-w-4xl mx-auto py-20 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border p-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Google Ads Account Not Connected
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please connect your Google Ads account to view and manage your
              campaigns.
            </p>
            <Link
              href="/api-setup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium"
            >
              Connect Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                  className="border-b-2 border-blue-500 text-gray-900 dark:text-white px-3 py-2 text-sm font-medium"
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
            <div className="flex items-center space-x-4">
              <Link
                href="/campaigns/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create Campaign
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header with Account Switcher */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Campaign Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Analyze and manage your Google Ads campaigns
              </p>
            </div>

            {/* Account Switcher */}
            {accounts.length > 1 && (
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account:
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.id})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-800 dark:text-red-200">{error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading campaigns...
              </span>
            </div>
          )}

          {/* Summary Stats */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg
                      className="h-4 w-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Campaigns
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredCampaigns.length}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Spend
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${totalSpend.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg
                      className="h-4 w-4 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Conversions
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalConversions}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg
                      className="h-4 w-4 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Avg. ROAS
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {avgRoas.toFixed(1)}x
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="search"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Search Campaigns
                    </label>
                    <div className="relative">
                      <svg
                        className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        id="search"
                        type="text"
                        placeholder="Search by campaign name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="block w-40 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="enabled">Enabled</option>
                      <option value="paused">Paused</option>
                      <option value="needs_attention">Needs Attention</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="block w-40 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="all">All Types</option>
                      <option value="Search">Search</option>
                      <option value="SEARCH">Search</option>
                      <option value="Shopping">Shopping</option>
                      <option value="SHOPPING">Shopping</option>
                      <option value="Display">Display</option>
                      <option value="DISPLAY">Display</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Campaigns List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Campaigns ({filteredCampaigns.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCampaigns.length === 0 ? (
                    <div className="p-8 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No campaigns found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {campaigns.length === 0
                          ? "You don't have any campaigns yet."
                          : "No campaigns match your current filters."}
                      </p>
                      <Link
                        href="/campaigns/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Create Your First Campaign
                      </Link>
                    </div>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
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
                                    selectedCampaigns.filter(
                                      (id) => id !== campaign.id,
                                    ),
                                  );
                                }
                              }}
                            />
                            {getStatusIcon(campaign.status)}
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {campaign.name}
                                </h3>
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded dark:bg-gray-700 dark:text-gray-300">
                                  {campaign.type}
                                </span>
                                <span
                                  className={getStatusBadge(campaign.status)}
                                >
                                  {campaign.status.charAt(0).toUpperCase() +
                                    campaign.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {campaign.landingPage &&
                                  `${campaign.landingPage} • `}
                                Updated {campaign.lastUpdated}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <svg
                                className="h-5 w-5"
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
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {campaign.budget ? `$${campaign.budget}` : "-"}
                            </p>
                            <p className="text-gray-500">Budget</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-900 dark:text-white">
                              ${campaign.spend.toFixed(2)}
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
                            <div className="flex items-center justify-center space-x-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {campaign.ctr.toFixed(2)}%
                              </p>
                              {campaign.ctr >= 3.0 ? (
                                <svg
                                  className="h-3 w-3 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="h-3 w-3 text-red-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                                  />
                                </svg>
                              )}
                            </div>
                            <p className="text-gray-500">CTR</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {campaign.conversions}
                            </p>
                            <p className="text-gray-500">Conversions</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-900 dark:text-white">
                              ${campaign.cpa.toFixed(2)}
                            </p>
                            <p className="text-gray-500">CPA</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {campaign.roas
                                ? `${campaign.roas.toFixed(1)}x`
                                : "-"}
                            </p>
                            <p className="text-gray-500">ROAS</p>
                          </div>
                        </div>

                        {/* Quality Score */}
                        {campaign.qualityScore && (
                          <div className="mt-3 flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              Quality Score:
                            </span>
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
                                {campaign.qualityScore.toFixed(1)}/10
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Bulk Actions */}
                {selectedCampaigns.length > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                        {selectedCampaigns.length} campaign(s) selected
                      </span>
                      <div className="flex space-x-2">
                        <button className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                          Resume
                        </button>
                        <button className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                          Pause
                        </button>
                        <button className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
