"use client";
import { getAllFeedbacksAPI } from "@/api/feedback";
import SearchContainer from "@/components/Common/SearchContainer";
import SearchField from "@/components/Common/searchField";
import SelectFilter, { listFilter } from "@/components/Common/selectFilter";
import PageTitle from "@/components/PageTitle";
const Table = dynamic(() => import("@/components/Table"));
import usePagination from "@/hook/usePagination";
import toLocaleDate from "@/utils/date";
const TableCell = dynamic(() => import("@mui/material/TableCell"));
const TableRow = dynamic(() => import("@mui/material/TableRow"));
import Tooltip from "@mui/material/Tooltip";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { FeedbackTableHeaders } from "./table-headers";
import wrapText from "@/utils/text";
import { getAllParkingAreaAPI } from "@/api/parkingArea";
import useSearchDebounce from "@/hook/useSearchDebouce";
import dynamic from "next/dynamic";
import Loading from "../LoadingPage/Loading";
import { Button } from "@mui/material";

// const FILTER: listFilter[] = [
//   {
//     display: "Customer name",
//     value: "cusName",
//   },
// ];

const ALL_PARKING_AREA = "ALL PARKING AREA";
export default function FeedbackPage() {
  const [filter, setFilter] = useState("");
  const [parkingArea, setParkingArea] = useState("");
  const {
    pagination,
    setPagination,
    handlePageChange,
    handleChangeRowsPerPage,
    goToFirstPage,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);

  const { data: parkingAreasData, isLoading: parkingAreaLoading } = useQuery({
    queryKey: ["/feedback-select-parking-areas"],
    queryFn: getAllParkingAreaAPI,
  });

  const {
    data: feedbackData,
    isSuccess,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "/manager-get-all-feedback",
      pagination,
      debounceSearchText,
      parkingArea,
    ],
    queryFn: () =>
      getAllFeedbacksAPI(pagination, {
        cusName: debounceSearchText,
        parkName: parkingArea === ALL_PARKING_AREA ? "" : parkingArea,
      }),
  });

  const parkingAreasOptions = useMemo(() => {
    const parkingAreas = parkingAreasData?.data.data;

    if (!parkingAreas || parkingAreas.length === 0) {
      return [];
    }
    let allOptions: listFilter[] = [
      {
        display: "All Parking Area",
        value: ALL_PARKING_AREA,
      },
    ];

    parkingAreas.map((item) => {
      const options: listFilter = {
        display: item.name,
        value: item.id,
      };

      allOptions.push(options);
      return options;
    });

    return allOptions;
  }, [parkingAreasData]);

  // const handleFilterChange = (value: string) => {
  //   setFilter(value);
  //   setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  // };

  const handleParkingAreaChange = (value: string) => {
    setParkingArea(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const tableRows = useMemo(() => {
    const feedbacks = feedbackData?.data.data;
    if (!feedbacks || feedbacks.length === 0) {
      return [];
    }

    return feedbacks.map((item) => {
      return (
        <TableRow key={item.id}>
          <TableCell>{item.title}</TableCell>
          <TableCell>{item.customerName}</TableCell>
          <TableCell>{item.parkingAreaName}</TableCell>
          <Tooltip title={item.description} placement="bottom-start">
            <TableCell>{wrapText(item.description, 20)}</TableCell>
          </Tooltip>
          <TableCell>{toLocaleDate(item.createdDate)}</TableCell>
        </TableRow>
      );
    });
  }, [feedbackData]);

  return (
    <>
      <PageTitle>Feedback Page</PageTitle>
      <SearchContainer>
        <SearchField
          inputValue={searchText}
          setInputValue={handleSearchTextChange}
          placeholder="Search Customer Name"
        />
        <SelectFilter
          listFilter={parkingAreasOptions}
          filterAttribute={parkingArea}
          setFilterAttribute={handleParkingAreaChange}
          label="Parking Area"
        />
      </SearchContainer>
      <div className="flex flex-row gap-3 items-center justify-end w-full py-2">
        <Button variant="outlined" color="primary" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      {isLoading && <Loading />}
      {isSuccess && (
        <Table
          onPageChange={handlePageChange}
          onPageSizeChange={handleChangeRowsPerPage}
          pagination={pagination}
          tableHeads={FeedbackTableHeaders}
          tableRows={tableRows}
          totalRecord={feedbackData?.data.totalRecord}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
