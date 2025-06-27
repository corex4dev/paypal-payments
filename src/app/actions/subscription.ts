"use server";

import { paypalApiRoot } from "@/lib/constants";
import { authenticatePayPal } from "./auth";
import { revalidateTag } from "next/cache";

export const getSubscription = async (subscriptionId: string) => {
  const accessToken = await authenticatePayPal();

  const subs = await fetch(
    `${paypalApiRoot}/billing/subscriptions/${subscriptionId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: [subscriptionId],
      },
    }
  );

  return { data: await subs.json(), error: !subs.ok };
};

export const suspendSubscription = async (subscriptionId: string) => {
  const accessToken = await authenticatePayPal();

  const subs = await fetch(
    `${paypalApiRoot}/billing/subscriptions/${subscriptionId}/suspend`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: "Solicitud del cliente",
      }),
    }
  );

  revalidateTag(subscriptionId);
  return { data: null, error: !subs.ok };
};

export const resumeSubscription = async (subscriptionId: string) => {
  const accessToken = await authenticatePayPal();

  const subs = await fetch(
    `${paypalApiRoot}/billing/subscriptions/${subscriptionId}/activate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: "Solicitud del cliente",  // opcional
      }),
    }
  );

  revalidateTag(subscriptionId);
  return { data: null, error: !subs.ok };
};

export const cancelSubscription = async (subscriptionId: string) => {
  const accessToken = await authenticatePayPal();

  const subs = await fetch(
    `${paypalApiRoot}/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: "Solicitud del cliente",
      }),
    }
  );

  revalidateTag(subscriptionId);
  return { data: null, error: !subs.ok };
};

export const modifyPlan = async (subscriptionId: string, plan_id: string) => {
  const accessToken = await authenticatePayPal();

  const subs = await fetch(
    `${paypalApiRoot}/billing/subscriptions/${subscriptionId}/revise`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id,
      }),
    }
  );

  revalidateTag(subscriptionId);
  return { data: await subs.json(), error: !subs.ok };
};
