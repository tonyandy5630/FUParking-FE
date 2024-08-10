import ParkingAreaTable from "./ParkingAreaTable";

export default function ParkingArea() {
    return (
        <div className='w-full bg-white rounded-md border shadow-lg gap-4 flex flex-col p-5'>
            <h1 className='text-2xl font-semibold text-center'>Parking Area List</h1>
            <ParkingAreaTable />
        </div>
    )
}