import Package from "@/components/Page/Package/Package";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Package page",
};

const Page: NextPage = () => {
  return (
    <div>
      <Package />
    </div>
  );
};

export default Page;
