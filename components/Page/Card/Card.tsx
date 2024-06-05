import CardTable from "./CardTable";

export default function Card() {
    return (
        <div className='w-full bg-white rounded-md border shadow-lg gap-4 flex flex-col p-5'>
            <h1 className='text-2xl font-semibold text-center'>Card List</h1>
            <CardTable />
        </div>
    )
}