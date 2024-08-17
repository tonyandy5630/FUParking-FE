"use client";

import { getGate } from "@/api/gate";
import { Gates } from "@/types/gate.type";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
import SelectFilter from "@/components/Common/selectFilter";
import SearchField from "@/components/Common/searchField";
import Loading from "../LoadingPage/Loading";
import Chip from "@/components/Chip";
import usePagination from "@/hook/usePagination";
import useSearchDebounce from "@/hook/useSearchDebouce";
import Table from "@/components/Table";
import { GateTableHeaders } from "./table.headers";
import dynamic from "next/dynamic";
import SearchContainer from "@/components/Common/SearchContainer";

type FilterOption = {
  display: string;
  value: string;
};

export default function GateTable() {
  const {
    goToFirstPage,
    handleChangeRowsPerPage,
    handlePageChange,
    pagination,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);

  const filterOptions: FilterOption[] = [
    { display: "Name", value: "name" },
    { display: "Parking Area", value: "parkingAreaName" },
    { display: "Description", value: "description" },
    { display: "Gate Type", value: "gateTypeName" },
    { display: "Status", value: "statusGate" },
  ];

  const [filterAttribute, setFilterAttribute] = useState<keyof Gates>("name");

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof Gates);
    goToFirstPage();
  };
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "/gates",
      pagination.pageSize,
      pagination.pageIndex,
      debounceSearchText,
      filterAttribute,
    ],
    queryFn: () =>
      getGate(
        pagination.pageSize,
        pagination.pageIndex + 1,
        debounceSearchText,
        filterAttribute
      ),
    retry: 1,
  });

  const tableRows = useMemo(() => {
    const gates = data?.data.data;
    if (!gates || gates.length === 0) {
      return [];
    }

    return gates.map((gate: Gates) => (
      <TableRow key={gate.id}>
        <TableCell>{gate.name}</TableCell>
        <TableCell>{gate.parkingAreaName}</TableCell>
        <TableCell>{gate.description}</TableCell>
        <TableCell>{gate.gateTypeName}</TableCell>
        <TableCell>
          <Chip variant={gate.statusGate === "ACTIVE" ? "success" : "error"}>
            {gate.statusGate}
          </Chip>
        </TableCell>
        <TableCell>{gate.createdBy}</TableCell>
        <TableCell>{gate.lastModifyBy}</TableCell>
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
      <div className='flex flex-row gap-3 items-center justify-center w-full'></div>
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
            tableHeads={GateTableHeaders}
            tableRows={tableRows}
            isLoading={isLoading}
            totalRecord={data.data.totalRecord}
          />
        ))}
    </>
  );
}
