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
      <div className="flex sm:flex-row flex-col w-full justify-between items-stretch gap-5">
        <div className="sm:w-3/5 w-full flex-shrink-0">
          <Revenue />
        </div>
        <div className="sm:w-1/3 w-full flex-shrink-0">
          <TotalCarParkedToday />
        </div>
      </div>
      <div className="w-full bg-white rounded-md border shadow-lg gap-4 flex flex-col p-5">
        <OccupancyRate />
      </div>
      <div className="flex w-full items-start justify-between">
        <MidleLeftSideBar1 />
        <MidleLeftChart1 />
      </div>
      <div className="flex w-full items-start justify-between">
        <MidleLeftSideBar2 />
        <MidleLeftChart2 />
      </div>
    </div>
  );
}
