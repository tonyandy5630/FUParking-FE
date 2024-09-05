"use client";

import { getNumberCheckInCheckOut } from "@/api/statistic";
import { useQuery } from "@tanstack/react-query";

export default function MidleLeftSideBar1() {
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: ["/statistic/session/checkin-checkout"],
    queryFn: () => getNumberCheckInCheckOut(),
    retry: 1,
  });
  return (
    <div className="flex-col min-w-80 min-h-64 bg-white rounded-md border shadow-lg flex p-5 items-start justify-around">
      <div className="flex flex-col items-start justify-center gap-4">
        <p>Number of vehicles in parking today</p>
        <p className="font-extrabold">
          {data?.data.data.totalCheckInToday ?? 0}
        </p>
      </div>
      <div className="w-full h-px" style={{ backgroundColor: "#D9D9D9" }}></div>
      <div className="flex flex-col items-start justify-center gap-4">
        <p>Number of vehicles had check out today</p>
        <p className="font-extrabold">
          {data?.data.data.totalCheckOutToday ?? 0}
        </p>
      </div>
    </div>
  );
}
