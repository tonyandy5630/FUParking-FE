import { Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
const ParkingAreaRadio = dynamic(() => import("./ParkingAreaRadio"));
import { useQuery } from "@tanstack/react-query";
import {
  getAllParkingAreaAPI,
  getParkingAreaRevenueAPI,
} from "@/api/parkingArea";
import dynamic from "next/dynamic";
import Loading from "../../LoadingPage/Loading";
const ParkingAreaDetailTable = dynamic(
  () => import("./ParkingAreaDetailTable")
);

interface Props {
  startDate: string;
  endDate: string;
}
export default function ParkingAreaDetail({ startDate, endDate }: Props) {
  const [selectedParkingArea, setSelectedParkingArea] = useState("");
  const {
    data: parkingAreaOptionData,
    isLoading: isLoadingParkingAreaData,
    isError: isErrorParkingAreaData,
  } = useQuery({
    queryKey: ["get-all-parking-area-revenue-page"],
    queryFn: getAllParkingAreaAPI,
  });

  const {
    data: parkingAreaDetailData,
    isLoading: isLoadingParkingAreaDetailData,
    isError: isErrorParkingAreaDetailData,
  } = useQuery({
    queryKey: [
      "parking-area-revenue-detail",
      selectedParkingArea,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getParkingAreaRevenueAPI(selectedParkingArea, startDate, endDate),
    enabled: selectedParkingArea !== "",
  });

  const handleSelectedParkingAreaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedParkingArea((event.target as HTMLInputElement).value);
  };

  const parkingAreaRadios = useMemo(() => {
    if (isErrorParkingAreaData) {
      return <p>Error loading parking area</p>;
    }
    const parkingAreas = parkingAreaOptionData?.data.data;

    if (!parkingAreas) {
      return [];
    }

    return parkingAreas
      .filter((item) => item.name !== "VIRTUAL")
      .map((item) => (
        <FormControlLabel
          key={item.id}
          value={item.id}
          control={<ParkingAreaRadio label={item.name} />}
          label=''
        />
      ));
  }, [parkingAreaOptionData?.data.data, isErrorParkingAreaData]);

  return (
    <div className='flex justify-start p-2 w-full h-full items-start flex-col'>
      <Typography variant='h5' sx={{ alignSelf: "center" }}>
        Parking Area
      </Typography>
      <FormControl className='min-h-16 flex justify-center'>
        <RadioGroup
          aria-labelledby='parking-area-radios'
          name='parking-area-radios'
          row
          onChange={handleSelectedParkingAreaChange}
        >
          {parkingAreaRadios}
        </RadioGroup>
      </FormControl>
      <div className='min-h-44 w-full'>
        {isLoadingParkingAreaDetailData && <Loading />}
        {selectedParkingArea !== "" && (
          <ParkingAreaDetailTable data={parkingAreaDetailData?.data.data} />
        )}
      </div>
    </div>
  );
}
