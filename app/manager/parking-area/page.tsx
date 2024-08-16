import ParkingArea from "@/components/Page/ParkingArea/ParkingArea";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Parking Area page",
};

const Page: NextPage = () => {
  return (
    <div>
      <ParkingArea />
    </div>
  );
};

export default Page;
