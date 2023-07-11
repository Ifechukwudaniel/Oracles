import Head from "next/head";
import type { NextPage } from "next";
import PricesTable from "~~/components/prices/PricesTable";

const Home: NextPage = () => {
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
              The Prices on the above table are form the Price Consumer Contract
            </span>
            <span className="block text-xl font-bold md:text-2xl">
              The previous price is stored on your local browser , just to show the changes
            </span>
          </h1>
        </div>
      </div>
      <div className="flex flex-col justify-between md:flex-row">
        {/* <PricesTable title="Current Prices" />
        <PricesTable title="Previous Prices" /> */}
      </div>
    </>
  );
};

export default Home;
