import VehicleTypeSupervisor from "@/components/Page/Supervisor/VehicleType/VehicleType";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Vehicle Type Page",
};

const Page: NextPage = () => {
  return (
    <div>
      <VehicleTypeSupervisor />
    </div>
  );
};

export default Page;
