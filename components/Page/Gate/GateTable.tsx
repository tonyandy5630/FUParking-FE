"use client";

import { gateStatusChangeAPI, getGate } from "@/api/gate";
import { Gates } from "@/types/gate.type";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
import SelectFilter from "@/components/Common/selectFilter";
import SearchField from "@/components/Common/searchField";
import Loading from "../LoadingPage/Loading";
import Chip from "@/components/Chip";
import usePagination from "@/hook/usePagination";
import useSearchDebounce from "@/hook/useSearchDebouce";
import Table from "@/components/Table";
import { GateTableHeaders } from "./table.headers";
import dynamic from "next/dynamic";
import SearchContainer from "@/components/Common/SearchContainer";
import useHandleDialog from "@/hook/useHandleDialog";
import { Button } from "@mui/material";
import ActionArea from "@/components/ActionArea";
import AddGateDialog from "./AddGate";
import UpdateGateDialogs from "./UpdateGate";
import AlertDialog from "@/components/Dialog/ConfirmDialog";
import ActionButton from "@/components/ActionButton";
import { toast } from "react-toastify";

type FilterOption = {
  display: string;
  value: string;
};

export default function GateTable() {
  const {
    goToFirstPage,
    handleChangeRowsPerPage,
    handlePageChange,
    pagination,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);
  const {
    openDialog: openAddDialog,
    handleCloseDialog: closeAddDialog,
    handleToggleDialog: handleToggleAddAddDialog,
  } = useHandleDialog(false);
  const {
    openDialog: openUpdateDialog,
    handleCloseDialog: closeUpdateDialog,
    handleToggleDialog: handleToggleUpdateDialog,
  } = useHandleDialog(false);
  const [isActivateOrDeactivate, setIsActivateOrDeactivate] = useState(true);
  const {
    openDialog: openConfirmDialog,
    handleCloseDialog: closeConfirmDialog,
    handleOpenDialog: handleOpenConfirmDialog,
  } = useHandleDialog(false);
  const [gateId, setGateId] = useState("");
  const [updateGate, setUpdateGate] = useState<Gates>();

  const filterOptions: FilterOption[] = [
    { display: "Name", value: "name" },
    { display: "Parking Area", value: "parkingAreaName" },
    { display: "Description", value: "description" },
    { display: "Gate Type", value: "gateTypeName" },
    { display: "Status", value: "statusGate" },
  ];

  const [filterAttribute, setFilterAttribute] = useState<keyof Gates>("name");

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof Gates);
    goToFirstPage();
  };

  const {
    mutateAsync: gateStatusChangeAsync,
    isPending: isGateStatusChangePending,
  } = useMutation({
    mutationKey: ["gate-status-change"],
    mutationFn: gateStatusChangeAPI,
  });

  const handleOpenIsActiveOrDeactiveDialog = (
    gateId: string,
    isActive: boolean
  ) => {
    handleOpenConfirmDialog();
    setIsActivateOrDeactivate(isActive);
    setGateId(gateId);
  };

  const handleGateStatusChange = async (data: {
    gateId: string;
    isActive: boolean;
  }) => {
    try {
      await gateStatusChangeAsync(data, {
        onSuccess: () => {
          toast.success("Change status successfully");
          refetch();
        },
      });
    } catch (error) {}
  };

  const { data, isLoading, isError, isSuccess, error, refetch, isRefetching } =
    useQuery({
      queryKey: [
        "/gates",
        pagination.pageSize,
        pagination.pageIndex,
        debounceSearchText,
        filterAttribute,
      ],
      queryFn: () =>
        getGate(
          pagination.pageSize,
          pagination.pageIndex + 1,
          debounceSearchText,
          filterAttribute
        ),
      retry: 1,
      placeholderData: keepPreviousData,
    });

  const handleUpdateGateOpen = (gate: Gates) => {
    setUpdateGate(gate);
    handleToggleUpdateDialog();
  };

  const handleCloseUpdateDialog = () => {
    closeUpdateDialog();
    setUpdateGate(undefined);
  };

  const tableRows = useMemo(() => {
    const gates = data?.data.data;
    if (!gates || gates.length === 0) {
      return [];
    }

    return gates.map((gate: Gates) => (
      <TableRow
        key={gate.id}
        hover={true}
        className='cursor-pointer'
        onClick={() => handleUpdateGateOpen(gate)}
      >
        <TableCell>{gate.name}</TableCell>
        <TableCell>{gate.parkingArea.name}</TableCell>
        <TableCell>{gate.description}</TableCell>
        <TableCell>{gate.gateType.name}</TableCell>
        <TableCell>
          <Chip variant={gate.statusGate === "ACTIVE" ? "success" : "error"}>
            {gate.statusGate}
          </Chip>
        </TableCell>
        <TableCell>{gate.createdBy === "" ? "NaN" : gate.createdBy}</TableCell>
        <TableCell>{gate.lastModifyBy}</TableCell>
        <TableCell>
          {gate.statusGate === "ACTIVE" ? (
            <ActionButton
              variant='danger'
              onClick={(e) => {
                e.stopPropagation();
                handleOpenIsActiveOrDeactiveDialog(gate.id, false);
              }}
            >
              DEACTIVATE
            </ActionButton>
          ) : (
            <ActionButton
              variant='primary'
              onClick={(e) => {
                e.stopPropagation();
                handleOpenIsActiveOrDeactiveDialog(gate.id, true);
              }}
            >
              ACTIVATE
            </ActionButton>
          )}
        </TableCell>
      </TableRow>
    ));
  }, [data?.data.data]);
  return (
    <>
      <AlertDialog
        open={openConfirmDialog}
        onCancel={closeConfirmDialog}
        onOpenChange={closeConfirmDialog}
        title={
          isActivateOrDeactivate
            ? "Re-activate this table ?"
            : "Deactivate this table ?"
        }
        onConfirm={() => {
          handleGateStatusChange({
            isActive: isActivateOrDeactivate,
            gateId,
          });
        }}
      />
      <div className='flex flex-col gap-5'>
        <SearchContainer>
          <SearchField
            inputValue={searchText}
            setInputValue={handleSearchTextChange}
          />
          <SelectFilter
            filterAttribute={filterAttribute}
            setFilterAttribute={handleFilterAttributeChange}
            listFilter={filterOptions}
          />
        </SearchContainer>
      </div>
      <ActionArea>
        <Button variant='outlined' onClick={() => handleToggleAddAddDialog()}>
          New Gate
        </Button>
        <AddGateDialog
          open={openAddDialog}
          onOpenChange={handleToggleAddAddDialog}
          onClose={closeAddDialog}
          refetch={refetch}
        />
        {updateGate && (
          <UpdateGateDialogs
            open={openUpdateDialog}
            onOpenChange={handleToggleUpdateDialog}
            onClose={handleCloseUpdateDialog}
            value={updateGate}
            refetch={refetch}
          />
        )}
      </ActionArea>
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
            tableHeads={GateTableHeaders}
            tableRows={tableRows}
            isLoading={isLoading || isRefetching}
            totalRecord={data.data.totalRecord}
          />
        ))}
    </>
  );
}
