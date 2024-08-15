"use client";
import { getPriceItemByTableAPI } from "@/api/price-item";
import SearchContainer from "@/components/Common/SearchContainer";
import SearchField from "@/components/Common/searchField";
import PageTitle from "@/components/PageTitle";
import usePagination from "@/hook/usePagination";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { PriceItemsTableHeaders } from "./table-headers";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Table from "@/components/Table";
import { Button } from "@mui/material";
import UpdateIcon from "@mui/icons-material/Create";
import UpdatePriceItemDialog from "./UpdatePriceItemDialog";

export default function PriceTableDetails({
  priceTableId,
}: {
  priceTableId: string;
}) {
  const [openCreatePriceItem, setOpenCreatePriceItem] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { pagination, handleChangeRowsPerPage, handlePageChange } =
    usePagination();

  const {
    data: priceItemsData,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["/get-price-table-items", priceTableId],
    queryFn: () => getPriceItemByTableAPI(priceTableId),
  });

  const handlePriceItemStatusChange = (data: {
    priceItemId: string;
    isActive: boolean;
  }) => {};

  const handleOpenCreatePriceItems = () => {
    setOpenCreatePriceItem((prev) => !prev);
  };

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
          <TableCell>{item.maxPrice}</TableCell>
          <TableCell>{item.minPrice}</TableCell>
        </TableRow>
      );
    });
  }, [priceItemsData]);
  return (
    <>
      <PageTitle>Price Table Details</PageTitle>
      <SearchContainer>
        <SearchField inputValue={searchText} setInputValue={setSearchText} />
      </SearchContainer>
      <div className='min-w-full flex justify-start items-center py-2'>
        <Button variant='outlined' onClick={handleOpenCreatePriceItems}>
          <UpdateIcon /> <span>Update</span>
        </Button>
      </div>
      {priceItemsData?.data.data && (
        <UpdatePriceItemDialog
          open={openCreatePriceItem}
          tablePriceId={priceTableId}
          onOpenChange={handleOpenCreatePriceItems}
          priceItems={priceItemsData.data.data}
        />
      )}
      {isError && <>Something went wrong...</>}
      <Table
        onPageChange={handlePageChange}
        onPageSizeChange={handleChangeRowsPerPage}
        pagination={pagination}
        tableHeads={PriceItemsTableHeaders}
        tableRows={tableRows}
        totalRecord={priceItemsData?.data.totalRecord}
      />
    </>
  );
}
