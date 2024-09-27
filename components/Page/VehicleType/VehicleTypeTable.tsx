"use client";
import { getListVehicleTypeAPI } from "@/api/vehicleType";
import { VehicleTypeProps } from "@/types/vehicleType.type";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "../LoadingPage/Loading";
import SearchField from "@/components/Common/searchField";
import SelectFilter from "@/components/Common/selectFilter";
import {
  Button,
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Grid,
  Typography,
} from "@mui/material";
import CreateVehicleType from "./Action/VehicleType/CreateVehicleType";
import EditVehicleType from "./Action/VehicleType/EditVehicleType";
import DeleteVehicleType from "./Action/VehicleType/DeleteVehicleType";
import SearchContainer from "@/components/Common/SearchContainer";
import usePagination from "@/hook/usePagination";
import useSearchDebounce from "@/hook/useSearchDebouce";
import Table from "@/components/Table";
import { VehicleTypeTableHeaders } from "./table-headers";
import toLocaleDate, { toVNDateString } from "@/utils/date";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { PriceTable } from "@/types/price.type";
import { getPriceTableByVehicleTypeAPI } from "@/api/price";
import TableNonPage from "@/components/Table/TableNonPage/TableNonPage";
import { getPriceItemByTableAPI } from "@/api/price-item";
import { PriceItem } from "@/types/price-item.type";
import AddPriceTable from "./Action/Price/AddPrice";
import useHandleDialog from "@/hook/useHandleDialog";
import DeletePriceTable from "./Action/Price/DeletePrice";
import UpdatePrice from "./Action/Price/UpdatePrice";
import InactiveAndActivePrice from "./Action/Price/InactiveAndActivePrice";
import UpdatePriceItem from "./Action/PriceItem/UpdatePriceItem";
export interface PriorityDictionary {
  [key: number]: boolean;
}
const keys = ["Name", "Description", "Created Date"];

export default function VehicleTypeTable() {
  const [disabledPriority, setDisabledPriority] = useState<PriorityDictionary>(
    {}
  );
  // state
  const {
    openDialog: openCreateDialog,
    handleToggleDialog: handletoggleCreateDialog,
  } = useHandleDialog();
  const {
    openDialog: openDeletePriceDialog,
    handleToggleDialog: handleToggleDeletePriceDialog,
  } = useHandleDialog();
  const {
    openDialog: openUpdatePriceTableDialog,
    handleToggleDialog: handleToggleUpdatePriceTableDialog,
  } = useHandleDialog();
  const {
    openDialog: openChangeStatusPriceTableDialog,
    handleToggleDialog: handleToggleChangeStatusPriceTableDialog,
  } = useHandleDialog();

  const {
    openDialog: openDeleteVehicleTypeDialog,
    handleToggleDialog: handleToggleDeleteVehicleTypeDialog,
  } = useHandleDialog();

  const {
    openDialog: openUpdatePriceItemDialog,
    handleToggleDialog: handleToggleUpdatePriceItemDialog,
  } = useHandleDialog();

  const [disable, setDisable] = useState(false);

  const [vehicleTypeExpandId, setVehicleTypeExpandId] = useState<string | null>(
    null
  );
  const [addPriceTableVehicleTypeId, setAddPriceTableVehicleTypeId] = useState<
    string | null
  >(null);
  const [priceTableExpandId, setPriceTableExpandId] = useState<string | null>(
    null
  );
  const [rowId, setRowId] = useState("");
  const [priceTableRowId, setPriceTableRowId] = useState("");
  const [deletePriceTableId, setDeletePriceTableId] = useState<string>("");
  const [updatePriceTable, setUpdatePriceTable] = useState<PriceTable>();
  const [priceTableStatus, setPriceTableStatus] = useState<PriceTable>();
  const [updatePriceItem, setUpdatePriceItem] = useState<PriceItem[]>();
  const [deleteVehicleTypeId, setDeleteVehicleTypeId] = useState("");
  const [updatePriceItemPriceTableId, setUpdatePriceItemPriceTableId] =
    useState<string>("");

  const {
    goToFirstPage,
    handleChangeRowsPerPage,
    handlePageChange,
    pagination,
  } = usePagination();

  const {
    handleChangeRowsPerPage: handleChangeRowsPerPagePriceItem,
    handlePageChange: handlePageChangePriceItem,
    pagination: paginationPriceItem,
  } = usePagination();

  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);

  const [filterAttribute, setFilterAttribute] =
    useState<keyof VehicleTypeProps>("name");
  const filterOptions = [{ display: "Name", value: "name" }];

  // handle
  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof VehicleTypeProps);
    goToFirstPage();
  };

  const handleExpandClick = (vehicleTypeId: string) => {
    setVehicleTypeExpandId((prev) =>
      prev === vehicleTypeId ? null : vehicleTypeId
    );
    if (vehicleTypeExpandId !== vehicleTypeId && vehicleTypeId !== "") {
      setRowId(vehicleTypeId);
      priceTableRefetch();
    }
  };

  const handleUpdatePriceTableStatus = (priceTable: PriceTable) => {
    setPriceTableStatus(priceTable);
    handleToggleChangeStatusPriceTableDialog();
  };

  const handleUpdatePriceTable = (priceTable: PriceTable) => {
    setUpdatePriceTable(priceTable);
    handleToggleUpdatePriceTableDialog();
  };

  const handleDeleteVehicleType = (vehicleTypeId: string) => {
    setDeleteVehicleTypeId(vehicleTypeId);
    handleToggleDeleteVehicleTypeDialog();
  };

  const handlePriceTableExpandClick = useCallback((priceTableId: string) => {
    setPriceTableExpandId((prev) =>
      prev === priceTableId ? null : priceTableId
    );
    if (priceTableExpandId !== priceTableId && priceTableId !== "") {
      setPriceTableRowId(priceTableId);
      priceItemRefetch();
    }
  }, []);

  const handleAddPriceTable = (vehicleTypeId: string) => {
    setAddPriceTableVehicleTypeId(vehicleTypeId);
    handletoggleCreateDialog();
  };

  const handleDeletePriceTable = (priceTableId: string) => {
    setDeletePriceTableId(priceTableId);
    handleToggleDeletePriceDialog();
  };

  const handleUpdatePriceItem = (
    priceItem: PriceItem[],
    priceTableId: string
  ) => {
    setUpdatePriceItem(priceItem);
    setUpdatePriceItemPriceTableId(priceTableId);
    handleToggleUpdatePriceItemDialog();
  };

  // query
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "/vehicle-types",
      pagination.pageSize,
      pagination.pageIndex,
      debounceSearchText,
      filterAttribute,
    ],
    queryFn: async () => {
      if (!pagination) {
        return;
      }
      return await getListVehicleTypeAPI(
        pagination.pageSize,
        pagination.pageIndex + 1,
        debounceSearchText,
        filterAttribute.toString()
      );
    },
    retry: 0,
  });

  const {
    data: priceTableData,
    isPending: priceTableIsPending,
    refetch: priceTableRefetch,
  } = useQuery({
    queryKey: [`/api/price/vehicle-type/`, rowId],
    queryFn: async () => {
      if (rowId === "") {
        return;
      }
      return getPriceTableByVehicleTypeAPI(rowId);
    },
    retry: 1,
    enabled: rowId !== "",
  });

  const {
    data: priceItemData,
    isPending: priceItemIsPending,
    refetch: priceItemRefetch,
  } = useQuery({
    queryKey: [`/api/price/items`, priceTableRowId],
    queryFn: async () => {
      if (priceTableRowId === "") {
        return;
      }
      return getPriceItemByTableAPI(priceTableRowId, paginationPriceItem);
    },
    retry: 1,
    enabled: priceTableRowId !== "",
  });

  const getPriceItemTableRows = useCallback(
    (priceItems?: PriceItem[]) => {
      if (priceItems === undefined || priceItems.length === 0) {
        return [];
      }
      return priceItems.map((priceItem: PriceItem) => (
        <React.Fragment key={priceItem.id}>
          <TableRow hover={true}>
            <TableCell>{priceItem.applyFromHour ?? "NaN"}</TableCell>
            <TableCell>{priceItem.applyToHour ?? "NaN"}</TableCell>
            <TableCell>{priceItem.minPrice}</TableCell>
            <TableCell>{priceItem.maxPrice}</TableCell>
            <TableCell>{priceItem.blockPricing}</TableCell>
          </TableRow>
        </React.Fragment>
      ));
    },
    [
      paginationPriceItem,
      priceItemData?.data?.data,
      priceItemIsPending,
      priceItemRefetch,
      vehicleTypeExpandId,
      priceTableRowId,
    ]
  );
  useEffect(() => {
    //* reset with every new query
    setDisabledPriority({});
    const priceTable = priceTableData?.data.data;
    if (!priceTable) {
      return;
    }

    priceTable.map((table) => {
      setDisabledPriority((prev) => {
        const newPriority: PriorityDictionary = {};
        newPriority[table.priority] = true;
        return { ...prev, ...newPriority };
      });
    });
  }, [priceTableData?.data.data]);

  const getPriceTableRows = useCallback(
    (priceTables?: PriceTable[]) => {
      if (priceTables === undefined || priceTables.length === 0) {
        return [];
      }
      return priceTables.map((priceTable: PriceTable) => {
        return (
          <React.Fragment key={priceTable.id}>
            <TableRow hover={true}>
              <TableCell>
                <IconButton
                  onClick={() => handlePriceTableExpandClick(priceTable.id)}
                  aria-expanded={priceTableExpandId === priceTable.id}
                  aria-label='show more'
                >
                  {priceTableExpandId === priceTable.id ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </TableCell>
              <TableCell>{priceTable.name}</TableCell>
              <TableCell>{priceTable.priority}</TableCell>
              <TableCell>{priceTable.statusPriceTable}</TableCell>
              <TableCell>
                {priceTable.applyFromDate
                  ? toLocaleDate(priceTable.applyFromDate)
                  : "None"}
              </TableCell>
              <TableCell>
                {priceTable.applyToDate
                  ? toLocaleDate(priceTable.applyToDate)
                  : "None"}
              </TableCell>
              <TableCell>
                <div className='flex flex-row space-x-2'>
                  {priceTable.priority !== 1 && (
                    <>
                      <Button
                        variant='outlined'
                        color='primary'
                        onClick={() => handleUpdatePriceTable(priceTable)}
                        size='small'
                      >
                        Update
                      </Button>
                      <Button
                        variant='outlined'
                        color='primary'
                        onClick={() => handleDeletePriceTable(priceTable.id)}
                        size='small'
                      >
                        Delete
                      </Button>
                      {priceTable.statusPriceTable === "ACTIVE" ? (
                        <Button
                          variant='outlined'
                          color='error'
                          onClick={() =>
                            handleUpdatePriceTableStatus(priceTable)
                          }
                          size='small'
                        >
                          Inactive
                        </Button>
                      ) : (
                        <Button
                          variant='outlined'
                          color='success'
                          onClick={() =>
                            handleUpdatePriceTableStatus(priceTable)
                          }
                          size='small'
                        >
                          Active
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 0 }}
                colSpan={99}
              >
                <Collapse
                  in={priceTableExpandId === priceTable.id}
                  timeout='auto'
                  unmountOnExit
                >
                  <Grid container spacing={1} className='py-1'>
                    <Grid item xs={12}>
                      <Typography variant='h6' component='div'>
                        Price Items
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid
                        item
                        xs={12}
                        container
                        className='gap-1'
                        justifyContent='flex-end'
                      >
                        <Button
                          variant='outlined'
                          color='primary'
                          onClick={() => priceItemRefetch()}
                          disabled={priceItemIsPending}
                        >
                          Refresh
                        </Button>
                        {priceTable.priority !== 1 && (
                          <Button
                            variant='outlined'
                            color='primary'
                            onClick={() =>
                              handleUpdatePriceItem(
                                priceItemData?.data?.data ?? [],
                                priceTable.id
                              )
                            }
                          >
                            Update Price Item
                          </Button>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        {priceItemData?.data?.data?.length === 0 ? (
                          <Typography variant='body1' component='div'>
                            No price item
                          </Typography>
                        ) : (
                          <Table
                            tableHeads={[
                              "Apply From",
                              "Apply To",
                              "Min Price",
                              "Max Price",
                              "BlockPrrice",
                            ]}
                            tableRows={getPriceItemTableRows(
                              priceItemData?.data?.data
                            )}
                            isLoading={priceItemIsPending}
                            onPageChange={handlePageChangePriceItem}
                            onPageSizeChange={handleChangeRowsPerPagePriceItem}
                            pagination={paginationPriceItem}
                            totalRecord={priceItemData?.data.totalRecord}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        );
      });
    },
    [
      priceItemIsPending,
      priceItemRefetch,
      priceTableRowId,
      priceTableExpandId,
      handleChangeRowsPerPagePriceItem,
      handlePageChangePriceItem,
      paginationPriceItem.pageSize,
      paginationPriceItem.pageIndex,
      rowId,
      vehicleTypeExpandId,
      priceTableExpandId,
      handleExpandClick,
      handlePriceTableExpandClick,
    ]
  );

  const tableRows = useMemo(() => {
    const vehicleTypes = data?.data.data;
    if (!vehicleTypes || vehicleTypes.length === 0) {
      return [];
    }

    return vehicleTypes.map((vehicleType: VehicleTypeProps) => (
      <React.Fragment key={vehicleType.id}>
        <TableRow hover={true}>
          <TableCell>
            <IconButton
              onClick={() => {
                handleExpandClick(vehicleType.id);
              }}
              aria-expanded={vehicleTypeExpandId === vehicleType.id}
              aria-label='show more'
            >
              {vehicleTypeExpandId === vehicleType.id ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell>{vehicleType.name}</TableCell>
          <TableCell>{vehicleType.description ?? "Nan"}</TableCell>
          <TableCell>{toVNDateString(vehicleType.createDatetime)}</TableCell>
          <TableCell>
            <div className='flex flex-row space-x-2'>
              <EditVehicleType
                id={vehicleType.id}
                refetch={refetch}
                setIsPending={setDisable}
                disable={disable}
                value={vehicleType}
              />
              <Button
                variant='outlined'
                color='error'
                onClick={() => handleDeleteVehicleType(vehicleType.id)}
                size='small'
              >
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse
              in={vehicleTypeExpandId === vehicleType.id}
              timeout='auto'
              unmountOnExit
            >
              <Grid container spacing={1} className='py-1'>
                <Grid item xs={12}>
                  <Typography variant='h6' component='div'>
                    Price Tables
                  </Typography>
                </Grid>
                <Grid item xs={12} spacing={1} container>
                  <Grid
                    item
                    xs={12}
                    container
                    className='gap-5'
                    justifyContent='flex-end'
                  >
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={() => priceTableRefetch()}
                      disabled={priceTableIsPending}
                    >
                      Refresh
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => handleAddPriceTable(vehicleType.id)}
                      disabled={priceTableIsPending}
                    >
                      Create Price Table
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    {priceTableData?.data?.data?.length === 0 ? (
                      <Typography variant='body1' component='div'>
                        No price table
                      </Typography>
                    ) : (
                      <TableNonPage
                        tableHeads={[
                          "",
                          "Name",
                          "Priority",
                          "Status",
                          "Apply From",
                          "Apply To",
                          "Action",
                        ]}
                        tableRows={getPriceTableRows(
                          priceTableData?.data?.data
                        )}
                        isLoading={priceTableIsPending}
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
    priceItemData?.data?.data,
    priceItemIsPending,
    priceItemRefetch,
    priceTableRowId,
    priceTableExpandId,
    handleChangeRowsPerPagePriceItem,
    handlePageChangePriceItem,
    paginationPriceItem,
    rowId,
    vehicleTypeExpandId,
    priceTableExpandId,
    handleExpandClick,
    handlePriceTableExpandClick,
    getPriceTableRows,
  ]);

  return (
    <>
      {openDeleteVehicleTypeDialog && (
        <DeleteVehicleType
          id={deleteVehicleTypeId}
          refetch={refetch}
          setIsPending={setDisable}
          disable={disable}
          onOpenChange={handleToggleDeleteVehicleTypeDialog}
          open={openDeleteVehicleTypeDialog}
          onClose={handleToggleDeleteVehicleTypeDialog}
        />
      )}
      {openUpdatePriceItemDialog && (
        <UpdatePriceItem
          open={openUpdatePriceItemDialog}
          onClose={handleToggleUpdatePriceItemDialog}
          priceItems={updatePriceItem ? updatePriceItem.slice(1) : []}
          priceTableId={updatePriceItemPriceTableId}
          refetch={priceItemRefetch}
          onOpenChange={handleToggleUpdatePriceItemDialog}
        />
      )}
      {openChangeStatusPriceTableDialog && (
        <InactiveAndActivePrice
          open={openChangeStatusPriceTableDialog}
          onClose={handleToggleChangeStatusPriceTableDialog}
          priceTable={priceTableStatus}
          refetch={priceTableRefetch}
          onOpenChange={handleToggleChangeStatusPriceTableDialog}
        />
      )}
      {openUpdatePriceTableDialog && (
        <UpdatePrice
          open={openUpdatePriceTableDialog}
          onClose={handleToggleUpdatePriceTableDialog}
          priceTable={updatePriceTable}
          refetch={priceTableRefetch}
          onOpenChange={handleToggleUpdatePriceTableDialog}
        />
      )}
      {openDeletePriceDialog && (
        <DeletePriceTable
          open={openDeletePriceDialog}
          onClose={handleToggleDeletePriceDialog}
          priceTableId={deletePriceTableId}
          refetch={priceTableRefetch}
          onOpenChange={handleToggleDeletePriceDialog}
        />
      )}
      {openCreateDialog && (
        <AddPriceTable
          availPriority={disabledPriority}
          open={openCreateDialog}
          onClose={handletoggleCreateDialog}
          VehicleTypeId={addPriceTableVehicleTypeId}
          refetch={priceTableRefetch}
          onOpenChange={handletoggleCreateDialog}
        />
      )}
      <div className='flex flex-col gap-5'>
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
        <div className='flex flex-row gap-3 items-center justify-end w-full'>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => refetch()}
            disabled={false}
          >
            Refresh
          </Button>
          <CreateVehicleType
            refetch={refetch}
            setIsPending={setDisable}
            disable={disable}
          />
        </div>
        {isLoading && <Loading />}
        {isError && <p>Error: {error.message}</p>}
        {isSuccess && (
          <Table
            onPageChange={handlePageChange}
            onPageSizeChange={handleChangeRowsPerPage}
            pagination={pagination}
            tableHeads={VehicleTypeTableHeaders}
            tableRows={tableRows}
            isLoading={isLoading}
            totalRecord={data?.data.totalRecord}
          />
        )}
      </div>
    </>
  );
}
