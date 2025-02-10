import { NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/libs/auth/auth0";

export async function GET(request: NextRequest) {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //   const { email, name, picture } = user;

  return NextResponse.json({ message: "Hello, world!" });
}

export async function PATCH(request: NextRequest) {
  try {
    // const session = await auth0.getSession();
    const token = await auth0.getAccessToken();

    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const { user } = session;
    const tokenResponse = await fetch(
      `${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
          client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
          audience: process.env.AUTH0_MANAGEMENT_DOMAIN + "/",
          grant_type: "client_credentials",
        }),
      },
    );

    const { access_token } = await tokenResponse.json();

    const response = await fetch(
      `${process.env.AUTH0_MANAGEMENT_DOMAIN}/users/google-oauth2|107034685493956754943`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          app_metadata: {
            base_currency: "SDASDA",
          },
        }),
      },
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
