import { GoogleAdsApi } from "google-ads-api";
import { type NextRequest, NextResponse } from "next/server";

interface GoogleAdsRow {
  campaign?: {
    id?: {
      toString(): string;
    };
    name?: string;
    status?: string;
    advertising_channel_type?: string;
    campaign_budget?: string;
  };
  metrics?: {
    impressions?: string;
    clicks?: string;
    cost_micros?: string;
    conversions?: string;
    ctr?: string;
    average_cpc?: string;
  };
}

interface CampaignData {
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

export async function POST(request: NextRequest) {
  try {
    const { credentials, customerId } = await request.json();

    if (!credentials || !customerId) {
      return NextResponse.json(
        { error: "Missing credentials or customer ID" },
        { status: 400 },
      );
    }

    const client = new GoogleAdsApi({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      developer_token: credentials.developerToken,
    });

    const customer = client.Customer({
      customer_id: customerId,
      refresh_token: credentials.refreshToken,
    });

    const campaigns = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign.campaign_budget,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc
      FROM campaign
      WHERE campaign.status != 'REMOVED'
      AND segments.date DURING LAST_30_DAYS
      ORDER BY campaign.name
    `);

    const formattedCampaigns: CampaignData[] = campaigns.map((row) => {
      const campaign = row as GoogleAdsRow;
      return {
        id: campaign.campaign?.id?.toString() || "",
        name: campaign.campaign?.name || "",
        status: campaign.campaign?.status?.toLowerCase() || "",
        type: campaign.campaign?.advertising_channel_type || "",
        budget: campaign.campaign?.campaign_budget,
        impressions: Number.parseInt(campaign.metrics?.impressions || "0"),
        clicks: Number.parseInt(campaign.metrics?.clicks || "0"),
        cost: Number.parseFloat(campaign.metrics?.cost_micros || "0") / 1000000,
        conversions: Number.parseFloat(campaign.metrics?.conversions || "0"),
        ctr: Number.parseFloat(campaign.metrics?.ctr || "0") * 100,
        cpc: Number.parseFloat(campaign.metrics?.average_cpc || "0") / 1000000,
      };
    });

    return NextResponse.json(formattedCampaigns);
  } catch (error: unknown) {
    console.error("Failed to fetch campaigns:", error);

    let errorMessage = "Failed to fetch campaigns";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
