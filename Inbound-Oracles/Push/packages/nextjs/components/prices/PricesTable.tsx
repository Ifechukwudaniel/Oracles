import React from "react";
import { PriceType } from "~~/types/prices";

export default function PricesTable({ title, prices }: { title: string; prices: PriceType[] }) {
  return (
    <div className="w-full overflow-hidden shadow-md border  rounded-xl mt-10 md:mt-0 md:m-4 bg-secondary-contract ">
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className=" ml-5">
              <p className="text-2xl font-semibold"> {title} </p>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-sm border-b">
                  <tr>
                    <th scope="col" className="text-sm font-medium text-base-content px-4 py-4 text-left opacity-75">
                      Token Name
                    </th>
                    <th scope="col" className="text-sm font-medium text-base-content px-4 py-4 text-left opacity-75">
                      Ticker
                    </th>
                    <th scope="col" className="text-sm font-medium text-base-content px-4 py-4 text-left opacity-75">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map(({ name, ticker, price }, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 whitespace-nowrap text-md font-medium">
                        <div className="flex flex-row h-10">
                          <p className="m-0 mt-2 ">{name}</p>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap text-md font-medium">
                        <div className="flex flex-row h-10">
                          <p className="m-0 mt-2 ">{ticker}</p>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap text-md font-medium">
                        <div className="flex flex-row h-10">
                          <p className="m-0 mt-2 ">
                            {"$"}
                            {price / 10000}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
