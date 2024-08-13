"use client";
import TransactionTable from "./TransactionTable";

export default function Transaction() {
  return (
    <>
      <h1 className='text-2xl font-semibold text-center'>Transaction List</h1>
      <TransactionTable />
    </>
  );
}
