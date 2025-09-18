import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 },
      );
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
      scope: "https://www.googleapis.com/auth/adwords",
      response_type: "code",
      access_type: "offline",
      approval_prompt: "force",
    });

    const oauthUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;

    return NextResponse.json({ url: oauthUrl });
  } catch (error: unknown) {
    console.error("Failed to generate OAuth URL:", error);

    let errorMessage = "Failed to generate OAuth URL";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
