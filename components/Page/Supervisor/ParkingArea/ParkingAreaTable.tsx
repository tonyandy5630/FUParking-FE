"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import SearchField from "@/components/Common/searchField";
import { useMemo, useState } from "react";
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
import { ParkingAreas } from "@/types/parking-area.type";
import { getListParkingArea } from "@/api/parkingArea";
import SelectFilter from "@/components/Common/selectFilter";
import SearchContainer from "@/components/Common/SearchContainer";
import Chip from "@/components/Chip";
import usePagination from "@/hook/usePagination";
import Table from "@/components/Table";
import { ParkingAreaTableHeaders } from "./table-headers";
import dynamic from "next/dynamic";
import useSearchDebounce from "@/hook/useSearchDebouce";
import getModeName, { MODES } from "@/utils/mode";
import { FormOptions } from "@/components/Form/Select";
import Loading from "../../LoadingPage/Loading";
import { Button } from "@mui/material";

type FilterOption = {
  display: string;
  value: string;
};
const MODE_OPTIONS: FormOptions[] = [...MODES];

export default function ParkingAreaTableSupervisor() {
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

  const { data, isLoading, isError, isSuccess, error, refetch, isRefetching } =
    useQuery({
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
        <TableCell>{getModeName(area.mode)}</TableCell>
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
        <TableCell>{area.createBy === "" ? "System" : area.createBy}</TableCell>
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
      <div className='flex flex-row gap-3 items-center justify-end w-full py-2'>
        <Button variant='outlined' color='primary' onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      {(isLoading || isRefetching) && <Loading />}
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
