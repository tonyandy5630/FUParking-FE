import PackageSupervisor from "@/components/Page/Supervisor/Package/Package";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Package Page",
};

const Page: NextPage = () => {
  return (
    <div>
      <PackageSupervisor />
    </div>
  );
};

export default Page;
