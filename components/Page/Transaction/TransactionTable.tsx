"use client";
import { listTransactionAPI } from "@/api/transaction";
import SearchField from "@/components/Common/searchField";
import SelectFilter from "@/components/Common/selectFilter";
import { useQuery } from "@tanstack/react-query";
import { lazy, useMemo, useState } from "react";
const Loading = lazy(() => import("../LoadingPage/Loading"));
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { TransactionWithFillerProps } from "@/types/transaction.type";
import SearchContainer from "@/components/Common/SearchContainer";
import usePagination from "@/hook/usePagination";
import { useDebounce } from "use-debounce";
import { DEBOUNCE_DELAY } from "@/constant/debounce";
const Table = dynamic(() => import("@/components/Table"));
import { TransactionTableHeaders } from "./table-headers";
import Chip from "@/components/Chip";
import dynamic from "next/dynamic";
import useSearchDebounce from "@/hook/useSearchDebouce";
import { Button } from "@mui/material";

type FilterOption = {
  display: string;
  value: string;
};
const filterOptions: FilterOption[] = [
  { display: "Email", value: "email" },
  { display: "Package Name", value: "packageName" },
];

export default function TransactionTable() {
  const {
    handleChangeRowsPerPage,
    handlePageChange,
    pagination,
    setPagination,
    goToFirstPage,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);

  const [filterAttribute, setFilterAttribute] =
    useState<keyof TransactionWithFillerProps>("email");

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof TransactionWithFillerProps);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "/transactions",
      pagination.pageSize,
      pagination.pageIndex,
      debounceSearchText,
      filterAttribute,
    ],
    queryFn: () =>
      listTransactionAPI(
        pagination.pageSize,
        pagination.pageIndex + 1,
        debounceSearchText,
        filterAttribute
      ),
    retry: 1,
  });

  const tableRows = useMemo(() => {
    const transactions = data?.data.data;
    if (!transactions || transactions.length === 0) {
      return [];
    }

    return transactions.map((transaction: TransactionWithFillerProps) => (
      <TableRow key={transaction.id}>
        <TableCell>
          {transaction.email === "" ? "None" : transaction.email}
        </TableCell>
        <TableCell>
          {transaction.walletType === "" ? "None" : transaction.walletType}
        </TableCell>
        <TableCell>{transaction.paymentMethod}</TableCell>
        <TableCell>
          {transaction.packageName === "" ? "None" : transaction.packageName}
        </TableCell>
        <TableCell>
          {transaction.amount === "" ? "None" : transaction.amount}
        </TableCell>
        <TableCell>{transaction.transactionDescription}</TableCell>
        <TableCell>
          <Chip
            variant={
              transaction.transactionStatus === "SUCCEED" ? "success" : "error"
            }
          >
            {transaction.transactionStatus}
          </Chip>
        </TableCell>
        <TableCell>
          {new Date(transaction.createdDate).toLocaleDateString("en-GB")}
        </TableCell>
      </TableRow>
    ));
  }, [data?.data.data]);

  return (
    <>
      <SearchContainer>
        <SelectFilter
          filterAttribute={filterAttribute}
          setFilterAttribute={handleFilterAttributeChange}
          listFilter={filterOptions}
        />
        <SearchField
          inputValue={searchText}
          setInputValue={handleSearchTextChange}
        />
      </SearchContainer>
      <div className="flex flex-row gap-3 items-center justify-end w-full py-2">
        <Button variant="outlined" color="primary" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      {isLoading && <Loading />}
      {isError && <p>Something wrong, please trying again later...</p>}
      {isSuccess &&
        (data.data.totalRecord === 0 ? (
          <p>There is no data to show.</p>
        ) : (
          <Table
            onPageChange={handlePageChange}
            onPageSizeChange={handleChangeRowsPerPage}
            pagination={pagination}
            tableHeads={TransactionTableHeaders}
            tableRows={tableRows}
            isLoading={isLoading}
            totalRecord={data.data.totalRecord}
          />
        ))}
    </>
  );
}
