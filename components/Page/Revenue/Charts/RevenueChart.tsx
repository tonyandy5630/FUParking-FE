"use client";
import React, { useMemo } from "react";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import {
  BarPlot,
  ChartsLegend,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
  MarkPlot,
} from "@mui/x-charts";
import { useQuery } from "@tanstack/react-query";
import { getAllParkingAreaRevenueAPI } from "@/api/statistic";
import LoadingChart from "./Loading";

interface Props {
  startDate: string;
  endDate: string;
}

export default function RevenueChart({ startDate, endDate }: Props) {
  const {
    data: revenueData,
    isLoading: isLoadingRevenueData,
    isError: isErrorRevenueData,
  } = useQuery({
    queryKey: ["/revenue-parking-area", startDate, endDate],
    queryFn: () => getAllParkingAreaRevenueAPI(startDate, endDate),
    enabled: true, //* waiting for api
    retry: 1,
  });

  const allParkingAreaRevenue = useMemo(() => {
    const allRevenue = revenueData?.data.data;

    if (!allRevenue) {
      return [];
    }

    return allRevenue
      .filter((item) => item.parkingArea.name !== "VIRTUAL")
      .map((rev) => {
        //* calculate avg of wallet revenue and other revenue
        const {
          averageRevenue,
          otherRevenue,
          walletRevenue,
          parkingArea,
          totalRevenue,
        } = rev;
        return {
          walletRevenue,
          otherRevenue,
          parkingArea: parkingArea.name,
          totalRevenue,
          averageRevenue,
        };
      });
  }, [revenueData?.data.data]);

  return (
    <>
      <div className='w-[20rem] min-w-full h-[20rem] flex justify-center items-center mb-2'>
        {isLoadingRevenueData && <LoadingChart />}
        {!isLoadingRevenueData && isErrorRevenueData && (
          <p className='text-destructive font-bold'>Error loading data</p>
        )}
        {!isLoadingRevenueData && allParkingAreaRevenue.length === 0 && (
          <p>No data found</p>
        )}
        {!isLoadingRevenueData && allParkingAreaRevenue.length > 0 && (
          <ResponsiveChartContainer
            series={[
              {
                type: "bar",
                dataKey: "walletRevenue",
                label: "Wallet",
                stack: "wallet",
              },
              {
                type: "bar",
                dataKey: "otherRevenue",
                label: "Other",
                stack: "wallet",
              },
              {
                type: "bar",
                label: "Average Revenue",
                dataKey: "averageRevenue",
              },
            ]}
            dataset={allParkingAreaRevenue}
            xAxis={[
              {
                dataKey: "parkingArea",
                scaleType: "band",
                id: "x-axis-id",
              },
            ]}
            margin={{ left: 80, bottom: 80 }}
          >
            <BarPlot />
            <LinePlot />
            <MarkPlot />
            <ChartsTooltip />
            <ChartsXAxis
              label='Parking Area'
              tickPlacement='middle'
              position='bottom'
              axisId='x-axis-id'
            />
            <ChartsYAxis />
            <ChartsLegend
              direction='row'
              position={{ vertical: "bottom", horizontal: "middle" }}
              padding={{ top: 40 }}
            />
          </ResponsiveChartContainer>
        )}
      </div>
    </>
  );
}
