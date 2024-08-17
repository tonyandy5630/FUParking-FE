"use client";
import { listSessionAPI } from "@/api/session";
import SearchField from "@/components/Common/searchField";
import SelectFilter from "@/components/Common/selectFilter";
import { CardProps } from "@/types/card.type";
import {
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Loading from "../LoadingPage/Loading";
import { SessionProps } from "@/types/session.type";
import SessionDetail from "./SessionDetail";
import Chip from "@/components/Chip";
import SearchContainer from "@/components/Common/SearchContainer";
import usePagination from "@/hook/usePagination";
import useSearchDebounce from "@/hook/useSearchDebouce";
import Table from "@/components/Table";
import { SessionTableHeaders } from "./table-headers";
import { formatDateTimeUS } from "@/utils/date";

export default function SessionTable() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
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
  const filterOptions = [
    { display: "Card Number", value: "cardNumber" },
    { display: "Plate Number", value: "plateNumber" },
    { display: "Email", value: "customeremail" },
  ];

  const startDate = "";
  const endDate = "";

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "/session",
      pagination.pageSize,
      pagination.pageIndex,
      startDate,
      endDate,
      debounceSearchText,
      filterAttribute,
    ],
    queryFn: () =>
      listSessionAPI(
        pagination.pageSize,
        pagination.pageIndex + 1,
        startDate,
        endDate,
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
        className='cursor-pointer'
        onClick={() => handleClickOpen(session.id)}
      >
        <TableCell>{session.cardNumber}</TableCell>
        <TableCell>{session.plateNumber}</TableCell>
        <TableCell>{formatDateTimeUS(session.timeIn)}</TableCell>
        <TableCell>
          {session.timeOut ? formatDateTimeUS(session.timeOut) : ""}
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
      <div className='flex flex-row gap-3 items-center justify-end w-full'>
        <Button
          variant='outlined'
          color='primary'
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
          <SessionDetail
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            sessionId={selectedSessionId}
          />
        </>
      )}
    </div>
  );
}
