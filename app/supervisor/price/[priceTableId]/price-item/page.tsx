import PriceTableForSupervisorDetails from "@/components/Page/Supervisor/PriceItem";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Price table details",
};
export default function PriceTableDetailsPage({
  params,
}: {
  params: { priceTableId: string };
}) {
  return (
    <div>
      <PriceTableForSupervisorDetails priceTableId={params.priceTableId} />
    </div>
  );
}
