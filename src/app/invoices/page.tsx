import React from "react";
import { cart } from "../extended-checkout/page";
import InvoiceClient from "./InvoiceClient";

const InvoicesPage = () => {
  return (
    <div className="p-4">
      <div className="md:max-w-5xl max-w-xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-md border h-fit">
            <h2 className="text-2xl font-semibold ">$250.00</h2>
            <ul className="text-slate-500 font-medium mt-8 space-y-4">
              {cart.map((item) => (
                <li className="flex flex-wrap gap-4 text-sm" key={item.name}>
                  {item.name}{" "}
                  <span className="ml-auto font-semibold ">${item.price}</span>
                </li>
              ))}
              <li className="flex flex-wrap gap-4 text-[15px] font-semibold  border-t border-gray-300 pt-4">
                Total{" "}
                <span className="ml-auto">
                  ${cart.reduce((acc, item) => acc + item.price, 0)}
                </span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-2 max-md:order-1">
            <h2 className="text-3xl font-semibold ">Factura</h2>
            <InvoiceClient cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;
