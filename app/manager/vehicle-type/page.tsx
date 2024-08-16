import VehicleType from "@/components/Page/VehicleType/VehicleType";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Vehicle Type page",
};

const Page: NextPage = () => {
  return (
    <div>
      <VehicleType />
    </div>
  );
};

export default Page;
