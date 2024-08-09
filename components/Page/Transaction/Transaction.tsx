import TransactionTable from "./TransactionTable";

export default function Transaction() {
    return (
        <div className='w-full bg-white rounded-md border shadow-lg gap-4 flex flex-col p-5'>
            <h1 className='text-2xl font-semibold text-center'>Transaction List</h1>
            <TransactionTable />
        </div>
    )
}