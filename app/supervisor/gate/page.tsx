import Gate from "@/components/Page/Supervisor/Gate/Gate";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Gate Page",
};

const Page: NextPage = () => {
  return (
    <div>
      <Gate />
    </div>
  );
};

export default Page;
