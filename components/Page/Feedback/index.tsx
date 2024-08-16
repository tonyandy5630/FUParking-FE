"use client";
import { getAllFeedbacksAPI } from "@/api/feedback";
import SearchContainer from "@/components/Common/SearchContainer";
import SearchField from "@/components/Common/searchField";
import SelectFilter, { listFilter } from "@/components/Common/selectFilter";
import PageTitle from "@/components/PageTitle";
import Table from "@/components/Table";
import { DEBOUNCE_DELAY } from "@/constant/debounce";
import usePagination from "@/hook/usePagination";
import toLocaleDate from "@/utils/date";
import { TableCell, TableRow, Tooltip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { FeedbackTableHeaders } from "./table-headers";
import wrapText from "@/utils/text";
import { getAllParkingAreaAPI } from "@/api/parkingArea";

const FILTER: listFilter[] = [
  {
    display: "Filter 1",
    value: "filter1",
  },
];
export default function FeedbackPage() {
  const [searchText, setSearchText] = useState("");
  const [debounceSearchText] = useDebounce(searchText, DEBOUNCE_DELAY);
  const [filter, setFilter] = useState("");
  const [parkingArea, setParkingArea] = useState("");
  const {
    pagination,
    setPagination,
    handlePageChange,
    handleChangeRowsPerPage,
  } = usePagination();

  const { data: parkingAreasData, isLoading: parkingAreaLoading } = useQuery({
    queryKey: ["/feedback-select-parking-areas"],
    queryFn: getAllParkingAreaAPI,
  });

  const {
    data: feedbackData,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["/manager-get-all-feedback", pagination],
    queryFn: () => getAllFeedbacksAPI(pagination),
  });

  const parkingAreasOptions = useMemo(() => {
    const parkingAreas = parkingAreasData?.data.data;

    if (!parkingAreas || parkingAreas.length === 0) {
      return [];
    }

    return parkingAreas.map((item) => {
      const options: listFilter = {
        display: item.name,
        value: item.id,
      };
      return options;
    });
  }, [parkingAreasData]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

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
          <Tooltip title={item.description} placement='bottom-start'>
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
        <SearchField inputValue={searchText} setInputValue={setSearchText} />
        <SelectFilter
          listFilter={parkingAreasOptions}
          filterAttribute={parkingArea}
          setFilterAttribute={handleParkingAreaChange}
          label='Parking Area'
        />
        <SelectFilter
          listFilter={FILTER}
          filterAttribute={filter}
          setFilterAttribute={handleFilterChange}
        />
      </SearchContainer>
      <Table
        onPageChange={handlePageChange}
        onPageSizeChange={handleChangeRowsPerPage}
        pagination={pagination}
        tableHeads={FeedbackTableHeaders}
        tableRows={tableRows}
        totalRecord={feedbackData?.data.totalRecord}
        isLoading={isLoading}
      />
    </>
  );
}
