"use client";
import { getListVehicleTypeAPI } from "@/api/vehicleType";
import { VehicleTypeProps } from "@/types/vehicleType.type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Loading from "../LoadingPage/Loading";
import SearchField from "@/components/Common/searchField";
import SelectFilter from "@/components/Common/selectFilter";
import {
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import CreateVehicleType from "./CreateVehicleType";
import EditVehicleType from "./EditVehicleType";
import DeleteVehicleType from "./DeleteVehicleType";
import SearchContainer from "@/components/Common/SearchContainer";
import usePagination from "@/hook/usePagination";
import useSearchDebounce from "@/hook/useSearchDebouce";
import Table from "@/components/Table";
import VehicleTableHeaders from "../Vehicle/table-headers";
import { VehicleTypeTableHeaders } from "./table-headers";
import toLocaleDate, { toVNDateString } from "@/utils/date";
const keys = ["Name", "Description", "Created Date"];

export default function VehicleTypeTable() {
  const [disable, setDisable] = useState(false);
  const {
    goToFirstPage,
    handleChangeRowsPerPage,
    handlePageChange,
    pagination,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);

  const [filterAttribute, setFilterAttribute] =
    useState<keyof VehicleTypeProps>("name");
  const filterOptions = [{ display: "Name", value: "name" }];

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof VehicleTypeProps);
    goToFirstPage();
  };
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "/vehicle-types",
      pagination.pageSize,
      pagination.pageIndex,
      debounceSearchText,
      filterAttribute,
    ],
    queryFn: () =>
      getListVehicleTypeAPI(
        pagination.pageSize,
        pagination.pageIndex + 1,
        debounceSearchText,
        filterAttribute.toString()
      ),
    retry: 1,
  });
  const tableRows = useMemo(() => {
    const vehicleTypes = data?.data.data;
    if (!vehicleTypes || vehicleTypes.length === 0) {
      return [];
    }

    return vehicleTypes.map((vehicleType: VehicleTypeProps) => (
      <TableRow key={vehicleType.id}>
        <TableCell>{vehicleType.name}</TableCell>
        <TableCell>{vehicleType.description ?? "Nan"}</TableCell>
        <TableCell>{toVNDateString(vehicleType.createdDate)}</TableCell>
        <TableCell>
          <div className='flex flex-row space-x-2'>
            <EditVehicleType
              id={vehicleType.id}
              refetch={refetch}
              setIsPending={setDisable}
              disable={disable}
              value={vehicleType}
            />
            <DeleteVehicleType
              id={vehicleType.id}
              refetch={refetch}
              setIsPending={setDisable}
              disable={disable}
            />
          </div>
        </TableCell>
      </TableRow>
    ));
  }, [data?.data.data]);

  return (
    <div className='flex flex-col gap-5'>
      <SearchContainer>
        <SelectFilter
          filterAttribute={filterAttribute}
          setFilterAttribute={handleFilterAttributeChange}
          listFilter={filterOptions}
        />
        <SearchField
          inputValue={searchText}
          setInputValue={handleSearchTextChange}
        />
      </SearchContainer>
      <div className='flex flex-row gap-3 items-center justify-center w-full'>
        <Button
          variant='contained'
          color='primary'
          onClick={() => refetch()}
          disabled={false}
        >
          Refresh
        </Button>
        <CreateVehicleType
          refetch={refetch}
          setIsPending={setDisable}
          disable={disable}
        />
      </div>
      {isLoading && <Loading />}
      {isError && <p>Error: {error.message}</p>}
      {isSuccess && (
        <Table
          onPageChange={handlePageChange}
          onPageSizeChange={handleChangeRowsPerPage}
          pagination={pagination}
          tableHeads={VehicleTypeTableHeaders}
          tableRows={tableRows}
          isLoading={isLoading}
          totalRecord={data.data.totalRecord}
        />
      )}
    </div>
  );
}
