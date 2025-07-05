"use client";

import {
  PayPalButtons,
  PayPalCardFieldsForm,
  PayPalCardFieldsProvider,
  PayPalCVVField,
  PayPalExpiryField,
  PayPalNameField,
  PayPalNumberField,
  usePayPalCardFields,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { CardFieldsOnApproveData } from "@paypal/paypal-js";
import React, { Dispatch, SetStateAction, useState } from "react";
import { captureOrderAction, createOrderAction } from "@/actions/orders";
import Loader from "@/components/Loader/Loader";

const ClientComponent = ({ cart }: { cart: any[] }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isPaying, setIsPaying] = useState<boolean>(false);

  const [transactionData, setTransactionData] = useState<any>(null);

  if (isPending) {
    return (
      <div className="flex flex-col gap-8 items-center py-20">
        <Loader size="md" />
        <p className="text-slate-500 text-sm">Cargando...</p>
      </div>
    );
  }

  async function createOrder() {
    try {
      const { data: orderData, error } = await createOrderAction(cart);
      if (error) {
        console.log(error);
      }

      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      return `Could not initiate PayPal Checkout...${error}`;
    }
  }

  async function onApprove(data: CardFieldsOnApproveData) {
    try {
      const { data: orderData, error } = await captureOrderAction(data.orderID);

      if (error) {
        console.log(error);
      }

      const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
      const errorDetail = orderData?.details?.[0];

      if (errorDetail || !transaction || transaction.status === "DECLINED") {
        let errorMessage;
        if (transaction) {
          errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
        } else if (errorDetail) {
          errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
        } else {
          errorMessage = JSON.stringify(orderData);
        }

        throw new Error(errorMessage);
      } else {
        console.log(
          "Capture result",
          orderData,
          JSON.stringify(orderData, null, 2)
        );
        setTransactionData(transaction);
        alert(
          `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
        );
      }
    } catch (error) {
      alert(`Sorry, your transaction could not be processed...${error}`);
    } finally {
      setIsPaying(false);
    }
  }

  function onError(error: Record<string, unknown>) {
    console.error(error);
    alert(error.message || "Ha ocurrido un error");
  }

  if (transactionData) {
    return <pre>{JSON.stringify(transactionData, null, 2)}</pre>;
  }

  return (
    <PayPalCardFieldsProvider
      onApprove={onApprove}
      onError={onError}
      createOrder={createOrder}
    >
      {/* <PayPalCardFieldsForm /> */}
      <div className="flex flex-col gap-[10px]">
        <PayPalNameField />
        <PayPalNumberField />
        <div className="flex flex-col md:flex-row gap-4">
          <PayPalExpiryField className="flex-1" />
          <PayPalCVVField className="flex-1" />
        </div>
        <SubmitButton loading={isPaying} startLoading={setIsPaying} />
      </div>
      <hr className="max-w-3/4 my-8 mx-auto" />

      <div className="flex flex-col gap-4 items-center w-full">
        <span>O pagar con</span>
        <PayPalButtons
          className="w-1/2"
          style={{ layout: "horizontal" }}
          fundingSource="paypal"
          disabled={isPaying}
          createOrder={createOrder}
          onError={onError}
          onApprove={onApprove}
        />
      </div>
    </PayPalCardFieldsProvider>
  );
};

const SubmitButton = ({
  loading,
  startLoading,
}: {
  loading: boolean;
  startLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const { cardFieldsForm } = usePayPalCardFields();

  const handleSubmit = async () => {
    if (!cardFieldsForm) {
      const childErrorMessage =
        "Unable to find any child components in the <PayPalCardFieldsProvider />";

      throw new Error(childErrorMessage);
    }

    const formState = await cardFieldsForm.getState();

    if (!formState.isFormValid) {
      return alert("The payment form is invalid");
    }
    startLoading(true);
    cardFieldsForm.submit().catch((error) => {
      console.log(error);
      startLoading(false);
    });
  };

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:gray-500 w-1/2 mx-auto h-[55px]"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? <Loader size="sm" /> : <span>Pagar</span>}
    </button>
  );
};

export default ClientComponent;
