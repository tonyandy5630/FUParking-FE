"use client";
import { getTotalRevenue } from "@/api/statistic";
import porter from "@/public/Bai_poster.png";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function Revenue() {
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: ["/statistic/revenue"],
    queryFn: () => getTotalRevenue(),
    retry: 1,
  });

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${time} ${date}`;
  };
  return (
    <div className="flex rounded-md border shadow-lg bg-white items-center justify-around pl-10 pr-10 gap-10 h-full">
      <div className="flex flex-col items-start justify-center gap-2">
        <p className="text-wrap">Total revenue</p>
        <p className="text-3xl font-extrabold">
          {Intl.NumberFormat("de-DE").format(data?.data.data)}
        </p>
        <p style={{ color: "#D9D9D9" }}>Update: {getCurrentDateTime()}</p>
      </div>
      <p>
        <Image src={porter} alt="Total revenue" width={200} height={142} />
      </p>
    </div>
  );
}
