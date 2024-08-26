import Session from "@/components/Page/Session/Session";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Session Page",
};

const Page: NextPage = () => {
  return (
    <div>
      <Session />
    </div>
  );
};

export default Page;
