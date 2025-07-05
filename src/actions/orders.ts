"use server";

import { paypalApiRoot, paypalApiRootV2 } from "@/lib/constants";
import { authenticatePayPal } from "./auth";
import { v4 } from "uuid";

export const createOrderAction = async (cart: any[]) => {
  const accessToken = await authenticatePayPal();

  const subs = await fetch(`${paypalApiRootV2}/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": v4(),
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            value: cart.reduce((acc, item) => acc + item.price, 0),
            currency_code: "CAD",
            breakdown: {
              item_total: {
                value: cart.reduce((acc, item) => acc + item.price, 0),
                currency_code: "CAD",
              },
            },
          },
          items: cart.map((c) => ({
            name: c.name,
            quantity: 1,
            unit_amount: {
              value: c.price,
              currency_code: "CAD",
            },
          })),
        },
      ],
    }),
  });

  return { data: await subs.json(), error: !subs.ok };
};

export const captureOrderAction = async (orderId: string) => {
  const accessToken = await authenticatePayPal();

  const subs = await fetch(
    `${paypalApiRootV2}/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": v4(),
      },
      body: JSON.stringify({}),
    }
  );

  return { data: await subs.json(), error: !subs.ok };
};
