import Table from "@/components/Table";
import React, { useCallback, useMemo } from "react";
import { TableCell, TableRow } from "@mui/material";
import {
  GateRevenue,
  ParkingAreaRevenueDetailType,
} from "@/types/parking-area.type";
import { formatPrice } from "@/utils/price";

type Props = {
  data?: ParkingAreaRevenueDetailType[];
};

export default function ParkingAreaDetailTable({ data }: Props) {
  const TableHeaders = useMemo(() => {
    const parkingAreaDetail = data;

    if (!parkingAreaDetail) {
      return [];
    }
    const headerArr = ["Category/Gate"];
    parkingAreaDetail[0].gates.map((item) => {
      headerArr.push(item.name);
    });
    headerArr.push("Total");
    return headerArr;
  }, [data]);

  const getGatesRevenue = useCallback((gates: GateRevenue[]) => {
    return gates.map((gate) => (
      <TableCell key={gate.name}>{formatPrice(gate.revenue)}</TableCell>
    ));
  }, []);

  const tableRows = useMemo(() => {
    const parkingAreaDetail = data;

    if (!parkingAreaDetail) {
      return [];
    }

    return parkingAreaDetail.map((detail) => (
      <TableRow key={detail.paymentMethod}>
        <TableCell
          sx={{
            fontWeight: "bold",
            textTransform: "capitalize",
            fontSize: "16px",
          }}
        >
          {detail.paymentMethod.toLowerCase()}
        </TableCell>
        {getGatesRevenue(detail.gates)}
        <TableCell>{formatPrice(detail.total, true)}</TableCell>
      </TableRow>
    ));
  }, [data, getGatesRevenue]);

  return <Table tableHeads={TableHeaders} tableRows={tableRows} />;
}
