"use client";

import React, { useTransition } from "react";
import {
  resumeSubscription,
  suspendSubscription,
  cancelSubscription,
  modifyPlan,
} from "@/actions/subscription";
import Loader from "@/components/Loader/Loader";
import { plans } from "@/lib/constants";

const SubscriptionActions = ({ subscription }: { subscription: any }) => {
  const [loading, startLoading] = useTransition();

  const suspendActive = async () => {
    console.log(subscription.status);

    if (subscription.status === "ACTIVE") {
      await suspendSubscription(subscription.id);
    } else {
      await resumeSubscription(subscription.id);
    }
  };

  const modify = async () => {
    const newPlan = plans.find((plan) => plan.plan_id !== subscription.plan_id);
    const result = await modifyPlan(subscription.id, newPlan!.plan_id);

    if (!result.error) {
      const link = result.data.links?.find(
        (link: any) => link.rel === "approve"
      );
      if (link) {
        window.open(link.href, "_blank", "popup");
      }
    }
  };

  const cancel = async () => {
    await cancelSubscription(subscription.id);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {loading && <Loader />}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => startLoading(suspendActive)}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:gray-500"
        >
          {subscription.status === "ACTIVE" ? "Suspender" : "Reanudar"}{" "}
          suscripción
        </button>
        <button
          onClick={() => startLoading(modify)}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:gray-500"
        >
          {
            plans.find((plan) => plan.plan_id === subscription.plan_id)
              ?.editButtonText
          }
        </button>
        <button
          onClick={() => startLoading(cancel)}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:gray-500"
        >
          Cancelar suscripción
        </button>
      </div>
    </div>
  );
};

export default SubscriptionActions;
