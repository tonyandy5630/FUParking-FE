import Revenue from './revenue';
import TotalCarParkedToday from './totalCarParkedToday';
import OccupancyRate from './occupancyRate';
import TableParkingArea from './tableParkingArea';

export default function DashBoard() {
    return (
        <div className='gap-10 flex flex-col'>
            <div className='flex flex-row flex-wrap w-full justify-between gap-4'>
                <Revenue />
                <TotalCarParkedToday />
                <OccupancyRate />
            </div>
            <div className='w-full bg-white rounded-md border shadow-lg gap-4 flex flex-col p-5'>
                <div className='pl-20'>
                    <p className='text-lg font-medium text-slate-600'>Parking Area</p>
                </div>
                <TableParkingArea />
            </div>
        </div>
    );
}