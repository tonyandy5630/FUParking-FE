"use client";
import RevenueChart from "@/components/Page/Revenue/Charts/RevenueChart";
import SelectFilter, { listFilter } from "@/components/Common/selectFilter";
import PageTitle from "@/components/PageTitle";
import { DATE_FILTER } from "@/constant/date-filter";
import { DateFilterType } from "@/types/filter.type";
import toLocaleDate, {
  getLocalISOString,
  getStartEndDateOfTime,
  MomentToDateJS,
} from "@/utils/date";
import { Divider, FormControl, FormLabel, RadioGroup } from "@mui/material";
import React, { useMemo, useState } from "react";
import ParkingAreaDetail from "./ParkingAreaDetail";
import ButtonRadio from "./ParkingAreaDetail/ParkingAreaRadio";
import moment, { Moment } from "moment";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CustomDatePicker from "@/components/DatePicker";

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
  {
    display: "Custom",
    value: DATE_FILTER.custom,
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
  const [showCustom, setShowCustom] = useState(false);
  const handleDateFilterChange = (value: DateFilterType) => {
    setDateFilter(value);
    if (value === DATE_FILTER.custom) {
      setShowCustom(true);
      return;
    } else {
      setShowCustom(false);
    }
    const { startDate, endDate } = getStartEndDateOfTime(
      value as DateFilterType
    );
    const isoStartDate = getLocalISOString(startDate);
    const isoEndDate = getLocalISOString(endDate);
    setApiDateFilter({
      startDate: isoStartDate,
      endDate: isoEndDate,
    });
  };

  const chartDateFilter = useMemo(() => {
    return DateFilters.map((item) => {
      return (
        <ButtonRadio key={item.value} label={item.display} value={item.value} />
      );
    });
  }, [DateFilters]);

  const handleCustomFromDateChange = (e: Moment | null) => {
    const startDate = getLocalISOString(MomentToDateJS(e));
    setApiDateFilter((prev) => ({ ...prev, startDate }));
  };

  const handleCustomEndDateChange = (e: Moment | null) => {
    const endDate = getLocalISOString(MomentToDateJS(e));
    setApiDateFilter((prev) => ({ ...prev, endDate }));
  };

  return (
    <div>
      <PageTitle>Revenue Page</PageTitle>
      <div className='w-full h-full gap-1 flex items-baseline'>
        <p className='text-lg font-bold'>Revenue of Parking System</p>
        <SelectFilter
          variant='standard'
          label='Time Filter'
          filterAttribute={dateFilter}
          listFilter={DateFilters}
          setFilterAttribute={handleDateFilterChange}
        />
      </div>
      {showCustom && (
        <div className='w-full flex gap-4 mt-3'>
          <CustomDatePicker
            label='From'
            value={moment(apiDateFilter.startDate)}
            className='w-52'
            onValueChange={handleCustomFromDateChange}
            maxDate={
              apiDateFilter.endDate !== null
                ? moment(apiDateFilter.endDate)
                : undefined
            }
          />
          <CustomDatePicker
            label='To'
            value={moment(apiDateFilter.endDate)}
            onValueChange={handleCustomEndDateChange}
            className='w-52'
            minDate={
              apiDateFilter.endDate !== null
                ? moment(apiDateFilter.startDate)
                : undefined
            }
          />
        </div>
      )}
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
