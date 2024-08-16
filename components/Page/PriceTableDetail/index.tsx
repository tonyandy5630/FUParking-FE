"use client";
import { getPriceItemByTableAPI } from "@/api/price-item";
import SearchContainer from "@/components/Common/SearchContainer";
import SearchField from "@/components/Common/searchField";
import PageTitle from "@/components/PageTitle";
import usePagination from "@/hook/usePagination";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { PriceItemsTableHeaders } from "./table-headers";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Table from "@/components/Table";
import Button from "@mui/material/Button";
import UpdateIcon from "@mui/icons-material/Create";
import UpdatePriceItemDialog from "./UpdatePriceItemDialog";
import AddPriceItemDialog from "./AddPriceItemDialog";
import AddIcon from "@mui/icons-material/Add";

export default function PriceTableDetails({
  priceTableId,
}: {
  priceTableId: string;
}) {
  //* create price item
  const [disableCreateBtn, setDisableCreateBtn] = useState(true);
  const [openCreatePriceItem, setOpenCreatePriceItem] = useState(false);
  //* update price item
  const [disableUpdateBtn, setDisableUpdateBtn] = useState(true);
  const [openUpdatePriceItem, setOpenUpdatePriceItem] = useState(false);

  const [searchText, setSearchText] = useState("");
  const { pagination, handleChangeRowsPerPage, handlePageChange } =
    usePagination();

  const {
    data: priceItemsData,
    isLoading,
    isSuccess,
    isError,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["/get-price-table-items", priceTableId, pagination],
    queryFn: () => getPriceItemByTableAPI(priceTableId, pagination),
  });

  const handleOpenUpdatePriceItems = () => {
    refetch();
    setOpenUpdatePriceItem((prev) => !prev);
  };

  const handleOpenCreatePriceItems = () => {
    refetch();
    setOpenCreatePriceItem((prev) => !prev);
  };

  const tableRows = useMemo(() => {
    if (!isSuccess) {
      return [];
    }
    const priceItems = priceItemsData.data.data;
    if (!priceItems || priceItems.length === 0) {
      return [];
    }

    return priceItems.map((item) => {
      return (
        <TableRow key={item.id}>
          <TableCell>{item.applyFromHour ?? "NaN"}</TableCell>
          <TableCell>{item.applyToHour ?? "NaN"}</TableCell>
          <TableCell>{item.minPrice}</TableCell>
          <TableCell>{item.maxPrice}</TableCell>
        </TableRow>
      );
    });
  }, [priceItemsData]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    const totalPriceItems = priceItemsData.data.totalRecord;

    if (!totalPriceItems) {
      return;
    }

    if (totalPriceItems === 0) {
      return;
    }

    if (totalPriceItems === 1) {
      setDisableCreateBtn(false);
      setDisableUpdateBtn(true);
      return;
    }

    if (totalPriceItems > 1) {
      setDisableCreateBtn(true);
      setDisableUpdateBtn(false);
      return;
    }
  }, [priceItemsData?.data.totalRecord]);

  return (
    <>
      <PageTitle>Price Table Details</PageTitle>
      <SearchContainer>
        <SearchField inputValue={searchText} setInputValue={setSearchText} />
      </SearchContainer>
      <div className='min-w-full flex justify-start items-center py-2 gap-2'>
        <Button
          disabled={disableUpdateBtn}
          variant='outlined'
          onClick={handleOpenUpdatePriceItems}
          className='max-w-40'
        >
          <UpdateIcon /> <span>Update</span>
        </Button>
        <Button
          variant='outlined'
          disabled={disableCreateBtn}
          onClick={handleOpenCreatePriceItems}
        >
          <AddIcon /> <span>Add Price</span>
        </Button>
      </div>
      {!disableUpdateBtn && priceItemsData?.data.data && (
        <UpdatePriceItemDialog
          open={openUpdatePriceItem}
          tablePriceId={priceTableId}
          onOpenChange={handleOpenUpdatePriceItems}
          priceItems={priceItemsData.data.data}
        />
      )}
      {!disableCreateBtn && (
        <AddPriceItemDialog
          open={openCreatePriceItem}
          tablePriceId={priceTableId}
          onOpenChange={handleOpenCreatePriceItems}
        />
      )}

      {isError && <>Something went wrong...</>}
      <Table
        onPageChange={handlePageChange}
        onPageSizeChange={handleChangeRowsPerPage}
        pagination={pagination}
        tableHeads={PriceItemsTableHeaders}
        tableRows={tableRows}
        totalRecord={priceItemsData?.data.totalRecord}
        isLoading={isLoading || isRefetching}
      />
    </>
  );
}
