import Revenue from "./revenue";
import TotalCarParkedToday from "./totalCarParkedToday";
import OccupancyRate from "./occupancyRate";
import TableParkingArea from "./tableParkingArea";
import MidleLeftSideBar1 from "./midleLeftSideBar1";
import MidleLeftChart1 from "./midleRightChart1";
import MidleLeftSideBar2 from "./midleLeftSideBar2";
import MidleLeftChart2 from "./midleRightChart2";

export default function DashBoard() {
  return (
    <div className="gap-10 flex flex-col">
      <div className="flex flex-row flex-wrap w-full justify-between gap-4">
        <Revenue />
        <TotalCarParkedToday />
      </div>
      <div className="w-full bg-white rounded-md border shadow-lg gap-4 flex flex-col p-5">
        <OccupancyRate />
      </div>
      <div className="flex w-full items-start justify-between">
        <MidleLeftSideBar1/>
        <MidleLeftChart1/>
      </div>
      <div className="flex w-full items-start justify-between">
        <MidleLeftSideBar2/>
        <MidleLeftChart2/>
      </div>
      <div className="w-full bg-white rounded-md border shadow-lg gap-4 flex flex-col p-5">
        <div className="pl-20">
          <p className="text-lg font-medium text-slate-600">Parking Area</p>
        </div>
        <TableParkingArea />
      </div>
    </div>
  );
}
