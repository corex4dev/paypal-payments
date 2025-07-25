"use server";

import { paypalApiRootV2 } from "@/lib/constants";
import { authenticatePayPal } from "./auth";

export const generateInvoice = async (cart: any[]) => {
  const accessToken = await authenticatePayPal();

  const subs = await fetch(`${paypalApiRootV2}/invoicing/invoices`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      primary_recipients: [
        {
          billing_info: {
            name: {
              given_name: "John",
              surname: "Doe",
            },
            address: {
              address_line_1: "1234 Main Street",
              admin_area_2: "Anytown",
              admin_area_1: "CA",
              postal_code: "98765",
              country_code: "US",
            },
            email_address: "corex4dev@gmail.com",
            phones: [
              {
                country_code: "001",
                national_number: "4884551234",
                phone_type: "HOME",
              },
            ],
            additional_info_value: "add-info",
          },
          shipping_info: {
            name: {
              given_name: "John",
              surname: "Doe",
            },
            address: {
              address_line_1: "1234 Main Street",
              admin_area_2: "Anytown",
              admin_area_1: "CA",
              postal_code: "98765",
              country_code: "US",
            },
          },
        },
      ],
      invoicer: {
        business_name: "Test Store",
        name: {
          given_name: "John",
          surname: "Doe",
        },
        email_address: "sb-9lal743107520@business.example.com",
      },
      items: cart.map((c) => ({
        name: c.name,
        quantity: 1,
        unit_amount: {
          value: c.price,
          currency_code: "CAD",
        },
      })),
      detail: {
        currency_code: "CAD",
      },
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
    }),
  });

  return { data: await subs.json(), error: !subs.ok };
};

export const getInvoiceQr = async (invoiceId: string) => {
  const accessToken = await authenticatePayPal();

  const subs = await fetch(
    `${paypalApiRootV2}/invoicing/invoices/${invoiceId}/generate-qr-code`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ width: 400, height: 400 }),
    }
  );

  if (!subs.ok) {
    return { data: null, error: true };
  }

  const formData = await subs.formData();
  const imageFile = formData.get("image");

  return {
    data:
      imageFile instanceof Blob
        ? URL.createObjectURL(imageFile)
        : typeof imageFile === "string"
        ? `data:image/png;base64,${imageFile}`
        : null,
    error: !subs.ok,
  };
};

export const sendInvoice = async (invoiceId: string) => {
  const accessToken = await authenticatePayPal();

  const subs = await fetch(
    `${paypalApiRootV2}/invoicing/invoices/${invoiceId}/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  return { data: await subs.json(), error: !subs.ok };
};
