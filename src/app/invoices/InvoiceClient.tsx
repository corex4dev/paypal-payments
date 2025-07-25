"use client";

import {
  generateInvoice,
  getInvoiceQr,
  sendInvoice,
} from "@/actions/invoicing";
import Loader from "@/components/Loader/Loader";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState, useTransition } from "react";

const InvoiceClient = ({ cart }: { cart: any[] }) => {
  const [state, setState] = useState<"generate" | "send" | "success">(
    "generate"
  );
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [invoiceLink, setInvoiceLink] = useState<string>("");
  const [invoiceQr, setInvoiceQr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const draft = async () => {
    const { data, error } = await generateInvoice(cart);

    if (data) {
      const id = data.href.split("/").pop();
      setInvoiceId(id || "");
      invoiceImage(id);
      setState("send");
    }
  };

  const invoiceImage = async (id: string | undefined) => {
    if (!id) {
      setInvoiceQr(null);
      return;
    }

    const data = await getInvoiceQr(id);
    setInvoiceQr(data.data);
  };

  const send = async () => {
    if (!invoiceId) return;
    const { data, error } = await sendInvoice(invoiceId);
    setInvoiceLink(data.href);
    setState("success");
  };

  if (state === "generate") {
    return (
      <>
        <p className="text-slate-500 text-sm mt-4 mb-8">
          Presione el siguiente botón para generar borrador de factura
        </p>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:gray-500"
          onClick={() => startTransition(() => draft())}
          disabled={isPending}
        >
          {isPending ? <Loader size="sm" /> : "Generar factura"}
        </button>
      </>
    );
  }

  if (state === "send") {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-slate-500 text-sm mt-4 mb-8">
          Borrador generado. Presione el siguiente botón para enviar factura o
          comparta el siguiente link o QR con el cliente
        </p>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:gray-500"
          onClick={() => startTransition(() => send())}
          disabled={isPending}
        >
          {isPending ? <Loader size="sm" /> : "Enviar factura"}
        </button>

        <Image
          src={invoiceQr || "/file.svg"}
          alt="Invoice"
          width={200}
          height={200}
        />
      </div>
    );
  }

  if (state === "success") {
    return (
      <>
        <p className="text-slate-500 text-sm mt-4 mb-8">
          Factura generada exitosamente
        </p>
        {invoiceLink && (
          <Link href={invoiceLink} target="_blank">
            Ver factura
          </Link>
        )}
      </>
    );
  }

  return null;
};

export default InvoiceClient;
