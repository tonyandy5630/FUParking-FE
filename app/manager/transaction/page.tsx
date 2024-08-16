import Transaction from "@/components/Page/Transaction/Transaction";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Transaction page",
};

const Page: NextPage = () => {
  return (
    <div>
      <Transaction />
    </div>
  );
};

export default Page;
