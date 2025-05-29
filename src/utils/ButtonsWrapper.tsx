"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  PayPalButtonCreateOrder,
  PayPalButtonOnApprove,
} from "@paypal/paypal-js";
import React from "react";

const createOrder: PayPalButtonCreateOrder = (data, actions) => {
  return actions.order.create({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          value: "10.00",
          currency_code: "USD",
        },
      },
    ],
  });
};

const onApprove: PayPalButtonOnApprove = async (data, actions) => {
  if (actions.order) {
    const details = await actions.order.capture();

    alert(
      "Transaction completed by " +
        details.payment_source?.paypal?.name?.full_name
    );
  }
};

const ButtonsWrapper = () => {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <>
      {isPending && <div className="spinner">Cargando...</div>}
      <PayPalButtons
        style={{ layout: "vertical" }}
        disabled={false}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </>
  );
};

export default ButtonsWrapper;
