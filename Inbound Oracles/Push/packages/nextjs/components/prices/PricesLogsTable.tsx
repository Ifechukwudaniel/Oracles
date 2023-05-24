import React from "react";
import { PriceChange } from "~~/types/prices";

export default function PricesLogsTable({
  title,
  loading,
  priceChanges,
}: {
  title: string;
  loading: boolean;
  priceChanges: PriceChange[];
}) {
  if (loading) {
    return (
      <div className="flex flex-col content-center">
        <div
          className="inline-block h-24 w-24 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }
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
                      Sn
                    </th>
                    <th scope="col" className="text-sm font-medium text-base-content px-4 py-4 text-left opacity-75">
                      Ticker
                    </th>
                    <th scope="col" className="text-sm font-medium text-base-content px-4 py-4 text-left opacity-75">
                      Reporter
                    </th>
                    <th scope="col" className="text-sm font-medium text-base-content px-4 py-4 text-left opacity-75">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {priceChanges.map(({ ticker, reporter, price }, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 whitespace-nowrap text-md font-medium">
                        <div className="flex flex-row h-10">
                          <p className="m-0 mt-2 ">{index + 1}</p>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap text-md font-medium">
                        <div className="flex flex-row h-10">
                          <p className="m-0 mt-2 ">{ticker}</p>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap text-md font-medium">
                        <div className="flex flex-row h-10">
                          <p className="m-0 mt-2 ">{reporter}</p>
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
