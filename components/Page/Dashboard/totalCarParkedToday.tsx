"use client";

import { getTotalVehicleParkedToday } from "@/api/statistic";
import { useQuery } from "@tanstack/react-query";

export default function TotalCarParkedToday() {
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: ["/statistic/totalVehicleParkedToday"],
    queryFn: () => getTotalVehicleParkedToday(),
    retry: 1,
  });

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${time} ${date}`;
  };

  return (
    <div className='flex flex-col items-end justify-center rounded-md border shadow-lg bg-white h-full gap-2 pr-5 pl-5'>
      <p>Total vehicles in parking</p>
      <p className='text-3xl font-extrabold'>{data?.data.data}</p>
      <p style={{ color: "#D9D9D9" }}>Last update at: {getCurrentDateTime()}</p>
    </div>
  );
}
