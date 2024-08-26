import FeedbackPage from "@/components/Page/Feedback";
import { Metadata, NextPage } from "next";

export const metadata: Metadata = {
  title: "Feedback Page",
};

const Page: NextPage = () => {
  return (
    <div>
      <FeedbackPage />
    </div>
  );
};

export default Page;
