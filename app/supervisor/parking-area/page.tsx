import ParkingAreaSupervisor from "@/components/Page/Supervisor/ParkingArea/ParkingArea";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Parking Area Page",
};

const Page: NextPage = () => {
  return (
    <div>
      <ParkingAreaSupervisor />
    </div>
  );
};

export default Page;
