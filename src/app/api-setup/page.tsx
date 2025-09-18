"use client";

import googleAdsService, {
  type GoogleAdsCredentials,
  ClientAccount,
  type ValidationResult,
} from "@/lib/google-ads-api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ApiSetupPage() {
  const [setupStep, setSetupStep] = useState(1);
  const [credentials, setCredentials] = useState<GoogleAdsCredentials>({
    customerId: "",
    developerToken: "",
    clientId: "",
    clientSecret: "",
    refreshToken: "",
  });

  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [oauthUrl, setOauthUrl] = useState<string>("");

  useEffect(() => {
    // Load stored credentials on mount
    const stored = googleAdsService.getStoredCredentials();
    if (stored) {
      setCredentials(stored);
      if (googleAdsService.isAuthenticated()) {
        setTestStatus("success");
        // Re-validate to get account info
        validateStoredCredentials();
      }
    }
  }, []);

  const validateStoredCredentials = async () => {
    const stored = googleAdsService.getStoredCredentials();
    if (stored) {
      try {
        const result = await googleAdsService.validateCredentials(stored);
        setValidationResult(result);
        if (result.isValid && result.accounts && result.accounts.length > 0) {
          setSelectedAccount(result.accounts[0].id);
        }
      } catch (error) {
        console.error("Failed to validate stored credentials:", error);
      }
    }
  };

  const setupSteps = [
    {
      id: 1,
      title: "Create Google Cloud Project",
      description:
        "Set up your Google Cloud project and enable the Google Ads API",
      completed: !!credentials.clientId,
    },
    {
      id: 2,
      title: "Configure OAuth Consent",
      description: "Set up OAuth consent screen and create credentials",
      completed: !!credentials.clientId && !!credentials.clientSecret,
    },
    {
      id: 3,
      title: "Get Developer Token",
      description: "Apply for and receive your Google Ads API developer token",
      completed: !!credentials.developerToken,
    },
    {
      id: 4,
      title: "Test Connection",
      description: "Verify your API connection is working correctly",
      completed: testStatus === "success",
    },
  ];

  const handleCredentialChange = (
    field: keyof GoogleAdsCredentials,
    value: string,
  ) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateOAuthUrl = async () => {
    if (!credentials.clientId) {
      alert("Please enter your Client ID first");
      return;
    }

    try {
      const tempCredentials = { ...credentials };
      googleAdsService.setCredentials(tempCredentials);
      const url = await googleAdsService.generateOAuthUrl();
      setOauthUrl(url);
    } catch (error) {
      console.error("Failed to generate OAuth URL:", error);
    }
  };

  const testConnection = async () => {
    if (
      !credentials.customerId ||
      !credentials.developerToken ||
      !credentials.clientId ||
      !credentials.clientSecret
    ) {
      setTestStatus("error");
      setValidationResult({
        isValid: false,
        error: "Please fill in all required fields",
      });
      return;
    }

    setTestStatus("testing");
    setValidationResult(null);

    try {
      const result = await googleAdsService.validateCredentials(credentials);
      setValidationResult(result);

      if (result.isValid) {
        setTestStatus("success");
        if (result.accounts && result.accounts.length > 0) {
          setSelectedAccount(result.accounts[0].id);
        }
      } else {
        setTestStatus("error");
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      setTestStatus("error");
      setValidationResult({
        isValid: false,
        error:
          "Connection failed. Please check your credentials and try again.",
      });
    }
  };

  const clearCredentials = () => {
    googleAdsService.clearCredentials();
    setCredentials({
      customerId: "",
      developerToken: "",
      clientId: "",
      clientSecret: "",
      refreshToken: "",
    });
    setTestStatus("idle");
    setValidationResult(null);
    setSelectedAccount("");
  };

  const getStatusIcon = (step: number) => {
    const stepData = setupSteps.find((s) => s.id === step);
    if (stepData?.completed) {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full">
          <svg
            className="w-4 h-4 text-white"
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
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-8 h-8 border-2 border-gray-300 rounded-full">
        <span className="text-gray-500 text-sm font-medium">{step}</span>
      </div>
    );
  };

  const getConnectionStatus = () => {
    if (testStatus === "success" && validationResult?.isValid) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Connected
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
                  className="border-b-2 border-blue-500 text-gray-900 dark:text-white px-3 py-2 text-sm font-medium"
                >
                  API Setup
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {getConnectionStatus()}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Google Ads API Setup
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Connect your Google Ads manager account to enable campaign
              management and analytics
            </p>
          </div>

          {/* Connection Success - Show Client Accounts */}
          {testStatus === "success" && validationResult?.isValid && (
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow border">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
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
                    Connection Successful
                  </h2>
                  <button
                    onClick={clearCredentials}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              <div className="p-6">
                {validationResult.managerInfo && (
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                      Manager Account
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      {validationResult.managerInfo.name} - Managing{" "}
                      {validationResult.managerInfo.totalClients} client
                      account(s)
                    </p>
                  </div>
                )}

                {validationResult.accounts &&
                  validationResult.accounts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        {validationResult.managerInfo
                          ? "Client Accounts"
                          : "Your Account"}
                      </h3>

                      <div className="space-y-3">
                        {validationResult.accounts.map((account) => (
                          <div
                            key={account.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedAccount === account.id
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedAccount(account.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {account.name}
                                </h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                  <span>ID: {account.id}</span>
                                  <span>{account.currencyCode}</span>
                                  <span>{account.timeZone}</span>
                                  {account.manager && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                      Manager
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    account.status === "ENABLED"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {account.status}
                                </span>
                                {selectedAccount === account.id && (
                                  <svg
                                    className="w-5 h-5 text-blue-500"
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
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedAccount && (
                        <div className="mt-6 flex space-x-4">
                          <Link
                            href="/campaigns"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                          >
                            Manage Campaigns
                          </Link>
                          <Link
                            href="/analytics"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                          >
                            View Analytics
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {setupSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center flex-1"
                >
                  {getStatusIcon(step.id)}
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </p>
                  </div>
                  {index < setupSteps.length - 1 && (
                    <div className="hidden sm:block absolute w-24 h-0.5 bg-gray-300 dark:bg-gray-600 mt-4 ml-24" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Setup Instructions */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Setup Instructions
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Step 1 */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      1. Create Google Cloud Project
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        • Go to{" "}
                        <a
                          href="https://console.cloud.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Google Cloud Console
                        </a>
                      </p>
                      <p>• Create a new project or select an existing one</p>
                      <p>• Navigate to "APIs & Services" → "Library"</p>
                      <p>• Search for "Google Ads API" and enable it</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      2. Configure OAuth Consent Screen
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>• Go to "APIs & Services" → "OAuth consent screen"</p>
                      <p>• Choose "External" user type</p>
                      <p>
                        • Fill in app information (name: "Google Ads Manager")
                      </p>
                      <p>• Add your email as a test user</p>
                      <p>
                        • Add scope:{" "}
                        <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                          https://www.googleapis.com/auth/adwords
                        </code>
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      3. Create OAuth Credentials
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>• Go to "APIs & Services" → "Credentials"</p>
                      <p>
                        • Click "Create Credentials" → "OAuth 2.0 Client ID"
                      </p>
                      <p>• Choose "Desktop application"</p>
                      <p>• Save the Client ID and Client Secret</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      4. Get Developer Token
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        • Go to{" "}
                        <a
                          href="https://ads.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Google Ads
                        </a>
                      </p>
                      <p>• Navigate to Tools & Settings → API Center</p>
                      <p>
                        • Apply for developer token (may take 1-2 business days)
                      </p>
                      <p>• Start with test account access for development</p>
                    </div>
                  </div>

                  {/* OAuth Authorization */}
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      5. Generate Authorization Code
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        Click the button below to generate your OAuth
                        authorization URL:
                      </p>
                      <button
                        onClick={generateOAuthUrl}
                        disabled={!credentials.clientId}
                        className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Generate OAuth URL
                      </button>
                      {oauthUrl && (
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                          <p className="text-xs mb-2">
                            Copy this URL and open it in your browser:
                          </p>
                          <a
                            href={oauthUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs break-all"
                          >
                            {oauthUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Credentials Form */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    API Credentials
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Customer ID
                    </label>
                    <input
                      type="text"
                      placeholder="123-456-7890"
                      value={credentials.customerId}
                      onChange={(e) =>
                        handleCredentialChange("customerId", e.target.value)
                      }
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Found in Google Ads account (without dashes)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Developer Token
                    </label>
                    <input
                      type="password"
                      placeholder="Enter developer token"
                      value={credentials.developerToken}
                      onChange={(e) =>
                        handleCredentialChange("developerToken", e.target.value)
                      }
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Client ID
                    </label>
                    <input
                      type="text"
                      placeholder="OAuth 2.0 Client ID"
                      value={credentials.clientId}
                      onChange={(e) =>
                        handleCredentialChange("clientId", e.target.value)
                      }
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Client Secret
                    </label>
                    <input
                      type="password"
                      placeholder="OAuth 2.0 Client Secret"
                      value={credentials.clientSecret}
                      onChange={(e) =>
                        handleCredentialChange("clientSecret", e.target.value)
                      }
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Refresh Token
                    </label>
                    <input
                      type="password"
                      placeholder="OAuth refresh token"
                      value={credentials.refreshToken}
                      onChange={(e) =>
                        handleCredentialChange("refreshToken", e.target.value)
                      }
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Generated through OAuth flow
                    </p>
                  </div>

                  <button
                    onClick={testConnection}
                    disabled={testStatus === "testing"}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    {testStatus === "testing" ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Testing Connection...
                      </div>
                    ) : (
                      "Test Connection"
                    )}
                  </button>

                  {testStatus === "success" && validationResult?.isValid && (
                    <div className="flex items-center space-x-2 text-green-600">
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm">Connection successful!</span>
                    </div>
                  )}

                  {testStatus === "error" &&
                    validationResult &&
                    !validationResult.isValid && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-red-600">
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
                          <span className="text-sm">Connection failed</span>
                        </div>
                        {validationResult.error && (
                          <p className="text-xs text-red-600 mt-1">
                            {validationResult.error}
                          </p>
                        )}
                      </div>
                    )}
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Security Notice
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Your credentials are stored locally and encrypted. Never
                      share your developer token or OAuth credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documentation Links */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://developers.google.com/google-ads/api/docs/first-call/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-blue-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    API Documentation
                  </p>
                  <p className="text-sm text-gray-500">
                    Official Google Ads API guide
                  </p>
                </div>
              </a>

              <a
                href="https://developers.google.com/google-ads/api/docs/oauth/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-green-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    OAuth Setup
                  </p>
                  <p className="text-sm text-gray-500">
                    Authentication configuration
                  </p>
                </div>
              </a>

              <a
                href="https://ads.google.com/home/tools/api-center/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-purple-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    API Center
                  </p>
                  <p className="text-sm text-gray-500">
                    Get your developer token
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
