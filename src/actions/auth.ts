"use server";

import { paypalApiRoot } from "@/lib/constants";

export const authenticatePayPal = async (): Promise<string> => {
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
