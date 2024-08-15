import { Metadata, NextPage } from "next";
import User from "@/components/Page/User/User";

export const metadata: Metadata = {
  title: "User Page",
};

const Page: NextPage = () => {
  return (
    <div>
      <User />
    </div>
  );
};

export default Page;
