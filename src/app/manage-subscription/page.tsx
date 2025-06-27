import React from "react";
import { getSubscription } from "../actions/subscription";
import SubscriptionActions from "./SubscriptionActions";
import { plans } from "@/lib/constants";

const ManageSubscriptionPage = async () => {
  const { data: subscription, error } = await getSubscription("I-52R7DUJ2R9FN");

  if (error) {
    return (
      <div>
        <p>Subscription not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* <pre>{JSON.stringify(subscription, null, 2)}</pre> */}

      <p>
        Cliente: {subscription.subscriber.name.given_name}{" "}
        {subscription.subscriber.name.surname}
      </p>
      <p>
        Inicio:{" "}
        {Intl.DateTimeFormat("es-ES", {
          dateStyle: "long",
          timeStyle: "short",
          hour12: true,
        }).format(new Date(subscription.start_time))}
      </p>
      {subscription.status === "ACTIVE" && (
        <p>
          Siguiente pago:{" "}
          {Intl.DateTimeFormat("es-ES", {
            dateStyle: "long",
            timeStyle: "short",
            hour12: true,
          }).format(new Date(subscription.billing_info.next_billing_time))}
        </p>
      )}
      <p>
        Plan actual:{" "}
        {plans.find((plan) => plan.plan_id === subscription.plan_id)?.name}
      </p>
      <p>Estado: {subscription.status}</p>

      {subscription.status !== "CANCELLED" && (
        <SubscriptionActions subscription={subscription} />
      )}
    </div>
  );
};

export default ManageSubscriptionPage;
