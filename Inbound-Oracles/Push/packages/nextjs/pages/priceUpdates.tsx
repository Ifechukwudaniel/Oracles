import { useState } from "react";
import Head from "next/head";
import { toUtf8String } from "ethers/lib/utils";
import type { NextPage } from "next";
import { useContractEvent } from "wagmi";
import PricesLogsTable from "~~/components/prices/PricesLogsTable";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { PriceChange } from "~~/types/prices";

const PriceUpdates: NextPage = () => {
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo("PriceOracle");
  const [priceUpdates, setPriceUpdates] = useState<PriceChange[]>([]);

  useContractEvent({
    address: deployedContractData?.address,
    abi: deployedContractData?.abi,
    eventName: "PriceUpdate",
    listener(ticker, reporter, price) {
      setPriceUpdates([{ ticker: toUtf8String(ticker), reporter, price: price.toNumber() }, ...priceUpdates]);
    },
  });

  return (
    <>
      <Head>
        <title>Push Oracle Demo</title>
        <meta name="description" content="Push Oracle Demo" />
      </Head>

      <div className="flex items-center flex-col  pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-xl font-bold md:text-2xl">Push Oracle Demo</span>
            <span className="block text-xl font-bold md:text-2xl">
              This page show the Price Updates on the Prices Oracle Contract
            </span>
          </h1>
        </div>
        <PricesLogsTable title="Prices Changes " loading={deployedContractLoading} priceChanges={priceUpdates} />
      </div>
    </>
  );
};

export default PriceUpdates;
