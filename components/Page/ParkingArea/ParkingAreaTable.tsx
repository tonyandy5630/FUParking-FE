"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import SearchField from "@/components/Common/searchField";
import { useMemo, useState } from "react";
import Loading from "../LoadingPage/Loading";
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
import { ParkingAreas } from "@/types/parkingArea.type";
import {
  getListParkingArea,
  updateParkingAreaStatusAPI,
} from "@/api/parkingArea";
import SelectFilter from "@/components/Common/selectFilter";
import SearchContainer from "@/components/Common/SearchContainer";
import Chip from "@/components/Chip";
import usePagination from "@/hook/usePagination";
import Table from "@/components/Table";
import { ParkingAreaTableHeaders } from "./table-headers";
import dynamic from "next/dynamic";
import useSearchDebounce from "@/hook/useSearchDebouce";
import ActionArea from "@/components/ActionArea";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddParkingAreaDialog from "./AddParkingArea";
import ActionButton from "@/components/ActionButton";
import AlertDialog from "@/components/Dialog/ConfirmDialog";
import { toast } from "react-toastify";
import UpdateParkingAreaDialog from "./UpdateParkingArea";
import getModeName, { MODES } from "@/utils/mode";
import { FormOptions } from "@/components/Form/Select";

type FilterOption = {
  display: string;
  value: string;
};
const MODE_OPTIONS: FormOptions[] = [...MODES];

export default function ParkingAreaTable() {
  const {
    handleChangeRowsPerPage,
    handlePageChange,
    pagination,
    setPagination,
    goToFirstPage,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isActivateOrDeactivate, setIsActivateOrDeactivate] = useState(false);
  const [updateValue, setUpdateValue] = useState<ParkingAreas | undefined>();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [rowId, setRowId] = useState("");

  const filterOptions: FilterOption[] = [{ display: "Name", value: "name" }];

  const [filterAttribute, setFilterAttribute] =
    useState<keyof ParkingAreas>("name");

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof ParkingAreas);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const { mutateAsync: updateParkingAreaAsync, isPending } = useMutation({
    mutationKey: ["/update-parking-area-status"],
    mutationFn: updateParkingAreaStatusAPI,
  });

  const { data, isLoading, isError, isSuccess, error, refetch, isRefetching } =
    useQuery({
      queryKey: [
        "/areas",
        pagination.pageSize,
        pagination.pageIndex,
        debounceSearchText,
        filterAttribute,
      ],
      queryFn: () =>
        getListParkingArea(
          pagination.pageSize,
          pagination.pageIndex + 1,
          debounceSearchText,
          filterAttribute
        ),
      retry: 1,
    });

  const handleOpenIsActiveOrDeactiveDialog = (
    parkingId: string,
    isActive: boolean
  ) => {
    setOpenConfirmDialog(true);
    setIsActivateOrDeactivate(isActive);
    setRowId(parkingId);
  };

  const handleUpdateDialogClose = () => {
    setOpenUpdateDialog(false);
    setUpdateValue(undefined);
    refetch();
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog((prev) => !prev);
  };

  const handleOpenUpdateDialog = (value: ParkingAreas) => {
    setUpdateValue(value);
    setOpenUpdateDialog(true);
  };

  const handleCloseAddParkingAreaDialog = () => {
    setOpenAddDialog(false);
    refetch();
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleParkingAreaStatusChange = async (data: {
    isActive: boolean;
    parkingId: string;
  }) => {
    try {
      await updateParkingAreaAsync(data, {
        onSuccess: (res) => {
          toast.success("Change status successfully");
          refetch();
        },
      });
    } catch (error) {}
  };

  const tableRows = useMemo(() => {
    const parkingAreas = data?.data.data;
    if (!parkingAreas || parkingAreas.length === 0) {
      return [];
    }

    return parkingAreas.map((area: ParkingAreas) => (
      <TableRow
        hover={true}
        className='cursor-pointer'
        key={area.id}
        onClick={() => handleOpenUpdateDialog(area)}
      >
        <TableCell>{area.name}</TableCell>
        <TableCell>{area.description}</TableCell>
        <TableCell>{area.maxCapacity}</TableCell>
        <TableCell>{area.block}</TableCell>
        <TableCell>{getModeName(area.mode)}</TableCell>
        <TableCell>
          <Chip
            variant={area.statusParkingArea === "ACTIVE" ? "success" : "error"}
          >
            {area.statusParkingArea}
          </Chip>
        </TableCell>
        <TableCell>
          {new Date(area.createDate).toLocaleDateString("vi-VN")}
        </TableCell>
        <TableCell>{area.createBy === "" ? "System" : area.createBy}</TableCell>
        <TableCell>
          {(() => {
            switch (area.statusParkingArea) {
              case "ACTIVE":
                return (
                  <ActionButton
                    variant='danger'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenIsActiveOrDeactiveDialog(area.id, false);
                    }}
                  >
                    Deactivate
                  </ActionButton>
                );
              case "INACTIVE":
                return (
                  <ActionButton
                    variant='primary'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenIsActiveOrDeactiveDialog(area.id, true);
                    }}
                  >
                    Activate
                  </ActionButton>
                );
              default:
                return <></>;
            }
          })()}
        </TableCell>
      </TableRow>
    ));
  }, [data?.data.data]);

  return (
    <>
      <AlertDialog
        open={openConfirmDialog}
        onCancel={handleCloseDialog}
        onOpenChange={handleCloseDialog}
        title={
          isActivateOrDeactivate
            ? "Re-activate this table ?"
            : "Deactivate this table ?"
        }
        onConfirm={() => {
          handleParkingAreaStatusChange({
            isActive: isActivateOrDeactivate,
            parkingId: rowId,
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
        <Button variant='outlined' onClick={handleOpenAddDialog}>
          <AddIcon /> New Parking Area
        </Button>
      </ActionArea>
      <AddParkingAreaDialog
        open={openAddDialog}
        onOpenChange={handleCloseAddParkingAreaDialog}
        onClose={() => {
          setOpenAddDialog(false);
          refetch();
        }}
      />
      {updateValue && (
        <UpdateParkingAreaDialog
          open={openUpdateDialog}
          onClose={handleUpdateDialogClose}
          value={updateValue}
          onOpenChange={handleUpdateDialogClose}
        />
      )}
      {(isLoading || isRefetching) && <Loading />}
      {isError && <p>Something wrong, please trying again later...</p>}
      {isSuccess &&
        (data.data.totalRecord === 0 ? (
          <p>There is no data to show.</p>
        ) : (
          <Table
            onPageChange={handlePageChange}
            onPageSizeChange={handleChangeRowsPerPage}
            pagination={pagination}
            tableHeads={ParkingAreaTableHeaders}
            tableRows={tableRows}
            isLoading={isLoading}
            totalRecord={data.data.totalRecord}
          />
        ))}
    </>
  );
}
