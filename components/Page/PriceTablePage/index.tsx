"use client";
import {
  deletePriceTableAPI,
  getPriceTableAPI,
  updatePriceTableStatusAPI,
} from "@/api/price";
import Chip from "@/components/Chip";
import SearchContainer from "@/components/Common/SearchContainer";
import SearchField from "@/components/Common/searchField";
import PageTitle from "@/components/PageTitle";
import Table from "@/components/Table";
import usePagination from "@/hook/usePagination";
import { PriceTable } from "@/types/price.type";
import toLocaleDate from "@/utils/date";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import PriceTableHeaders from "./table-headers";
import AddIcon from "@mui/icons-material/Add";
import dynamic from "next/dynamic";
import { UPDATE_SUCCEED_MESSAGE } from "@/constant/message";
import SelectFilter, { listFilter } from "@/components/Common/selectFilter";
import { useRouter } from "next/navigation";
import ActionButton from "@/components/ActionButton";
import AlertDialog from "@/components/Dialog/ConfirmDialog";
import useSearchDebounce from "@/hook/useSearchDebouce";
import DeleteTable from "./DeleteTable";
import useHandleDialog from "@/hook/useHandleDialog";
const EditPriceTable = dynamic(() => import("./EditPriceTable"));
const AddPriceTableDialog = dynamic(() => import("./AddPriceTable"));

const FILTER: listFilter[] = [
  {
    display: "Table Name",
    value: "name",
  },
  {
    value: "vehicletype",
    display: "Vehicle Type",
  },
];

export default function PriceTablePage() {
  const [openCreate, setOpenCreate] = useState(false);
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const {
    pagination,
    handleChangeRowsPerPage,
    handlePageChange,
    setPagination,
    goToFirstPage,
  } = usePagination();
  const [tableList, setTableList] = useState<PriceTable[]>([]);
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);
  const [
    openActiveOrDeactivateConfirmDialog,
    setOpenActiveOrDeactivateConfirmDialog,
  ] = useState(false);
  const [isActiveOrDeActive, setIsActiveOrDeActive] = useState(false); //* true = active, false = deactive
  const [rowId, setRowId] = useState("");
  const {
    openDialog: openEditDialog,
    handleToggleDialog: handleToggleEditDialog,
    handleCloseDialog: handleCloseEditDialog,
  } = useHandleDialog();

  const [editTable, setEditTable] = useState<PriceTable | undefined>(undefined);
  const {
    data: priceTableData,
    isSuccess,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["/get-price-table", pagination, filter, debounceSearchText],
    queryFn: () =>
      getPriceTableAPI({
        page: pagination,
        attribute: filter,
        searchInput: debounceSearchText,
      }),
  });

  const handleCloseCreatePriceTable = () => {
    setOpenCreate((prev) => !prev);
  };

  const handleOpenCreatePriceTable = () => {
    setOpenCreate((prev) => !prev);
  };

  const handleOpenDialog = (id: string, isActive: boolean) => {
    setOpenActiveOrDeactivateConfirmDialog(true);
    setRowId(id);
    setIsActiveOrDeActive(isActive);
  };

  const handleCloseDialog = () => {
    setOpenActiveOrDeactivateConfirmDialog(false);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    goToFirstPage();
  };

  const updateTableStatusMutation = useMutation({
    mutationKey: ["/update-table-status"],
    mutationFn: updatePriceTableStatusAPI,
  });

  useEffect(() => {
    if (isSuccess && priceTableData.data.data) {
      setTableList(priceTableData.data.data || []);
    }
  }, [isSuccess, priceTableData]);

  const handleTableStatusChange = async (data: {
    priceTableId: string;
    isActive: boolean;
  }) => {
    try {
      await updateTableStatusMutation.mutateAsync(data, {
        onSuccess: () => {
          refetch();
          toast.success(UPDATE_SUCCEED_MESSAGE);
        },
      });
    } catch (error) {
      //   toast.error("Something went wrong");
    }
  };

  const tableRows = useMemo(() => {
    return tableList.map((item) => {
      return (
        <TableRow
          key={item.id}
          hover={true}
          onClick={(e) => {
            router.push("price/" + item.id + "/price-item");
          }}
          className='cursor-pointer'
        >
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.priority}</TableCell>
          <TableCell>{item.vehicleType}</TableCell>
          <TableCell>{toLocaleDate(item.applyFromDate as string)}</TableCell>
          <TableCell>{toLocaleDate(item.applyToDate as string)}</TableCell>
          <TableCell>
            <Chip
              variant={
                item.statusPriceTable === "ACTIVE" ? "success" : "warning"
              }
            >
              {item.statusPriceTable}
            </Chip>
          </TableCell>
          <TableCell>
            <div className='flex justify-start items-center gap-1 min-w-full'>
              {(() => {
                switch (item.statusPriceTable) {
                  case "ACTIVE":
                    return (
                      <ActionButton
                        variant='danger'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(item.id, false);
                        }}
                      >
                        DEACTIVATE
                      </ActionButton>
                    );
                  case "INACTIVE":
                    return (
                      <ActionButton
                        variant='primary'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(item.id, true);
                        }}
                      >
                        RE-ACTIVATE
                      </ActionButton>
                    );
                }
              })()}
              <ActionButton
                variant='primary'
                onClick={(e) => {
                  e.stopPropagation();
                  setEditTable(item);
                  handleToggleEditDialog();
                }}
              >
                Edit
              </ActionButton>
              <DeleteTable table={item} successCallBack={refetch} />
            </div>
          </TableCell>
        </TableRow>
      );
    });
  }, [tableList]);

  return (
    <>
      <AlertDialog
        open={openActiveOrDeactivateConfirmDialog}
        onCancel={handleCloseDialog}
        onOpenChange={handleCloseDialog}
        title={
          isActiveOrDeActive
            ? "Re-activate this table ?"
            : "Deactivate this table ?"
        }
        onConfirm={() => {
          handleTableStatusChange({
            isActive: isActiveOrDeActive,
            priceTableId: rowId,
          });
        }}
      />
      {openEditDialog && editTable && (
        <EditPriceTable
          open={openEditDialog}
          onOpenChange={handleCloseEditDialog}
          table={editTable}
          successCallback={refetch}
          onClose={handleCloseEditDialog}
        />
      )}
      <PageTitle>Price Page</PageTitle>
      <SearchContainer>
        <SelectFilter
          filterAttribute={filter}
          setFilterAttribute={handleFilterChange}
          listFilter={FILTER}
        />
        <SearchField
          inputValue={searchText}
          setInputValue={handleSearchTextChange}
          placeholder={"Enter price table name"}
        />
      </SearchContainer>
      <div className='min-w-full flex justify-start items-center py-2'>
        <Button variant='outlined' onClick={handleOpenCreatePriceTable}>
          <AddIcon /> <span>New Table</span>
        </Button>
      </div>
      {openCreate && (
        <AddPriceTableDialog
          open={openCreate}
          onClose={handleCloseCreatePriceTable}
        />
      )}
      <Table
        onPageChange={handlePageChange}
        onPageSizeChange={handleChangeRowsPerPage}
        pagination={pagination}
        tableHeads={PriceTableHeaders}
        tableRows={tableRows}
        totalRecord={priceTableData?.data.totalRecord}
        isLoading={isLoading || isRefetching}
      />
    </>
  );
}
