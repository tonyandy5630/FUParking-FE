import { Skeleton } from "@mui/material";
import React, { useMemo } from "react";

export default function LoadingChart() {
  const loadingComp = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => (
      <Skeleton
        key={i}
        width={100}
        height={randomIntFromInterval(130, 300)}
        sx={{ transform: "unset" }}
      />
    ));
  }, []);

  return (
    <div className='w-full border-b border-l p-2 flex items-end gap-2'>
      {loadingComp}
    </div>
  );
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
