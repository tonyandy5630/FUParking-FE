"use client";
import RevenueChart from "@/components/Page/Revenue/Charts/RevenueChart";
import SelectFilter, { listFilter } from "@/components/Common/selectFilter";
import PageTitle from "@/components/PageTitle";
import { DATE_FILTER } from "@/constant/date-filter";
import { DateFilterType } from "@/types/filter.type";
import { getLocalISOString, getStartEndDateOfTime } from "@/utils/date";
import { Divider } from "@mui/material";
import React, { useState } from "react";
import ParkingAreaDetail from "./ParkingAreaDetail";

type ApiDateFilterType = {
  startDate: string;
  endDate: string;
};
const DateFilters: listFilter<DateFilterType>[] = [
  {
    display: "Today",
    value: DATE_FILTER.today,
  },
  {
    display: "This week",
    value: DATE_FILTER.week,
  },
  {
    display: "This month",
    value: DATE_FILTER.month,
  },
  {
    display: "This year",
    value: DATE_FILTER.year,
  },
];
const { startDate, endDate } = getStartEndDateOfTime(DATE_FILTER.month);
const initDateFilterValue = DATE_FILTER.month;
const initDateFilter = {
  startDate: getLocalISOString(startDate),
  endDate: getLocalISOString(endDate),
};
export default function RevenuePage() {
  const [dateFilter, setDateFilter] = useState(initDateFilterValue);
  const [apiDateFilter, setApiDateFilter] =
    useState<ApiDateFilterType>(initDateFilter);

  const handleDateFilterChange = (value: DateFilterType) => {
    setDateFilter(value);
    const { startDate, endDate } = getStartEndDateOfTime(value);
    const isoStartDate = getLocalISOString(startDate);
    const isoEndDate = getLocalISOString(endDate);
    setApiDateFilter({
      startDate: isoStartDate,
      endDate: isoEndDate,
    });
  };

  return (
    <div>
      <PageTitle>Revenue Page</PageTitle>
      <div className='w-full h-full flex gap-1 items-center'>
        <p className='text-lg font-bold'>Revenue of Parking System in</p>
        <SelectFilter
          filterAttribute={dateFilter}
          listFilter={DateFilters}
          setFilterAttribute={handleDateFilterChange}
          className='min-w-24'
        />
      </div>
      <RevenueChart
        startDate={apiDateFilter.startDate}
        endDate={apiDateFilter.endDate}
      />
      <Divider />
      <ParkingAreaDetail
        startDate={apiDateFilter.startDate}
        endDate={apiDateFilter.endDate}
      />
    </div>
  );
}
