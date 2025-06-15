"use client";

import React from "react";
import ButtonsWrapper from "./ButtonsWrapper";

interface Props {
  name: string;
  description: string;
  features: string[];
  price: number;
  plan_id: string;
}

const PlanCard = ({ name, description, features, price, plan_id }: Props) => {
  return (
    <div className="grid grid-rows-[1fr_20px] p-6 mx-auto max-w-lg text-center rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 ">
      <div className="flex flex-col">
        <h3 className="mb-4 text-2xl font-semibold">{name}</h3>
        <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
          {description}
        </p>
        <div className="flex justify-center items-baseline my-8">
          <span className="mr-2 text-5xl font-extrabold">${price}</span>
          <span className="text-gray-500 dark:text-gray-400">/month</span>
        </div>
        <ul role="list" className="mb-8 space-y-4 text-left">
          {features.map((f, i) => (
            <li
              className="flex items-center space-x-3"
              key={`${plan_id}_${i}_${f}`}
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <ButtonsWrapper planId={plan_id} />
    </div>
  );
};

export default PlanCard;
