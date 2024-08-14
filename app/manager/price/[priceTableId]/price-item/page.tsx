import PriceTableDetails from "@/components/Page/PriceTableDetail";
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
      <PriceTableDetails priceTableId={params.priceTableId} />
    </div>
  );
}
