"use client";
import { listSessionAPI } from "@/api/session";
import SearchField from "@/components/Common/searchField";
import SelectFilter from "@/components/Common/selectFilter";
import { CardProps } from "@/types/card.type";
import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loading from "../LoadingPage/Loading";
import { SessionProps } from "@/types/session.type";
import SessionDetail from "./SessionDetail";
import Chip from "@/components/Chip";
import SearchContainer from "@/components/Common/SearchContainer";

export default function SessionTable() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const keys = [
    "Card Number",
    "Plate Number",
    "Time In",
    "Time Out",
    "Vehicle Type",
    "Payment Method",
    "Customer Email",
    "Status",
    "Parking Location",
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [disable, setDisable] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAttribute, setFilterAttribute] =
    useState<keyof CardProps>("cardNumber");
  const filterOptions = [
    { display: "Card Number", value: "cardNumber" },
    { display: "Plate Number", value: "plateNumber" },
    { display: "Email", value: "customeremail" },
  ];
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  const startDate = "";
  const endDate = "";
  const formatDateTimeVN = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "/session",
      rowsPerPage,
      page,
      startDate,
      endDate,
      searchTerm,
      filterAttribute,
    ],
    queryFn: () =>
      listSessionAPI(
        rowsPerPage,
        page,
        startDate,
        endDate,
        searchTerm,
        filterAttribute.toString()
      ),
    retry: 1,
  });

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof CardProps);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  const handleClickOpen = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedSessionId(null);
  };

  return (
    <div className='flex flex-col gap-5'>
      <SearchContainer>
        <SearchField inputValue={inputValue} setInputValue={setInputValue} />
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {keys.map((key) => (
                  <TableCell
                    key={key}
                    className='text-left text-sm font-medium text-slate-600'
                  >
                    {key}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data.data?.map((session: SessionProps) => (
                <TableRow
                  key={session.id}
                  hover={true}
                  className='cursor-pointer'
                  onClick={() => handleClickOpen(session.id)}
                >
                  <TableCell>{session.cardNumber}</TableCell>
                  <TableCell>{session.plateNumber}</TableCell>
                  <TableCell>{formatDateTimeVN(session.timeIn)}</TableCell>
                  <TableCell>
                    {session.timeOut ? formatDateTimeVN(session.timeOut) : ""}
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
              ))}
            </TableBody>

            <SessionDetail
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              sessionId={selectedSessionId}
            />
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={data?.data.totalRecord || -1}
            page={page - 1}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </div>
  );
}
