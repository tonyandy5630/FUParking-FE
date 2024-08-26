import PriceTableSupervisorPage from "@/components/Page/Supervisor/PriceTable";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Price Page",
};

const Page: NextPage = () => {
  return (
    <div>
      <PriceTableSupervisorPage />
    </div>
  );
};

export default Page;
