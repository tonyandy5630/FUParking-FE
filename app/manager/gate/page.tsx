import Gate from "@/components/Page/Gate/Gate";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Gate page",
};

const Page: NextPage = () => {
  return (
    <div>
      <Gate />
    </div>
  );
};

export default Page;
