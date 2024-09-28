"use client";
import { listSessionAPI } from "@/api/session";
import SearchField from "@/components/Common/searchField";
import SelectFilter from "@/components/Common/selectFilter";
import { CardProps } from "@/types/card.type";
const Button = dynamic(() => import("@mui/material/Button"));
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Loading from "../LoadingPage/Loading";
import { SessionProps } from "@/types/session.type";
const SessionDetail = dynamic(() => import("./SessionDetail"), {
  loading: () => <Loading />,
});
import Chip from "@/components/Chip";
import SearchContainer from "@/components/Common/SearchContainer";
import usePagination from "@/hook/usePagination";
import useSearchDebounce from "@/hook/useSearchDebouce";
const Table = dynamic(() => import("@/components/Table"));
import { SessionTableHeaders } from "./table-headers";
import toLocaleDate, { getLocalISOString } from "@/utils/date";
import dynamic from "next/dynamic";
import { Moment } from "moment";
import CustomDatePicker from "@/components/DatePicker";
import { formatPlateNumber } from "@/utils/plateNumberFormat";
const initDateFilter = {
  startDate: null,
  endDate: null,
};
const filterOptions = [
  { display: "Card Number", value: "cardNumber" },
  { display: "Plate Number", value: "plateNumber" },
  { display: "Email", value: "customeremail" },
];
export default function SessionTable() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [apiDateFilter, setApiDateFilter] = useState<{
    startDate: Moment | null;
    endDate: Moment | null;
  }>(initDateFilter);

  const {
    goToFirstPage,
    handleChangeRowsPerPage,
    handlePageChange,
    pagination,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);

  const [isOpen, setIsOpen] = useState(false);
  const [filterAttribute, setFilterAttribute] =
    useState<keyof CardProps>("cardNumber");

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "/session-list",
      pagination.pageSize,
      pagination.pageIndex,
      apiDateFilter.startDate,
      apiDateFilter.endDate,
      debounceSearchText,
      filterAttribute,
    ],
    queryFn: () =>
      listSessionAPI(
        pagination.pageSize,
        pagination.pageIndex + 1,
        apiLocalISOString(apiDateFilter.startDate?.toString()),
        apiLocalISOString(apiDateFilter.endDate?.toString()),
        debounceSearchText,
        filterAttribute.toString()
      ),
    retry: 1,
  });

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof CardProps);
    goToFirstPage();
  };

  const handleClickOpen = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsOpen(true);
  };

  const handleFromDateChange = (e: Moment | null) => {
    if (e === null) {
      setApiDateFilter((prev) => ({ ...prev, startDate: null }));
      return;
    }
    setApiDateFilter((prev) => ({ ...prev, startDate: e }));
  };

  const handleToDateChange = (e: Moment | null) => {
    if (e === null) {
      setApiDateFilter((prev) => ({ ...prev, endDate: null }));
      return;
    }
    setApiDateFilter((prev) => ({ ...prev, endDate: e }));
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedSessionId(null);
  };

  const tableRows = useMemo(() => {
    const sessions = data?.data.data;
    if (!sessions || sessions.length === 0) {
      return [];
    }

    return sessions.map((session: SessionProps) => (
      <TableRow
        key={session.id}
        hover={true}
        className="cursor-pointer"
        onClick={() => handleClickOpen(session.id)}
      >
        <TableCell>{session.cardNumber}</TableCell>
        <TableCell>{formatPlateNumber(session.plateNumber)}</TableCell>
        <TableCell>{toLocaleDate(session.timeIn)}</TableCell>
        <TableCell>
          {session.timeOut ? toLocaleDate(session.timeOut) : ""}
        </TableCell>
        <TableCell>{session.vehicleTypeName}</TableCell>
        <TableCell>{session.paymentMethodName}</TableCell>
        <TableCell>{session.customerEmail}</TableCell>
        <TableCell>
          <Chip
            variant={
              session.status === "CANCELLED"
                ? "error"
                : session.status === "CLOSED"
                ? "warning"
                : "success"
            }
          >
            {session.status}
          </Chip>
        </TableCell>
        <TableCell>{session.parkingArea}</TableCell>
      </TableRow>
    ));
  }, [data?.data.data]);

  return (
    <div className="flex flex-col gap-5">
      <SearchContainer>
        <SelectFilter
          filterAttribute={filterAttribute}
          setFilterAttribute={handleFilterAttributeChange}
          listFilter={filterOptions}
        />
        <CustomDatePicker
          label="From Date"
          value={apiDateFilter.startDate}
          onValueChange={handleFromDateChange}
          maxDate={
            apiDateFilter.endDate !== null ? apiDateFilter.endDate : undefined
          }
        />
        <CustomDatePicker
          label="To Date"
          value={apiDateFilter.endDate}
          onValueChange={handleToDateChange}
          minDate={
            apiDateFilter.startDate !== null
              ? apiDateFilter.startDate
              : undefined
          }
        />
        <SearchField
          inputValue={searchText}
          setInputValue={handleSearchTextChange}
        />
      </SearchContainer>
      <div className="flex flex-row gap-3 items-center justify-end w-full">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => refetch()}
          disabled={false}
        >
          Refresh
        </Button>
      </div>
      {isLoading && <Loading />}
      {isError && <p>Something wrong, please trying again later...</p>}
      {isSuccess && (
        <>
          <Table
            onPageChange={handlePageChange}
            onPageSizeChange={handleChangeRowsPerPage}
            pagination={pagination}
            tableHeads={SessionTableHeaders}
            tableRows={tableRows}
            isLoading={isLoading}
            totalRecord={data.data.totalRecord}
          />
          {isOpen && (
            <SessionDetail
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              sessionId={selectedSessionId}
            />
          )}
        </>
      )}
    </div>
  );
}

function apiLocalISOString(date?: string): string {
  if (!date || !Date.parse(date)) {
    return "";
  }
  return getLocalISOString(new Date(date));
}
