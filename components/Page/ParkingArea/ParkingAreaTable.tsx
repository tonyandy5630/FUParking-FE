"use client";
import { useQuery } from "@tanstack/react-query";
import SearchField from "@/components/Common/searchField";
import { useMemo, useState } from "react";
import Loading from "../LoadingPage/Loading";
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
import { ParkingAreas } from "@/types/parkingArea.type";
import { getListParkingArea } from "@/api/parkingArea";
import SelectFilter from "@/components/Common/selectFilter";
import SearchContainer from "@/components/Common/SearchContainer";
import Chip from "@/components/Chip";
import { useDebounce } from "use-debounce";
import { DEBOUNCE_DELAY } from "@/constant/debounce";
import usePagination from "@/hook/usePagination";
import Table from "@/components/Table";
import { ParkingAreaTableHeaders } from "./table-headers";
import dynamic from "next/dynamic";
import useSearchDebounce from "@/hook/useSearchDebouce";

type FilterOption = {
  display: string;
  value: string;
};

export default function ParkingAreaTable() {
  const {
    handleChangeRowsPerPage,
    handlePageChange,
    pagination,
    setPagination,
    goToFirstPage,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);
  const filterOptions: FilterOption[] = [{ display: "Name", value: "name" }];

  const [filterAttribute, setFilterAttribute] =
    useState<keyof ParkingAreas>("name");

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof ParkingAreas);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "/areas",
      pagination.pageSize,
      pagination.pageIndex,
      debounceSearchText,
      filterAttribute,
    ],
    queryFn: () =>
      getListParkingArea(
        pagination.pageSize,
        pagination.pageIndex + 1,
        debounceSearchText,
        filterAttribute
      ),
    retry: 1,
  });

  const tableRows = useMemo(() => {
    const parkingAreas = data?.data.data;
    if (!parkingAreas || parkingAreas.length === 0) {
      return [];
    }

    return parkingAreas.map((area: ParkingAreas) => (
      <TableRow key={area.id}>
        <TableCell>{area.name}</TableCell>
        <TableCell>{area.description}</TableCell>
        <TableCell>{area.maxCapacity}</TableCell>
        <TableCell>{area.block}</TableCell>
        <TableCell>{area.mode}</TableCell>
        <TableCell>
          <Chip
            variant={area.statusParkingArea === "ACTIVE" ? "success" : "error"}
          >
            {area.statusParkingArea}
          </Chip>
        </TableCell>
        <TableCell>
          {new Date(area.createDate).toLocaleDateString("vi-VN")}
        </TableCell>
        <TableCell>{area.createBy}</TableCell>
        <TableCell>{area.lastModifyBy}</TableCell>
        <TableCell>
          {new Date(area.lastModifyDate).toLocaleDateString("vi-VN")
            ? area.lastModifyDate == null
            : 0}
        </TableCell>
      </TableRow>
    ));
  }, [data?.data.data]);

  return (
    <>
      <div className='flex flex-col gap-5'>
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
            tableHeads={ParkingAreaTableHeaders}
            tableRows={tableRows}
            isLoading={isLoading}
            totalRecord={data.data.totalRecord}
          />
        ))}
    </>
  );
}

function setFilterAttribute(arg0: string) {
  throw new Error("Function not implemented.");
}
