"use client";

import { useGoogleAds } from "@/contexts/GoogleAdsContext";
import googleAdsService, {
  CampaignData,
  type ClientAccount,
} from "@/lib/google-ads-api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface CampaignSummary {
  id: string;
  name: string;
  status: string;
  spend: string;
  conversions: string;
  ctr: string;
  roas: string;
}

export default function Home() {
  const { isConnected, isLoading, selectedAccount, accounts } = useGoogleAds();
  const [recentCampaigns, setRecentCampaigns] = useState<CampaignSummary[]>([]);
  const [performanceData, setPerformanceData] = useState({
    totalSpend: "$12,340",
    activeCampaigns: "23",
    conversions: "342",
    avgRoas: "4.2x",
  });
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  const fetchRecentCampaigns = useCallback(async () => {
    if (!selectedAccount) return;

    setLoadingCampaigns(true);
    try {
      const campaignData = await googleAdsService.getCampaigns(selectedAccount);

      // Format campaigns for dashboard display
      const formatted: CampaignSummary[] = campaignData
        .slice(0, 3)
        .map((campaign) => ({
          id: campaign.id,
          name: campaign.name,
          status:
            campaign.status === "ENABLED"
              ? "Active"
              : campaign.status === "PAUSED"
                ? "Paused"
                : campaign.status,
          spend: `$${(campaign.cost || 0).toFixed(0)}`,
          conversions: campaign.conversions?.toString() || "0",
          ctr: `${(campaign.ctr || 0).toFixed(1)}%`,
          roas:
            campaign.conversions > 0
              ? `${((campaign.conversions * 50) / campaign.cost).toFixed(1)}x`
              : "-",
        }));

      setRecentCampaigns(formatted);

      // Update performance data with real numbers
      const totalSpend = campaignData.reduce(
        (sum, c) => sum + (c.cost || 0),
        0,
      );
      const totalConversions = campaignData.reduce(
        (sum, c) => sum + (c.conversions || 0),
        0,
      );
      const activeCampaigns = campaignData.filter(
        (c) => c.status === "ENABLED",
      ).length;
      const avgRoas =
        campaignData.length > 0
          ? campaignData.reduce(
              (sum, c) =>
                sum + (c.conversions > 0 ? (c.conversions * 50) / c.cost : 0),
              0,
            ) / campaignData.length
          : 0;

      setPerformanceData({
        totalSpend: `$${totalSpend.toFixed(0)}`,
        activeCampaigns: activeCampaigns.toString(),
        conversions: totalConversions.toString(),
        avgRoas: `${avgRoas.toFixed(1)}x`,
      });
    } catch (error) {
      console.error("Failed to fetch campaigns for dashboard:", error);
    } finally {
      setLoadingCampaigns(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (isConnected && selectedAccount) {
      fetchRecentCampaigns();
    } else {
      // Use mock data when not connected
      setRecentCampaigns([
        {
          id: "1",
          name: "Professional Consulting - Lead Gen",
          status: "Active",
          spend: "$1,234",
          conversions: "23",
          ctr: "3.2%",
          roas: "4.8x",
        },
        {
          id: "2",
          name: "E-commerce Summer Sale",
          status: "Paused",
          spend: "$2,876",
          conversions: "45",
          ctr: "2.8%",
          roas: "3.9x",
        },
        {
          id: "3",
          name: "SaaS Free Trial Campaign",
          status: "Active",
          spend: "$987",
          conversions: "12",
          ctr: "4.1%",
          roas: "5.2x",
        },
      ]);
    }
  }, [isConnected, selectedAccount, fetchRecentCampaigns]);

  const getConnectionStatus = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Checking...
          </span>
        </div>
      );
    }

    if (isConnected) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Connected{" "}
            {accounts.length > 0 &&
              `(${accounts.length} account${accounts.length !== 1 ? "s" : ""})`}
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Not Connected
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer">
                    Google Ads Manager
                  </h1>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {getConnectionStatus()}
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Monitor and manage your Google Ads campaigns
              {isConnected && selectedAccount && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  • Connected to{" "}
                  {
                    accounts.find(
                      (a: ClientAccount) => a.id === selectedAccount,
                    )?.name
                  }
                </span>
              )}
            </p>
          </div>

          {/* Connection Banner */}
          {!isConnected && !isLoading && (
            <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-blue-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200">
                      Connect Your Google Ads Account
                    </h3>
                    <p className="text-blue-800 dark:text-blue-300">
                      Connect your Google Ads account to view real campaign data
                      and manage your advertising.
                    </p>
                  </div>
                </div>
                <Link
                  href="/api-setup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium whitespace-nowrap"
                >
                  Connect Account
                </Link>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Spend
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {performanceData.totalSpend}
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">+54.02%</span>
                <span className="text-gray-500 ml-2">vs last period</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Campaigns
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {performanceData.activeCampaigns}
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
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
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">+4</span>
                <span className="text-gray-500 ml-2">this month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Conversions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {performanceData.conversions}
                  </p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
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
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-red-600">-1.39%</span>
                <span className="text-gray-500 ml-2">vs last period</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg. ROAS
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {performanceData.avgRoas}
                  </p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-orange-600 dark:text-orange-400"
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
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">+10.18%</span>
                <span className="text-gray-500 ml-2">vs last period</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/campaigns/create"
                className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="bg-blue-500 p-3 rounded-full mb-3">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Create New Campaign
                </h3>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  Launch a new campaign with automated setup
                </p>
              </Link>

              <Link
                href="/analytics"
                className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="bg-green-500 p-3 rounded-full mb-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Analyze Performance
                </h3>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  Deep dive into campaign performance metrics
                </p>
              </Link>

              <Link
                href="/campaigns"
                className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="bg-purple-500 p-3 rounded-full mb-3">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Manage Campaigns
                </h3>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  Review and optimize campaign performance
                </p>
              </Link>

              <Link
                href="/assets"
                className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="bg-orange-500 p-3 rounded-full mb-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Create Ad Assets
                </h3>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  Generate new ad creatives and assets
                </p>
              </Link>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Campaigns
                {isConnected && !loadingCampaigns && (
                  <span className="ml-2 text-sm font-normal text-green-600 dark:text-green-400">
                    • Live Data
                  </span>
                )}
              </h2>
              <Link
                href="/campaigns"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {loadingCampaigns ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
                <span className="text-gray-600 dark:text-gray-400">
                  Loading campaigns...
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCampaigns.map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${campaign.status === "Active" ? "bg-green-500" : "bg-yellow-500"}`}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {campaign.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Updated 2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {campaign.spend}
                        </p>
                        <p className="text-gray-500">Spend</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {campaign.conversions}
                        </p>
                        <p className="text-gray-500">Conversions</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {campaign.ctr}
                        </p>
                        <p className="text-gray-500">CTR</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {campaign.roas}
                        </p>
                        <p className="text-gray-500">ROAS</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features Overview */}
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Campaign Analysis
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Real-time campaign performance with Google Ads API
                    integration.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
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
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Campaign Creation
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Step-by-step campaign creation wizard with landing page
                    analysis and automated optimization.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400"
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
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Account Management
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage multiple Google Ads accounts with secure credential
                    storage.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-orange-600 dark:text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Asset Management
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload, organize, and generate creative assets with
                    AI-powered tools and templates.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400"
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
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Analytics Dashboard
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Comprehensive performance analytics with AI insights and
                    optimization recommendations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Google Ads API
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Full integration with Google Ads API for real-time campaign
                    management and data sync.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
