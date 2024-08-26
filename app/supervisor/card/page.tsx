import Card from "@/components/Page/Card/Card";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Card Page",
};

const Page: NextPage = () => {
  return (
    <div>
      <Card />
    </div>
  );
};

export default Page;
