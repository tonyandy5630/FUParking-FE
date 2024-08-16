import Customer from "@/components/Page/Customer/customer";

import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Customer page",
};

const Page: NextPage = () => {
  return (
    <div>
      <Customer />
    </div>
  );
};

export default Page;
