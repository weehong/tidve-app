import { NextResponse } from "next/server";

import { auth0 } from "@/libs/auth/auth0";

export async function PATCH(request: Request) {
  try {
    const [token, session] = await Promise.all([
      getAccessToken(),
      auth0.getSession(),
    ]);

    if (!token || !session?.user?.sub) {
      return NextResponse.json(
        { error: "No token or session found" },
        { status: 401 },
      );
    }

    const { baseCurrency } = await request.json();
    const response = await fetch(
      `${process.env.AUTH0_MANAGEMENT_DOMAIN}/users/${session.user.sub}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_metadata: { base_currency: baseCurrency },
        }),
      },
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to update base currency" },
        { status: response.status },
      );
    }
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating base currency:", error);
    return NextResponse.json(
      { error: "Failed to update base currency" },
      { status: 500 },
    );
  }
}

const getAccessToken = async () => {
  try {
    const res = await fetch(`${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
        client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
        audience: `${process.env.AUTH0_MANAGEMENT_DOMAIN}/`,
      }),
    });

    const { access_token } = await res.json();

    return access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};
