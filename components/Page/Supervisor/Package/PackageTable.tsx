"use client";

import { getListPackage, updatePackageAPI } from "@/api/package";
import { Packages } from "@/types/package.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
import SelectFilter from "@/components/Common/selectFilter";
import SearchField from "@/components/Common/searchField";
import { formatPrice } from "@/utils/price";
import SearchContainer from "@/components/Common/SearchContainer";
import Chip from "@/components/Chip";
import usePagination from "@/hook/usePagination";
import useSearchDebounce from "@/hook/useSearchDebouce";
import Table from "@/components/Table";
import { PackageTableHeaders } from "./table-headers";
import dynamic from "next/dynamic";
import Loading from "../../LoadingPage/Loading";
import { Button } from "@mui/material";

type FilterOption = {
  display: string;
  value: string;
};

export const expDurationIncrement = [10, 20, 30];

const filterOptions: FilterOption[] = [
  { display: "Name", value: "name" },
  { display: "Coin Amount", value: "coinAmount" },
  { display: "Extra Coin", value: "extraCoin" },
  { display: "Exp Package", value: "expPackage" },
  { display: "Status", value: "packageStatus" },
];

export default function PackageTableSupervisor() {
  const {
    goToFirstPage,
    handleChangeRowsPerPage,
    handlePageChange,
    pagination,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);

  const [filterAttribute, setFilterAttribute] =
    useState<keyof Packages>("name");

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof Packages);
    goToFirstPage();
  };

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "/packages",
      pagination.pageSize,
      pagination.pageIndex,
      debounceSearchText,
      filterAttribute,
    ],
    queryFn: () =>
      getListPackage(
        pagination.pageSize,
        pagination.pageIndex + 1,
        filterAttribute,
        debounceSearchText
      ),
    retry: 1,
  });

  const tableRows = useMemo(() => {
    const packages = data?.data.data;
    if (!packages || packages.length === 0) {
      return [];
    }

    return packages.map((packs: Packages, index) => (
      <TableRow key={packs.id}>
        <TableCell>{packs.name}</TableCell>
        <TableCell>{formatPrice(parseInt(packs.coinAmount))}</TableCell>
        <TableCell>{formatPrice(parseInt(packs.extraCoin))}</TableCell>
        <TableCell>
          {parseInt(packs.expPackage) > 1
            ? `${packs.expPackage} days`
            : `${packs.expPackage} day`}
        </TableCell>
        <TableCell>{formatPrice(parseInt(packs.price))}</TableCell>
        <TableCell>
          <Chip
            variant={packs.packageStatus === "ACTIVE" ? "success" : "error"}
          >
            {packs.packageStatus}
          </Chip>
        </TableCell>
        <TableCell>{packs.createDate}</TableCell>
      </TableRow>
    ));
  }, [data?.data.data]);

  return (
    <>
      <SearchContainer>
        <SearchField
          inputValue={searchText}
          setInputValue={handleSearchTextChange}
        />
        <SelectFilter
          filterAttribute={filterAttribute}
          setFilterAttribute={handleFilterAttributeChange}
          listFilter={filterOptions}
        />
      </SearchContainer>
      <div className="flex flex-row gap-3 items-center justify-end w-full py-2">
        <Button variant="outlined" color="primary" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      {isLoading && <Loading />}
      {isError && <p>Something wrong, please trying again later...</p>}
      {isSuccess &&
        (data.data.totalRecord === 0 ? (
          <p>There is no data to show.</p>
        ) : (
          <Table
            onPageChange={handlePageChange}
            onPageSizeChange={handleChangeRowsPerPage}
            pagination={pagination}
            tableHeads={PackageTableHeaders}
            tableRows={tableRows}
            isLoading={isLoading}
            totalRecord={data.data.totalRecord}
          />
        ))}
    </>
  );
}
