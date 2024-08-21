"use client";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import { useQuery } from "@tanstack/react-query";
import {
  getAverageSessionDurationPerDay,
  getTotalCustomers,
  getTotalVehicles,
} from "@/api/statistic";

export default function OccupancyRate() {
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: ["/statistic/session/average"],
    queryFn: () => getAverageSessionDurationPerDay(),
    retry: 1,
  });

  const {
    data: data1,
    isLoading: isLoading1,
    isError: isError1,
    isSuccess: isSuccess1,
    error: error1,
    refetch: refetch1,
  } = useQuery({
    queryKey: ["/statistic/customer"],
    queryFn: () => getTotalCustomers(),
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
    queryKey: ["/statistic/vehicle"],
    queryFn: () => getTotalVehicles(),
    retry: 1,
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between">
      <div className="flex flex-col gap-2">
        <p>Average session duration per day</p>
        <p className="font-extrabold">{data?.data.data} hours</p>
      </div>
      <div className="h-px w-full bg-gray-300 sm:hidden mt-5 mb-5"></div>
      <div className="h-16 w-px bg-gray-300 hidden sm:block"></div>
      <div className="flex flex-col gap-2">
        <p>Total customers</p>
        <div className="flex items-center justify-between gap-5">
          <div className="flex">
            <SupervisorAccountIcon />
            <p className="ml-1 font-extrabold">
              {data1?.data.data.totalCustomer}
            </p>
          </div>
          <div className="flex items-center justify-around">
            <KeyboardDoubleArrowUpRoundedIcon style={{ color: "#00A676" }} />
            <div className="flex">
              <p className="font-extrabold">
                {data1?.data.data.totalNewCustomerInMonth}
              </p>
              <p className="pl-1">in month</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-gray-300 sm:hidden mt-5 mb-5"></div>
      <div className="h-16 w-px bg-gray-300 hidden sm:block"></div>
      <div className="flex flex-col gap-2">
        <p>Total vehicles</p>
        <div className="flex items-center justify-between gap-5">
          <div className="flex">
            <TwoWheelerRoundedIcon />
            <p className="ml-1 font-extrabold">
              {data2?.data.data.totalVehicle}
            </p>
          </div>
          <div className="flex">
            <KeyboardDoubleArrowUpRoundedIcon style={{ color: "#00A676" }} />
            <div className="flex">
              <p className="font-extrabold">
                {data2?.data.data.totalNewResgisterVehicleInMonth}
              </p>
              <p className="pl-1">in month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
