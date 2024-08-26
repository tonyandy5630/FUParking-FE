import VehiclePage from "@/components/Page/Vehicle";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Vehicle Page",
};

const Page: NextPage = () => {
  return (
    <div>
      <VehiclePage />
    </div>
  );
};

export default Page;
