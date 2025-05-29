import { NextRequest, NextResponse } from "next/server";

const paypalApiRoot = "https://api-m.sandbox.paypal.com/v1";

export const POST = async (req: NextRequest) => {
  const headers = req.headers;
  const body = await req.json();

  const isValid = await verifySignature(headers, body);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const data = body.resource;

  console.log(data);
  // Do something

  return NextResponse.json({ message: "Success" }, { status: 200 });
};

const verifySignature = async (
  headers: Headers,
  webhook_event: any
): Promise<boolean> => {
  const auth_algo = headers.get("paypal-auth-algo");
  const cert_url = headers.get("paypal-cert-url");
  const transmission_id = headers.get("paypal-transmission-id");
  const transmission_sig = headers.get("paypal-transmission-sig");
  const transmission_time = headers.get("paypal-transmission-time");
  const webhook_id = process.env.PAYPAL_WEBHOOKS_ID;

  const isValidResponse = await fetch(
    `${paypalApiRoot}/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await authenticatePayPal()}`,
      },
      body: JSON.stringify({
        auth_algo,
        cert_url,
        transmission_id,
        transmission_sig,
        transmission_time,
        webhook_id,
        webhook_event,
      }),
    }
  );

  if (!isValidResponse.ok) {
    return false;
  } else {
    const isValid = await isValidResponse.json();

    console.log(isValid);

    return isValid.verification_status === "SUCCESS";
  }
};

const authenticatePayPal = async (): Promise<string> => {
  const response = await fetch(`${paypalApiRoot}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: `client_credentials`,
    }),
  });

  const data = await response.json();

  return data.access_token;
};
