"use client";
import { useMemo, useState, useCallback } from "react";
import SelectFilter from "../../Common/selectFilter";
import SearchField from "../../Common/searchField";
import { CustomerWithFillerProps } from "@/types/customer.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  changeStatusCustomerAPI,
  getListCustomerWithFillerAPI,
} from "@/api/customer";
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
import Button from "@mui/material/Button";
import Loading from "../LoadingPage/Loading";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import SearchContainer from "@/components/Common/SearchContainer";
import PageTitle from "@/components/PageTitle";
import AlertDialog from "@/components/Dialog/ConfirmDialog";
import ActionButton from "@/components/ActionButton";
import usePagination from "@/hook/usePagination";
import Table from "@/components/Table";
import { CustomerTableHeaders } from "./table-headers";
import useSearchDebounce from "@/hook/useSearchDebouce";
import RegisterNewCustomer from "./Action/Customer/RegisterNewCustomer";
import useHandleDialog from "@/hook/useHandleDialog";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import React from "react";
import { getListVehicleByCustomerAPI } from "@/api/vehicle";
import { Grid, Typography } from "@mui/material";
import { VehicleProps } from "@/types/vehicle.type";
import toLocaleDate from "@/utils/date";
import AddVehicle from "./Action/Vehicle/AddVehicle";
import Image from "next/image";
import DeleteVehicle from "./Action/Vehicle/DeleteVehicle";
import DeactiveAndActiveVehicle from "./Action/Vehicle/DeactiveAndActiveVehicle";
import Bai_Logo from "@/public/Bai_Logo.svg";
import { UpdateVehicleSchemaType } from "@/utils/schemas/vehicle/updateVehicleSchema";
import { Edit } from "lucide-react";
import EditVehicle from "./Action/Vehicle/EditVehicle";

const filterOptions = [
  { display: "Name", value: "fullName" },
  { display: "Email", value: "email" },
  { display: "Type Customer", value: "customerType" },
  { display: "Status", value: "statusCustomer" },
];

export default function Customer() {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isActiveOrDeActive, setIsActiveOrDeActive] = useState(false); //* true = Active , false = Deactive
  const [isActiveOrDeActiveVehicle, setIsActiveOrDeActiveVehicle] =
    useState(false); //* true = Active , false = Deactive
  const {
    openDialog: openRgisterNewCustomer,
    handleToggleDialog: toggleAddCustomer,
  } = useHandleDialog(false);

  const { openDialog: openAddVehicle, handleToggleDialog: toggleAddVehicle } =
    useHandleDialog(false);

  const {
    openDialog: openDeactiveAndActiveVehicle,
    handleToggleDialog: toggleDeactiveAndActiveVehicle,
  } = useHandleDialog(false);

  const { openDialog: openEditVehicle, handleToggleDialog: toggleEditVehicle } =
    useHandleDialog(false);

  const {
    openDialog: openDeleteVehicle,
    handleToggleDialog: toggleDeleteVehicle,
  } = useHandleDialog(false);

  const {
    pagination,
    handleChangeRowsPerPage,
    handlePageChange,
    setPagination,
    goToFirstPage,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);
  const [rowId, setRowId] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [deleteVehicleId, setDeleteVehicleId] = useState("");
  const [activeAndDeactiveVehicleId, setActiveAndDeactiveVehicleId] =
    useState("");
  const [editVehicle, setEditVehicle] = useState<UpdateVehicleSchemaType>();
  const [filterAttribute, setFilterAttribute] =
    useState<keyof CustomerWithFillerProps>("fullName");
  const { data, isLoading, isSuccess, isError, error, refetch } = useQuery({
    queryKey: [
      "/customer",
      pagination.pageSize,
      pagination.pageIndex,
      debounceSearchText,
      filterAttribute,
    ],
    queryFn: () =>
      getListCustomerWithFillerAPI(
        pagination.pageSize,
        pagination.pageIndex + 1,
        debounceSearchText,
        filterAttribute.toString()
      ),
    retry: 1,
  });

  const handleOpenDialog = (id: string, isActive: boolean) => {
    setOpenConfirmDialog(true);
    setRowId(id);
    setIsActiveOrDeActive(isActive);
  };

  const handleEditVehicle = (data: UpdateVehicleSchemaType) => {
    setEditVehicle(data);
    toggleEditVehicle();
  };

  const handleDeleteVehicle = (id: string) => {
    setDeleteVehicleId(id);
    toggleDeleteVehicle();
  };

  const handleDeactiveAndActiveVehicle = (id: string, isActive: boolean) => {
    setActiveAndDeactiveVehicleId(id);
    toggleDeactiveAndActiveVehicle();
    setIsActiveOrDeActiveVehicle(isActive);
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
  };

  const changeStatusCustomerMutation = useMutation({
    mutationKey: ["/customer/status"],
    mutationFn: changeStatusCustomerAPI,
  });

  const {
    data: vehicleData,
    isPending: vehicleIsPending,
    refetch: vehicleRefetch,
  } = useQuery({
    queryKey: ["/vehicle", rowId],
    queryFn: async () => {
      if (rowId === "") {
        return;
      }
      return getListVehicleByCustomerAPI(rowId);
    },
    enabled: rowId !== "",
  });

  const onStatusChange = async (isActive: boolean, customerId: string) => {
    try {
      await changeStatusCustomerMutation.mutateAsync(
        { isActive, customerId },
        {
          onSuccess: (data) => {
            refetch();
            toast.success(data.data.message);
          },
        }
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleExpandClick = (customerId: string) => {
    setExpandedRow((prev) => (prev === customerId ? null : customerId));
    if (expandedRow !== customerId && customerId !== "") {
      setRowId(customerId);
      vehicleRefetch();
    }
  };

  const getVehicleRows = useCallback((vehicles?: VehicleProps[]) => {
    if (vehicles === undefined) {
      return [];
    }
    return vehicles.map((vehicle: VehicleProps) => (
      <TableRow key={vehicle.id}>
        <TableCell>{vehicle.plateNumber}</TableCell>
        <TableCell>{vehicle.vehicleType}</TableCell>
        <TableCell>
          {vehicle.plateImage ? (
            <Image
              loader={({ src }) => src as string}
              src={vehicle.plateImage}
              alt="vehicle"
              width={100}
              height={100}
              onError={(e) => {
                e.currentTarget.src = Bai_Logo.src;
                e.currentTarget.alt = "Image error";
              }}
            />
          ) : (
            <Typography
              height={70}
              display={"flex"}
              alignItems={"center"}
              justifyItems={"center"}
            >
              No image
            </Typography>
          )}
        </TableCell>
        <TableCell>{toLocaleDate(vehicle.createdDate)}</TableCell>
        <TableCell>
          {vehicle.staffApproval ? vehicle.staffApproval : "N/A"}
        </TableCell>
        <TableCell>
          {vehicle.statusVehicle === "ACTIVE" ? (
            <span
              className="p-1 pl-2 pr-2 rounded-xl inline-block w-16 text-center"
              style={{
                color: "#62a34f",
                backgroundColor: "#dcfce7",
              }}
            >
              Active
            </span>
          ) : vehicle.statusVehicle === "INACTIVE" ? (
            <span
              className="p-1 pl-2 pr-2 rounded-xl inline-block w-16 text-center"
              style={{
                color: "#fcca46",
                backgroundColor: "#fef9c3",
              }}
            >
              Inactive
            </span>
          ) : vehicle.statusVehicle === "REJECTED" ? (
            <span
              className="p-1 pl-2 pr-2 rounded-xl inline-block w-16 text-center"
              style={{
                color: "#d9534f",
                backgroundColor: "#f8d7da",
              }}
            >
              Rejected
            </span>
          ) : vehicle.statusVehicle === "PENDING" ? (
            <span
              className="p-1 pl-2 pr-2 rounded-xl inline-block w-16 text-center"
              style={{
                color: "#f0ad4e",
                backgroundColor: "#fcf8e3",
              }}
            >
              Pending
            </span>
          ) : (
            <span>{vehicle.statusVehicle}</span>
          )}
        </TableCell>
        <TableCell>
          <div className="flex flex-row gap-3">
            <ActionButton
              variant="danger"
              onClick={() => {
                handleDeleteVehicle(vehicle.id);
              }}
            >
              Delete
            </ActionButton>
            {vehicle.statusVehicle === "INACTIVE" ||
            vehicle.statusVehicle === "PENDING" ? (
              <ActionButton
                variant="primary"
                onClick={() => {
                  handleDeactiveAndActiveVehicle(vehicle.id, true);
                }}
              >
                Activate
              </ActionButton>
            ) : (
              <ActionButton
                variant="danger"
                onClick={() => {
                  handleDeactiveAndActiveVehicle(vehicle.id, false);
                }}
              >
                Deactivate
              </ActionButton>
            )}
            <ActionButton
              variant="primary"
              onClick={() => {
                handleEditVehicle({
                  plateNumber: vehicle.plateNumber,
                  vehicleTypeId: vehicle.vehicleTypeId,
                  vehicleId: vehicle.id,
                });
              }}
            >
              Edit
            </ActionButton>
          </div>
        </TableCell>
      </TableRow>
    ));
  }, []);

  const tableRows = useMemo(() => {
    const customers = data?.data.data;
    if (!customers || customers.length === 0) {
      return [];
    }

    return customers.map((row) => (
      <React.Fragment key={row.customerId}>
        <TableRow>
          <TableCell>
            <IconButton
              onClick={() => handleExpandClick(row.customerId)}
              aria-expanded={expandedRow === row.customerId}
              aria-label="show more"
            >
              {expandedRow === row.customerId ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell>{row.fullName}</TableCell>
          <TableCell>{row.email}</TableCell>
          <TableCell>
            {row.customerType === "PAID" ? (
              <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded w-16 text-center">
                Paid
              </span>
            ) : row.customerType === "FREE" ? (
              <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded w-16 text-center">
                Free
              </span>
            ) : (
              <span>{row.customerType}</span>
            )}
          </TableCell>
          <TableCell>
            {row.statusCustomer === "ACTIVE" ? (
              <span
                className="p-1 pl-2 pr-2 rounded-xl inline-block w-16 text-center"
                style={{
                  color: "#62a34f",
                  backgroundColor: "#dcfce7",
                }}
              >
                Active
              </span>
            ) : row.statusCustomer === "INACTIVE" ? (
              <span
                className="p-1 pl-2 pr-2 rounded-xl inline-block w-16 text-center"
                style={{
                  color: "#fcca46",
                  backgroundColor: "#fef9c3",
                }}
              >
                Inactive
              </span>
            ) : (
              <span>{row.statusCustomer}</span>
            )}
          </TableCell>
          <TableCell>
            <div className="flex flex-row gap-3">
              {(() => {
                if (row.statusCustomer === "INACTIVE") {
                  return (
                    <ActionButton
                      variant="primary"
                      onClick={() => handleOpenDialog(row.customerId, true)}
                      disabled={changeStatusCustomerMutation.isPending}
                    >
                      Activate
                    </ActionButton>
                  );
                } else if (row.statusCustomer === "ACTIVE") {
                  return (
                    <ActionButton
                      variant="danger"
                      onClick={() => handleOpenDialog(row.customerId, false)}
                      disabled={changeStatusCustomerMutation.isPending}
                    >
                      Deactive
                    </ActionButton>
                  );
                }
              })()}
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse
              in={expandedRow === row.customerId}
              timeout="auto"
              unmountOnExit
            >
              <Grid container spacing={2} className="pt-5 pb-5">
                <Grid item xs={12}>
                  <Typography variant="h6" component="div">
                    Vehicles
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
                    {openAddVehicle && (
                      <AddVehicle
                        open={openAddVehicle}
                        onOpenChange={toggleAddVehicle}
                        onClose={toggleAddVehicle}
                        customerId={row.customerId}
                        refresh={vehicleRefetch}
                      />
                    )}
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={toggleAddVehicle}
                      className=""
                    >
                      Add Vehicle
                    </Button>
                    {vehicleIsPending ? (
                      <Loading />
                    ) : vehicleData?.data?.data?.length === 0 ? (
                      <Grid item xs={12} style={{ textAlign: "left" }}>
                        <p>There is no data to show.</p>
                      </Grid>
                    ) : (
                      <Table
                        tableHeads={[
                          "PlateNumber",
                          "Vehicle Type",
                          "Image",
                          "Created Date",
                          "Staff Approval",
                          "Status",
                          "Action",
                        ]}
                        tableRows={getVehicleRows(vehicleData?.data?.data)}
                        onPageSizeChange={handleChangeRowsPerPage}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        totalRecord={vehicleData?.data?.totalRecord}
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
  }, [
    data?.data.data,
    expandedRow,
    vehicleData?.data?.data,
    vehicleIsPending,
    openAddVehicle,
    openDeleteVehicle,
    openDeactiveAndActiveVehicle,
  ]);

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof CustomerWithFillerProps);
    goToFirstPage();
  };

  return (
    <>
      {openDeactiveAndActiveVehicle && (
        <DeactiveAndActiveVehicle
          open={openDeactiveAndActiveVehicle}
          onClose={toggleDeactiveAndActiveVehicle}
          onOpenChange={toggleDeactiveAndActiveVehicle}
          vehicleId={activeAndDeactiveVehicleId}
          refresh={vehicleRefetch}
          status={isActiveOrDeActiveVehicle ? "inactive" : "active"}
        />
      )}
      {openDeleteVehicle && (
        <DeleteVehicle
          open={openDeleteVehicle}
          onClose={toggleDeleteVehicle}
          onOpenChange={toggleDeleteVehicle}
          vehicleId={deleteVehicleId}
          refresh={vehicleRefetch}
        />
      )}
      {openEditVehicle && (
        <EditVehicle
          open={openEditVehicle}
          onOpenChange={toggleEditVehicle}
          onClose={toggleEditVehicle}
          refresh={vehicleRefetch}
          EditVehicleForm={editVehicle}
        />
      )}
      <AlertDialog
        open={openConfirmDialog}
        title={
          isActiveOrDeActive
            ? "Confirm re-activate this customer ?"
            : "Deactivate this customer ?"
        }
        onCancel={handleCloseDialog}
        onOpenChange={handleCloseDialog}
        onConfirm={() => {
          onStatusChange(isActiveOrDeActive, rowId);
        }}
      />
      <PageTitle>Customer List</PageTitle>
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
        <Button
          variant="outlined"
          color="primary"
          onClick={() => refetch()}
          disabled={changeStatusCustomerMutation.isPending}
        >
          Refresh
        </Button>
        {openRgisterNewCustomer && (
          <RegisterNewCustomer
            open={openRgisterNewCustomer}
            onOpenChange={toggleAddCustomer}
            onClose={toggleAddCustomer}
          />
        )}
        <Button variant="outlined" color="primary" onClick={toggleAddCustomer}>
          Register Non-Paid Customer
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
            tableHeads={CustomerTableHeaders}
            tableRows={tableRows}
            isLoading={isLoading}
            totalRecord={data.data.totalRecord}
          />
        ))}
    </>
  );
}
