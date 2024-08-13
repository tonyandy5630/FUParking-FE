import PriceTablePage from "@/components/Page/PriceTablePage";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Price Table Page",
};

const Page: NextPage = () => {
  return (
    <div>
      <PriceTablePage />
    </div>
  );
};

export default Page;
