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
import Chip from "@/components/Chip";

export default function PriceTableDetails({
  priceTableId,
}: {
  priceTableId: string;
}) {
  const [searchText, setSearchText] = useState("");
  const {
    pagination,
    handleChangeRowsPerPage,
    handlePageChange,
    setPagination,
  } = usePagination();

  const {
    data: priceItemsData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["/get-price-table-items", priceTableId],
    queryFn: () => getPriceItemByTableAPI(priceTableId),
  });

  const handlePriceItemStatusChange = (data: {
    priceItemId: string;
    isActive: boolean;
  }) => {};

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
          <TableCell>{item.priceTable}</TableCell>
          <TableCell>{item.applyFromHour}</TableCell>
          <TableCell>{item.applyToHour}</TableCell>
          <TableCell>{item.maxPrice}</TableCell>
          <TableCell>{item.minPrice}</TableCell>
          <TableCell>
            <Chip variant={item.status === "ACTIVE" ? "success" : "warning"}>
              {item.status}
            </Chip>
          </TableCell>
          <TableCell>
            {(() => {
              switch (item.status) {
                case "ACTIVE":
                  return (
                    <Button
                      variant='contained'
                      color='error'
                      onClick={() =>
                        handlePriceItemStatusChange({
                          priceItemId: item.id,
                          isActive: false,
                        })
                      }
                    >
                      DEACTIVATE
                    </Button>
                  );
                case "INACTIVE":
                  return (
                    <Button
                      variant='contained'
                      onClick={() =>
                        handlePriceItemStatusChange({
                          priceItemId: item.id,
                          isActive: true,
                        })
                      }
                    >
                      RE-ACTIVE
                    </Button>
                  );
              }
            })()}
          </TableCell>
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
