import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Checkout API called");

    const bodyText = await req.text();
    console.log("Raw request body:", bodyText);

    let jsonBody;
    try {
      jsonBody = JSON.parse(bodyText);
      console.log("Parsed JSON body:", jsonBody);
    } catch (parseErr) {
      console.error("Failed to parse JSON body:", parseErr);
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { variantId, customData } = jsonBody;

    if (!variantId) {
      console.error("variantId missing in request body");
      return NextResponse.json(
        { error: "Missing variantId" },
        { status: 400 }
      );
    }

    const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
    const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;

    if (!LEMON_SQUEEZY_API_KEY || !LEMON_SQUEEZY_STORE_ID) {
      console.error("Missing LEMON_SQUEEZY_API_KEY or LEMON_SQUEEZY_STORE_ID env variables");
      return NextResponse.json(
        { error: "Server misconfiguration: Missing env variables" },
        { status: 500 }
      );
    }

    console.log("Sending request to Lemon Squeezy API");
    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LEMON_SQUEEZY_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: customData || {},
          },
          relationships: {
            store: {
              data: { type: "stores", id: LEMON_SQUEEZY_STORE_ID },
            },
            variant: {
              data: { type: "variants", id: variantId },
            },
          },
        },
      }),
    });

    const data = await res.json();
    console.log("Response from Lemon Squeezy:", data);

    if (!res.ok) {
      console.error("Lemon Squeezy API responded with error:", data);
      return NextResponse.json(
        { error: data?.errors || "Failed to create checkout" },
        { status: res.status }
      );
    }

    console.log("Checkout created successfully");

    return NextResponse.json(
      { checkoutUrl: data.data.attributes.url },
      { status: 200 }
    );
    
  } catch (err) {
    console.error("Checkout API unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
