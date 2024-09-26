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
const DeleteCard = dynamic(() => import("./DeleteCard"));
const AddCard = dynamic(() => import("./Action/AddCard"));
const MissCard = dynamic(() => import("./MissCard"));
const ActiveAndDeactiveCard = dynamic(() => import("./ActiveAndDeactiveCard"));
import SearchContainer from "@/components/Common/SearchContainer";
import Chip from "@/components/Chip";
import Table from "@/components/Table";
import usePagination from "@/hook/usePagination";
import { CardTableHeaders } from "./table-headers";
import useSearchDebounce from "@/hook/useSearchDebouce";
import CardDetail from "./CardDetail";
import useHandleDialog from "@/hook/useHandleDialog";

const filterOptions = [{ display: "Card Number", value: "cardNumber" }];

export default function CardTable() {
  const [disable, setDisable] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardProps | null>(null);
  const { openDialog: openCreateCard, handleToggleDialog: toggleCreateCard } =
    useHandleDialog(false);
  const handleRowClick = (card: CardProps) => {
    setSelectedCard(card);
    setShowDetail(true);
  };

  const {
    pagination,
    handleChangeRowsPerPage,
    handlePageChange,
    setPagination,
    goToFirstPage,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);
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

  const tableRows = useMemo(() => {
    const cards = data?.data.data;
    if (!cards || cards.length === 0) {
      return [];
    }

    return cards.map((card: CardProps) => (
      <TableRow key={card.id} hover={true}>
        <TableCell
          onClick={() => handleRowClick(card)}
          className="cursor-pointer"
        >
          {card.cardNumber}
        </TableCell>

        <TableCell
          onClick={() => handleRowClick(card)}
          className="cursor-pointer"
        >
          <Chip
            variant={
              card.status === "ACTIVE"
                ? "success"
                : card.status === "MISSING" || "INACTIVE"
                ? "warning"
                : "error"
            }
          >
            {card.status}
          </Chip>
        </TableCell>
        <TableCell
          onClick={() => handleRowClick(card)}
          className="cursor-pointer"
        >
          <Chip
            variant={
              card.isInUse === true
                ? "success"
                : card.isInUse === false
                ? "warning"
                : "error"
            }
          >
            {card.isInUse ? "In Use" : "Not In Use"}
          </Chip>
        </TableCell>
        <TableCell>
          <div className="flex flex-row space-x-2">
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
    <div className="flex flex-col gap-5">
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
      <div className="flex flex-row gap-3 items-center justify-end w-full">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => refetch()}
          disabled={false}
        >
          Refresh
        </Button>
        {openCreateCard && (
          <AddCard
            onOpenChange={toggleCreateCard}
            refetch={refetch}
            open={openCreateCard}
            onClose={toggleCreateCard}
          />
        )}
        <Button variant="outlined" color="primary" onClick={toggleCreateCard}>
          Add Card
        </Button>
      </div>
      {isLoading && <Loading />}
      {isError && <p>Something wrong, please trying again later...</p>}
      {isSuccess && (
        <>
          <Table
            onPageChange={handlePageChange}
            onPageSizeChange={handleChangeRowsPerPage}
            pagination={pagination}
            tableHeads={CardTableHeaders}
            tableRows={tableRows}
            isLoading={isLoading}
            totalRecord={data.data.totalRecord}
          />
          {showDetail && selectedCard && (
            <CardDetail
              isOpen={showDetail}
              setIsOpen={setShowDetail}
              CardProps={selectedCard}
            />
          )}
        </>
      )}
    </div>
  );
}
