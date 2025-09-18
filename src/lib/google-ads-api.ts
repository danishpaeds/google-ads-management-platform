// Client-side Google Ads service - uses API routes instead of direct API access

export interface GoogleAdsCredentials {
  customerId: string;
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface ClientAccount {
  id: string;
  name: string;
  descriptiveName: string;
  currencyCode: string;
  timeZone: string;
  type: string;
  status: string;
  level: number;
  manager: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  accounts?: ClientAccount[];
  managerInfo?: {
    id: string;
    name: string;
    totalClients: number;
  };
}

export interface CampaignData {
  id: string;
  name: string;
  status: string;
  type: string;
  budget?: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  cpc: number;
}

class GoogleAdsService {
  private credentials: GoogleAdsCredentials | null = null;

  constructor() {
    // Initialize with stored credentials if available
    this.loadStoredCredentials();
  }

  private loadStoredCredentials() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("google-ads-credentials");
      if (stored) {
        try {
          this.credentials = JSON.parse(stored);
        } catch (error) {
          console.error("Failed to load stored credentials:", error);
        }
      }
    }
  }

  async validateCredentials(
    credentials: GoogleAdsCredentials,
  ): Promise<ValidationResult> {
    try {
      const response = await fetch("/api/google-ads/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const result: ValidationResult = await response.json();

      if (result.isValid) {
        // Store valid credentials
        this.credentials = credentials;
        this.storeCredentials();
      }

      return result;
    } catch (error: unknown) {
      console.error("Credential validation error:", error);

      let errorMessage =
        "Failed to validate credentials. Please check your connection.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        isValid: false,
        error: errorMessage,
      };
    }
  }

  private storeCredentials() {
    if (typeof window !== "undefined" && this.credentials) {
      // Encrypt credentials in production
      localStorage.setItem(
        "google-ads-credentials",
        JSON.stringify(this.credentials),
      );
    }
  }

  async getCampaigns(customerId?: string): Promise<CampaignData[]> {
    if (!this.credentials) {
      throw new Error("Not authenticated. Please validate credentials first.");
    }

    try {
      const response = await fetch("/api/google-ads/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credentials: this.credentials,
          customerId: customerId || this.credentials.customerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }

      const campaigns = await response.json();
      return campaigns;
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      throw error;
    }
  }

  getStoredCredentials(): GoogleAdsCredentials | null {
    return this.credentials;
  }

  isAuthenticated(): boolean {
    return this.credentials !== null;
  }

  setCredentials(credentials: GoogleAdsCredentials) {
    this.credentials = credentials;
  }

  clearCredentials() {
    this.credentials = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("google-ads-credentials");
    }
  }

  async generateOAuthUrl(): Promise<string> {
    if (!this.credentials?.clientId) {
      throw new Error("Client ID is required to generate OAuth URL");
    }

    try {
      const response = await fetch("/api/google-ads/oauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: this.credentials.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate OAuth URL");
      }

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error("Failed to generate OAuth URL:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const googleAdsService = new GoogleAdsService();
export default googleAdsService;
