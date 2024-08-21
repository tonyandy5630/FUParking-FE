"use client";

import React, { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { getRevenueEachParkingArea, getStatistic2 } from "@/api/statistic";

Chart.register(...registerables);

export default function MidleLeftChart2() {
  const chartRef1 = useRef<HTMLCanvasElement | null>(null);
  const chartRef2 = useRef<HTMLCanvasElement | null>(null);

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: ["/statistic/payment/method"],
    queryFn: () => getStatistic2(),
    retry: 1,
  });

  const {
    data: data2,
    isLoading: isLoading2,
    isError: isError2,
    isSuccess: isSuccess2,
    error: error2,
    refetch: refetch2,
  } = useQuery({
    queryKey: ["/statistic/parkingarea/renvenue"],
    queryFn: () => getRevenueEachParkingArea(),
    retry: 1,
  });

  useEffect(() => {
    const ctx1 = chartRef1.current?.getContext("2d");
    const ctx2 = chartRef2.current?.getContext("2d");
    if (!ctx1 || !ctx2) return;

    const paymentDataMap = new Map(
      data?.data.data?.map((item: any) => {
        return [item.paymentMethod, item.totalPayment];
      })
    );

    const paymentData = {
      labels: Array.from(paymentDataMap.keys()),
      datasets: [
        {
          label: "Transactions",
          data: Array.from(paymentDataMap.values()),
          backgroundColor: [
            "rgba(255, 180, 0, 0.8)",
            "rgba(237, 125, 49, 0.8)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const parkingAreaNames =
      data2?.data.data.map((item: any) => item.parkingArea.name) ?? [];
    const parkingAreaRevenues =
      data2?.data.data.map((item: any) => item.revenue ?? 0) ?? [];

    const revenueData = {
      labels: parkingAreaNames,
      datasets: [
        {
          label: "Revenue",
          data: parkingAreaRevenues,
          backgroundColor: [
            "rgba(255, 180, 0, 0.8)",
            "rgba(237, 125, 49, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 159, 64, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 99, 132, 0.8)",
            "rgba(201, 203, 207, 0.8)",
            "rgba(255, 205, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const config1: ChartConfiguration<"pie"> = {
      type: "pie",
      data: paymentData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Payment Method Usage Ratio Chart in the Month",
            color: "black",
          },
        },
      },
    };

    const config2: ChartConfiguration<"pie"> = {
      type: "pie",
      data: revenueData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Revenue Share Chart Across Parking Areas in the Month",
            color: "black",
          },
        },
      },
    };

    const myChart1 = new Chart(ctx1, config1);
    const myChart2 = new Chart(ctx2, config2);

    return () => {
      myChart1.destroy();
      myChart2.destroy();
    };
  }, [data, data2, isLoading, isError, isSuccess, error]);

  return (
    <div
      className="min-h-64 max-h-80 bg-white rounded-md border shadow-lg gap-4 flex items-center justify-around p-5"
      style={{ minWidth: "720px" }}
    >
      <div>
        <canvas ref={chartRef1}></canvas>
      </div>
      <div className="h-40 w-px" style={{ backgroundColor: "#D9D9D9" }}></div>
      <div>
        <canvas ref={chartRef2}></canvas>
      </div>
    </div>
  );
}
