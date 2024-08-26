"use client";
import { getPriceTableAPI } from "@/api/price";
import Chip from "@/components/Chip";
import SearchContainer from "@/components/Common/SearchContainer";
import SearchField from "@/components/Common/searchField";
import PageTitle from "@/components/PageTitle";
import Table from "@/components/Table";
import usePagination from "@/hook/usePagination";
import { PriceTable } from "@/types/price.type";
import toLocaleDate from "@/utils/date";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";

import PriceTableHeaders from "./table-headers";

import SelectFilter, { listFilter } from "@/components/Common/selectFilter";
import { useRouter } from "next/navigation";

import useSearchDebounce from "@/hook/useSearchDebouce";
import { Button } from "@mui/material";

const FILTER: listFilter[] = [
  {
    display: "Table Name",
    value: "name",
  },
  {
    value: "vehicletype",
    display: "Vehicle Type",
  },
];

export default function PriceTableSupervisorPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const {
    pagination,
    handleChangeRowsPerPage,
    handlePageChange,
    setPagination,
    goToFirstPage,
  } = usePagination();
  const [tableList, setTableList] = useState<PriceTable[]>([]);
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);

  const {
    data: priceTableData,
    isSuccess,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["/get-price-table", pagination, filter, debounceSearchText],
    queryFn: () =>
      getPriceTableAPI({
        page: pagination,
        attribute: filter,
        searchInput: debounceSearchText,
      }),
  });

  const handleFilterChange = (value: string) => {
    setFilter(value);
    goToFirstPage();
  };

  useEffect(() => {
    if (isSuccess && priceTableData.data.data) {
      setTableList(priceTableData.data.data || []);
    }
  }, [isSuccess, priceTableData]);

  const tableRows = useMemo(() => {
    return tableList.map((item) => {
      return (
        <TableRow
          key={item.id}
          hover={true}
          onClick={() => router.push("price/" + item.id + "/price-item")}
          className="cursor-pointer"
        >
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.priority}</TableCell>
          <TableCell>{item.vehicleType}</TableCell>
          <TableCell>{toLocaleDate(item.applyFromDate as string)}</TableCell>
          <TableCell>{toLocaleDate(item.applyToDate as string)}</TableCell>
          <TableCell>
            <Chip
              variant={
                item.statusPriceTable === "ACTIVE" ? "success" : "warning"
              }
            >
              {item.statusPriceTable}
            </Chip>
          </TableCell>
        </TableRow>
      );
    });
  }, [tableList]);

  return (
    <>
      <PageTitle>Price Page</PageTitle>
      <SearchContainer>
        <SearchField
          inputValue={searchText}
          setInputValue={handleSearchTextChange}
          placeholder={"Enter price table name"}
        />
        <SelectFilter
          filterAttribute={filter}
          setFilterAttribute={handleFilterChange}
          listFilter={FILTER}
        />
      </SearchContainer>
      <div className="flex flex-row gap-3 items-center justify-end w-full py-2">
        <Button variant="outlined" color="primary" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <Table
        onPageChange={handlePageChange}
        onPageSizeChange={handleChangeRowsPerPage}
        pagination={pagination}
        tableHeads={PriceTableHeaders}
        tableRows={tableRows}
        totalRecord={priceTableData?.data.totalRecord}
        isLoading={isLoading || isRefetching}
      />
    </>
  );
}
