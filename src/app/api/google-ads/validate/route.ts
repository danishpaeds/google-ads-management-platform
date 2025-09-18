import { GoogleAdsApi } from "google-ads-api";
import { type NextRequest, NextResponse } from "next/server";

interface GoogleAdsRow {
  customer_client?: {
    id?: {
      value?: string;
      toString(): string;
    };
    descriptive_name?: string;
    currency_code?: string;
    time_zone?: string;
    status?: string;
    level?: number;
    manager?: boolean;
  };
  customer?: {
    id?: {
      value?: string;
      toString(): string;
    };
    descriptive_name?: string;
    currency_code?: string;
    time_zone?: string;
    status?: {
      toString(): string;
    };
    manager?: boolean;
  };
}

export interface GoogleAdsCredentials {
  customerId: string;
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface CustomerClientData {
  id?: {
    value?: string;
    toString(): string;
  };
  descriptive_name?: string;
  currency_code?: string;
  time_zone?: string;
  status?: string;
  level?: number;
  manager?: boolean;
}

interface CustomerData {
  id?: {
    value?: string;
    toString(): string;
  };
  descriptive_name?: string;
  currency_code?: string;
  time_zone?: string;
  status?: {
    toString(): string;
  };
  manager?: boolean;
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

export async function POST(request: NextRequest) {
  try {
    const credentials: GoogleAdsCredentials = await request.json();

    // Validate credentials
    const client = new GoogleAdsApi({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      developer_token: credentials.developerToken,
    });

    const customer = client.Customer({
      customer_id: credentials.customerId,
      refresh_token: credentials.refreshToken,
    });

    // Test connection by fetching customer info
    const customerInfo = await customer.query(`
      SELECT
        customer.id,
        customer.descriptive_name,
        customer.currency_code,
        customer.time_zone,
        customer.status,
        customer.manager
      FROM customer
      WHERE customer.id = ${credentials.customerId}
    `);

    if (customerInfo && customerInfo.length > 0) {
      const customerData = customerInfo[0].customer;

      let accounts: ClientAccount[] = [];
      let managerInfo = undefined;

      if (customerData?.manager) {
        // Fetch client accounts for manager account
        const clientAccounts = await customer.query(`
          SELECT
            customer_client.id,
            customer_client.descriptive_name,
            customer_client.currency_code,
            customer_client.time_zone,
            customer_client.status,
            customer_client.level,
            customer_client.manager
          FROM customer_client
          WHERE customer_client.status != 'CANCELLED'
          ORDER BY customer_client.descriptive_name
        `);

        accounts = clientAccounts.map((row) => {
          const account = row as GoogleAdsRow;
          const clientData = account.customer_client;
          return {
            id: clientData?.id?.toString() || "",
            name:
              clientData?.descriptive_name ||
              `Account ${clientData?.id?.toString() || ""}`,
            descriptiveName:
              clientData?.descriptive_name ||
              `Account ${clientData?.id?.toString() || ""}`,
            currencyCode: clientData?.currency_code || "USD",
            timeZone: clientData?.time_zone || "UTC",
            type: clientData?.manager ? "MANAGER" : "CLIENT",
            status: clientData?.status || "UNKNOWN",
            level: clientData?.level || 0,
            manager: clientData?.manager || false,
          };
        });

        managerInfo = {
          id: customerData.id?.toString() || "",
          name: customerData.descriptive_name || "Manager Account",
          totalClients: accounts.length,
        };
      } else if (customerData) {
        // For non-manager accounts, return the account itself
        accounts = [
          {
            id: customerData.id?.toString() || "",
            name: customerData.descriptive_name || "Google Ads Account",
            descriptiveName:
              customerData.descriptive_name || "Google Ads Account",
            currencyCode: customerData.currency_code || "USD",
            timeZone: customerData.time_zone || "UTC",
            type: "CLIENT",
            status: customerData.status?.toString() || "ENABLED",
            level: 0,
            manager: false,
          },
        ];
      }

      const result: ValidationResult = {
        isValid: true,
        accounts,
        managerInfo,
      };

      return NextResponse.json(result);
    }
    return NextResponse.json({
      isValid: false,
      error: "Customer not found or access denied",
    } as ValidationResult);
  } catch (error: unknown) {
    console.error("Credential validation error:", error);

    let errorMessage = "Invalid credentials";

    if (error instanceof Error) {
      if (error.message?.includes("AUTHENTICATION_ERROR")) {
        errorMessage =
          "Authentication failed. Please check your OAuth credentials.";
      } else if (error.message?.includes("AUTHORIZATION_ERROR")) {
        errorMessage =
          "Authorization failed. Please verify your developer token and permissions.";
      } else if (error.message?.includes("CUSTOMER_NOT_FOUND")) {
        errorMessage =
          "Customer ID not found. Please verify the Customer ID is correct.";
      } else if (error.message?.includes("DEVELOPER_TOKEN_NOT_APPROVED")) {
        errorMessage =
          "Developer token not approved. Please check your Google Ads API access.";
      } else {
        errorMessage = `API Error: ${error.message}`;
      }
    }

    return NextResponse.json(
      {
        isValid: false,
        error: errorMessage,
      } as ValidationResult,
      { status: 400 },
    );
  }
}
