"use client";
import { getPriceItemByTableAPI } from "@/api/price-item";
import SearchContainer from "@/components/Common/SearchContainer";
import SearchField from "@/components/Common/searchField";
import PageTitle from "@/components/PageTitle";
import usePagination from "@/hook/usePagination";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { PriceItemsTableHeaders } from "./table-headers";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Table from "@/components/Table";
import { Button } from "@mui/material";

export default function PriceTableForSupervisorDetails({
  priceTableId,
}: {
  priceTableId: string;
}) {
  const [searchText, setSearchText] = useState("");
  const { pagination, handleChangeRowsPerPage, handlePageChange } =
    usePagination();

  const {
    data: priceItemsData,
    isLoading,
    isSuccess,
    isError,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["/get-price-table-items", priceTableId, pagination],
    queryFn: () => getPriceItemByTableAPI(priceTableId, pagination),
  });

  const tableRows = useMemo(() => {
    if (!isSuccess) {
      return [];
    }
    const priceItems = priceItemsData.data.data;
    if (!priceItems || priceItems.length === 0) {
      return [];
    }

    return priceItems.map((item) => {
      return (
        <TableRow key={item.id}>
          <TableCell>{item.applyFromHour ?? "NaN"}</TableCell>
          <TableCell>{item.applyToHour ?? "NaN"}</TableCell>
          <TableCell>{item.minPrice}</TableCell>
          <TableCell>{item.maxPrice}</TableCell>
        </TableRow>
      );
    });
  }, [priceItemsData]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    const totalPriceItems = priceItemsData.data.totalRecord;

    if (!totalPriceItems) {
      return;
    }

    if (totalPriceItems === 0) {
      return;
    }
  }, [priceItemsData?.data.totalRecord]);

  return (
    <>
      <PageTitle>Price Table Details</PageTitle>
      <SearchContainer>
        <SearchField inputValue={searchText} setInputValue={setSearchText} />
      </SearchContainer>
      <div className="flex flex-row gap-3 items-center justify-end w-full py-2">
        <Button variant="outlined" color="primary" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      {isError && <>Something went wrong...</>}
      <Table
        onPageChange={handlePageChange}
        onPageSizeChange={handleChangeRowsPerPage}
        pagination={pagination}
        tableHeads={PriceItemsTableHeaders}
        tableRows={tableRows}
        totalRecord={priceItemsData?.data.totalRecord}
        isLoading={isLoading || isRefetching}
      />
    </>
  );
}
