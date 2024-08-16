import Card from "@/components/Page/Card/Card";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Card page",
};

const Page: NextPage = () => {
  return (
    <div>
      <Card />
    </div>
  );
};

export default Page;
