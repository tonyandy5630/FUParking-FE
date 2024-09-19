import { Metadata, NextPage } from "next";
import RevenuePage from "@/components/Page/Revenue";

export const metadata: Metadata = {
  title: "Revenue Page",
};

const Page: NextPage = () => {
  return (
    <div>
      <RevenuePage />
    </div>
  );
};

export default Page;
