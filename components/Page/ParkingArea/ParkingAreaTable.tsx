"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import SearchField from "@/components/Common/searchField";
import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "../LoadingPage/Loading";
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
import { ParkingAreas } from "@/types/parking-area.type";
import {
  getListParkingArea,
  updateParkingAreaStatusAPI,
} from "@/api/parkingArea";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SelectFilter from "@/components/Common/selectFilter";
import SearchContainer from "@/components/Common/SearchContainer";
import Chip from "@/components/Chip";
import usePagination from "@/hook/usePagination";
import Table from "@/components/Table";
import { ParkingAreaTableHeaders } from "./table-headers";
import dynamic from "next/dynamic";
import useSearchDebounce from "@/hook/useSearchDebouce";
import { Button, Collapse, Grid, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Refresh from "@mui/icons-material/Refresh";
const AddParkingAreaDialog = dynamic(
  () => import("./Action/ParkingArea/AddParkingArea")
);
import ActionButton from "@/components/ActionButton";
const AlertDialog = dynamic(() => import("@/components/Dialog/ConfirmDialog"));
import { toast } from "react-toastify";
const UpdateParkingAreaDialog = dynamic(
  () => import("./Action/ParkingArea/UpdateParkingArea")
);
import getModeName, { MODES } from "@/utils/mode";
import { FormOptions } from "@/components/Form/Select";
import { getGateByParking } from "@/api/gate";
import { GateProps } from "@/types/gate.type";
import React from "react";
import useHandleDialog from "@/hook/useHandleDialog";
import DeleteGate from "./Action/Gate/DeleteGate";
import { EditGateSchemaType } from "@/utils/schemas/gate/editGateSchema";
import EditGate from "./Action/Gate/EditGate";
import AddGate from "./Action/Gate/AddGate";
import DeactiveAndActiveGate from "./Action/Gate/DeactiveAndActiveGate";
import DeleteParkingArea from "./Action/ParkingArea/DeleteParkingArea";

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
  const [gateUpdate, setGateUpdate] = useState("");
  const [isActivateOrDeactivate, setIsActivateOrDeactivate] = useState(false);
  const [updateValue, setUpdateValue] = useState<ParkingAreas | undefined>();
  const [updateGateValue, setUpdateGateValue] = useState<EditGateSchemaType>();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [rowId, setRowId] = useState("");
  const [deleteParkingAreaId, setDeleteParkingAreaId] = useState("");
  const [statusGate, setStatusGate] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const filterOptions: FilterOption[] = [{ display: "Name", value: "name" }];
  const { openDialog: openDeleteGate, handleToggleDialog: toggleDeleteGate } =
    useHandleDialog(false);
  const {
    openDialog: openAddGateDialog,
    handleToggleDialog: toggleAddGateDialog,
  } = useHandleDialog(false);
  const {
    openDialog: DeleteParkingAreaDialog,
    handleToggleDialog: toggleDeleteParkingAreaDialog,
  } = useHandleDialog(false);

  const {
    openDialog: DeactiveAndActiveGateDialog,
    handleToggleDialog: toggleDeactiveAndActiveGateDialog,
  } = useHandleDialog(false);
  const [rowAreaId, setRowAreaId] = useState("");
  const {
    openDialog: openUpdateGateDialog,
    handleToggleDialog: toggleUpdateGateDialog,
  } = useHandleDialog(false);
  const [filterAttribute, setFilterAttribute] =
    useState<keyof ParkingAreas>("name");
  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof ParkingAreas);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const [deaactiveAndActiveGate, setDeactiveAndActiveGate] = useState("");

  const handleExpandClick = (parkingId: string) => {
    setExpandedRow((prev) => (prev === parkingId ? null : parkingId));
    if (expandedRow !== parkingId && parkingId !== "") {
      setRowId(parkingId);
      refetchGate();
    }
  };
  useEffect(() => {
    if (expandedRow) {
      refetchGate();
    }
  }, [expandedRow]);
  const { mutateAsync: updateParkingAreaAsync, isPending } = useMutation({
    mutationKey: ["/update-parking-area-status"],
    mutationFn: updateParkingAreaStatusAPI,
  });

  const [deleteGateId, setDeleteGateId] = useState<string>("");
  const handleDeleteGate = (gateId: string) => {
    toggleDeleteGate();
    setDeleteGateId(gateId);
  };

  const {
    data: dataGate,
    isPending: isGatePending,
    refetch: refetchGate,
  } = useQuery({
    queryKey: ["/gates", rowId],
    queryFn: async () => {
      if (rowId === "") {
        return;
      }
      return await getGateByParking(rowId);
    },
    enabled: rowId !== "",
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
  };

  const handleAddGateDialog = (areaId: string) => {
    toggleAddGateDialog();
    setRowAreaId(areaId);
  };

  const handleDeactiveAndActiveGateDialog = (
    gateId: string,
    status: string
  ) => {
    toggleDeactiveAndActiveGateDialog();
    setDeactiveAndActiveGate(gateId);
    setStatusGate(status);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog((prev) => !prev);
  };

  const handleDeleteParkingArea = (parkingAreaId: string) => {
    toggleDeleteParkingAreaDialog();
    setDeleteParkingAreaId(parkingAreaId);
  };

  const handleOpenUpdateDialog = (value: ParkingAreas) => {
    setUpdateValue(value);
    setOpenUpdateDialog(true);
  };

  const handleOpenUpdateGateDialog = (
    value: EditGateSchemaType,
    gateId: string
  ) => {
    setUpdateGateValue(value);
    toggleUpdateGateDialog();
    setGateUpdate(gateId);
  };

  const handleCloseAddParkingAreaDialog = () => {
    setOpenAddDialog(false);
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

  const getGateRows = useCallback((gates?: GateProps[]) => {
    if (!gates || gates.length === 0) {
      return [];
    }

    return gates.map((gate) => (
      <TableRow key={gate.id}>
        <TableCell>{gate.name}</TableCell>
        <TableCell>{gate.description}</TableCell>
        <TableCell>
          <Chip
            variant={
              gate.status === "ACTIVE"
                ? "success"
                : gate.status === "INACTIVE"
                ? "warning"
                : "error"
            }
          >
            {gate.status}
          </Chip>
        </TableCell>
        <TableCell>
          <div className="flex flex-row gap-2">
            <ActionButton
              variant="outlined"
              onClick={() => handleDeleteGate(gate.id)}
              color="error"
            >
              Delete
            </ActionButton>
            <ActionButton
              variant="outlined"
              onClick={() =>
                handleOpenUpdateGateDialog(
                  {
                    description: gate.description,
                    name: gate.name,
                    parkingAreaId: gate.parkingAreaId,
                  },
                  gate.id
                )
              }
              color="primary"
            >
              Update
            </ActionButton>
            {gate.status === "ACTIVE" ? (
              <ActionButton
                variant="outlined"
                onClick={() =>
                  handleDeactiveAndActiveGateDialog(gate.id, "ACTIVE")
                }
                color="error"
              >
                Deactivate
              </ActionButton>
            ) : (
              <ActionButton
                variant="outlined"
                onClick={() =>
                  handleDeactiveAndActiveGateDialog(gate.id, "INACTIVE")
                }
                color="primary"
              >
                Activate
              </ActionButton>
            )}
          </div>
        </TableCell>
      </TableRow>
    ));
  }, []);

  const tableRows = useMemo(() => {
    const parkingAreas = data?.data.data;
    if (!parkingAreas || parkingAreas.length === 0) {
      return [];
    }

    return parkingAreas.map((area: ParkingAreas) => (
      <React.Fragment key={area.id}>
        <TableRow hover={true}>
          <TableCell>
            <IconButton
              onClick={() => handleExpandClick(area.id)}
              aria-expanded={expandedRow === area.id}
              aria-label="show more"
            >
              {expandedRow === area.id ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell>{area.name}</TableCell>
          <TableCell>{area.description}</TableCell>
          <TableCell>{area.maxCapacity}</TableCell>
          <TableCell>{area.block}</TableCell>
          <TableCell>{getModeName(area.mode)}</TableCell>
          <TableCell>
            <Chip
              variant={
                area.statusParkingArea === "ACTIVE" ? "success" : "error"
              }
            >
              {area.statusParkingArea}
            </Chip>
          </TableCell>
          <TableCell>
            <div className="flex gap-2">
              {(() => {
                switch (area.statusParkingArea) {
                  case "ACTIVE":
                    return (
                      <ActionButton
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenIsActiveOrDeactiveDialog(area.id, false);
                        }}
                        color="error"
                      >
                        Deactivate
                      </ActionButton>
                    );
                  case "INACTIVE":
                    return (
                      <ActionButton
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenIsActiveOrDeactiveDialog(area.id, true);
                        }}
                        color="primary"
                      >
                        Activate
                      </ActionButton>
                    );
                  default:
                    return <></>;
                }
              })()}
              <ActionButton
                onClick={() => handleOpenUpdateDialog(area)}
                variant="outlined"
                color="primary"
              >
                Update
              </ActionButton>
              <ActionButton
                onClick={() => handleDeleteParkingArea(area.id)}
                variant="outlined"
                color="error"
              >
                Delete
              </ActionButton>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
            }}
            colSpan={8}
          >
            <Collapse in={expandedRow === area.id} timeout="auto" unmountOnExit>
              <Grid container spacing={2} className="pt-5 pb-5">
                <Grid item xs={12}>
                  <Typography variant="h6" component="div">
                    Gates
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    item
                    xs={12}
                    container
                    className="gap-5"
                    justifyContent="flex-end"
                  >
                    <div className="flex flex-row gap-2">
                      <ActionButton
                        variant="outlined"
                        onClick={() => handleAddGateDialog(area.id)}
                        color="primary"
                      >
                        Add Gate
                      </ActionButton>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => refetchGate()}
                      >
                        Refresh
                      </Button>
                    </div>
                    {isGatePending ? (
                      <Loading />
                    ) : dataGate?.data?.data?.length === 0 ? (
                      <Grid item xs={12} style={{ textAlign: "left" }}>
                        <p>There is no data to show.</p>
                      </Grid>
                    ) : (
                      <Table
                        tableHeads={["Name", "Description", "Status", "Action"]}
                        tableRows={getGateRows(dataGate?.data?.data)}
                        onPageSizeChange={handleChangeRowsPerPage}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        totalRecord={dataGate?.data?.totalRecord}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    ));
  }, [data?.data.data, expandedRow, dataGate?.data.data, isGatePending]);

  return (
    <>
      {DeleteParkingAreaDialog && (
        <DeleteParkingArea
          open={DeleteParkingAreaDialog}
          onClose={toggleDeleteParkingAreaDialog}
          parkingAreaId={deleteParkingAreaId}
          onOpenChange={toggleDeleteParkingAreaDialog}
          refresh={refetch}
        />
      )}
      {DeactiveAndActiveGateDialog && (
        <DeactiveAndActiveGate
          open={DeactiveAndActiveGateDialog}
          onClose={toggleDeactiveAndActiveGateDialog}
          gateId={deaactiveAndActiveGate}
          onOpenChange={toggleDeactiveAndActiveGateDialog}
          refresh={refetchGate}
          status={statusGate}
        />
      )}
      {openAddGateDialog && (
        <AddGate
          open={openAddGateDialog}
          onClose={toggleAddGateDialog}
          areaId={rowAreaId}
          onOpenChange={toggleAddGateDialog}
          refresh={refetchGate}
        />
      )}
      {openUpdateGateDialog && (
        <EditGate
          open={openUpdateGateDialog}
          onClose={toggleUpdateGateDialog}
          EditGateForm={updateGateValue}
          onOpenChange={toggleUpdateGateDialog}
          gateId={gateUpdate}
          refresh={refetchGate}
        />
      )}
      {openDeleteGate && (
        <DeleteGate
          open={openDeleteGate}
          onClose={toggleDeleteGate}
          gateId={deleteGateId}
          onOpenChange={toggleDeleteGate}
          refresh={refetchGate}
        />
      )}
      {openConfirmDialog && (
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
      )}

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
        <Button variant="outlined" onClick={handleOpenAddDialog}>
          <AddIcon /> New Parking Area
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            refetch();
          }}
        >
          <div className="flex items-center justify-center">
            <Refresh /> Refresh
          </div>
        </Button>
      </div>
      {openAddDialog && (
        <AddParkingAreaDialog
          open={openAddDialog}
          onOpenChange={handleCloseAddParkingAreaDialog}
          onClose={() => {
            setOpenAddDialog(false);
            refetch();
          }}
        />
      )}
      {updateValue && (
        <UpdateParkingAreaDialog
          open={openUpdateDialog}
          onClose={handleUpdateDialogClose}
          value={updateValue}
          onOpenChange={handleUpdateDialogClose}
          successCallback={() => {
            refetch();
          }}
        />
      )}
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
            tableHeads={ParkingAreaTableHeaders}
            tableRows={tableRows}
            isLoading={isLoading}
            totalRecord={data.data.totalRecord}
          />
        ))}
    </>
  );
}
