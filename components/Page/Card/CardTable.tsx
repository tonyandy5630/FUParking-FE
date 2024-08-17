"use client";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import dynamic from "next/dynamic";
import { CardProps } from "@/types/card.type";
import { useQuery } from "@tanstack/react-query";
import { listCardAPI } from "@/api/card";
import { useMemo, useState } from "react";
import Loading from "../LoadingPage/Loading";
import SelectFilter from "@/components/Common/selectFilter";
import SearchField from "@/components/Common/searchField";
const EditCard = dynamic(() => import("./EditCard"));
const DeleteCard = dynamic(() => import("./DeleteCard"));
const AddCard = dynamic(() => import("./AddCard"));
const MissCard = dynamic(() => import("./MissCard"));
const ActiveAndDeactiveCard = dynamic(() => import("./ActiveAndDeactiveCard"));
import SearchContainer from "@/components/Common/SearchContainer";
import Chip from "@/components/Chip";
import Table from "@/components/Table";
import usePagination from "@/hook/usePagination";
import { CardTableHeaders } from "./table-headers";
import { useDebounce } from "use-debounce";
import { DEBOUNCE_DELAY } from "@/constant/debounce";

const filterOptions = [
  { display: "Card Number", value: "cardNumber" },
  { display: "Plate Number", value: "plateNumber" },
];

export default function CardTable() {
  const [disable, setDisable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchText] = useDebounce(searchTerm, DEBOUNCE_DELAY);
  const {
    pagination,
    handleChangeRowsPerPage,
    handlePageChange,
    setPagination,
  } = usePagination();
  const [filterAttribute, setFilterAttribute] =
    useState<keyof CardProps>("cardNumber");

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof CardProps);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "/cards",
      pagination.pageSize,
      pagination.pageIndex,
      debounceSearchText,
      filterAttribute,
    ],
    queryFn: () =>
      listCardAPI(
        pagination.pageSize,
        pagination.pageIndex + 1,
        debounceSearchText,
        filterAttribute.toString()
      ),
    retry: 1,
  });

  const handleSearchTextChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const tableRows = useMemo(() => {
    const cards = data?.data.data;
    if (!cards || cards.length === 0) {
      return [];
    }

    return cards.map((card: CardProps) => (
      <TableRow key={card.id}>
        <TableCell>{card.cardNumber}</TableCell>
        <TableCell>{card.plateNumber}</TableCell>
        <TableCell>
          {new Date(card.createdDate).toLocaleDateString("en-GB")}
        </TableCell>
        <TableCell>
          <Chip
            variant={
              card.status === "ACTIVE"
                ? "success"
                : card.status === "MISSING"
                ? "warning"
                : "error"
            }
          >
            {card.status}
          </Chip>
        </TableCell>
        <TableCell>{card.plateNumberSession}</TableCell>
        <TableCell>
          <div className='flex flex-row space-x-2'>
            <EditCard
              value={card.plateNumber}
              id={card.id}
              refetch={refetch}
              setIsPending={setDisable}
              disable={disable}
            />
            <DeleteCard
              id={card.id}
              refetch={refetch}
              setIsPending={setDisable}
              disable={disable}
            />
            {card.status !== "MISSING" ? (
              <>
                <MissCard
                  id={card.id}
                  refetch={refetch}
                  setIsPending={setDisable}
                  disable={disable}
                />
              </>
            ) : (
              <></>
            )}
            <ActiveAndDeactiveCard
              id={card.id}
              isActive={card.status === "ACTIVE"}
              refetch={refetch}
              setIsPending={setDisable}
              disable={disable}
            />
          </div>
        </TableCell>
      </TableRow>
    ));
  }, [data?.data.data]);

  return (
    <div className='flex flex-col gap-5'>
      <SearchContainer>
        <SearchField
          inputValue={searchTerm}
          setInputValue={handleSearchTextChange}
        />
        <SelectFilter
          filterAttribute={filterAttribute}
          setFilterAttribute={handleFilterAttributeChange}
          listFilter={filterOptions}
        />
      </SearchContainer>
      <div className='flex flex-row gap-3 items-center justify-center w-full'>
        <Button
          variant='contained'
          color='primary'
          onClick={() => refetch()}
          disabled={false}
        >
          Refresh
        </Button>
        <AddCard
          refetch={refetch}
          setIsPending={setDisable}
          disable={disable}
        />
      </div>
      {isLoading && <Loading />}
      {isError && <p>Something wrong, please trying again later...</p>}
      {isSuccess && (
        <Table
          onPageChange={handlePageChange}
          onPageSizeChange={handleChangeRowsPerPage}
          pagination={pagination}
          tableHeads={CardTableHeaders}
          tableRows={tableRows}
          isLoading={isLoading}
          totalRecord={data.data.totalRecord}
        />
      )}
    </div>
  );
}
