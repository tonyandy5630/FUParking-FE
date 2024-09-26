"use client";

import { getListPackage, updatePackageAPI } from "@/api/package";
import { Packages } from "@/types/package.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
import SelectFilter from "@/components/Common/selectFilter";
import SearchField from "@/components/Common/searchField";
import Loading from "../LoadingPage/Loading";
import { formatPrice } from "@/utils/price";
import SearchContainer from "@/components/Common/SearchContainer";
import Chip from "@/components/Chip";
import usePagination from "@/hook/usePagination";
import useSearchDebounce from "@/hook/useSearchDebouce";
import Table from "@/components/Table";
import { PackageTableHeaders } from "./table-headers";
import dynamic from "next/dynamic";
import ActionArea from "@/components/ActionArea";
import { Button } from "@mui/material";
import useHandleDialog from "@/hook/useHandleDialog";
import AddPackageDialog from "./AddPackage";
import { toVNDateString } from "@/utils/date";
import UpdatePackageDialog from "./UpdatePackage";
import ActionButton from "@/components/ActionButton";
import AlertDialog from "@/components/Dialog/ConfirmDialog";
import { UpdatePackageSchemaType } from "@/utils/schemas/PackageSchema";
import { toast } from "react-toastify";
import DeletePackage from "./Action/DeletePackage";
import EditPackage from "./Action/EditPackage";

type FilterOption = {
  display: string;
  value: string;
};

export const expDurationIncrement = [10, 20, 30];

const filterOptions: FilterOption[] = [
  { display: "Name", value: "name" },
  { display: "Coin Amount", value: "coinAmount" },
  { display: "Extra Coin", value: "extraCoin" },
  { display: "Exp Package", value: "expPackage" },
  { display: "Status", value: "packageStatus" },
];

export default function PackageTable() {
  const {
    goToFirstPage,
    handleChangeRowsPerPage,
    handlePageChange,
    pagination,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);
  const { openDialog: openAddDialog, handleToggleDialog: toggleAddDialog } =
    useHandleDialog(false);
  const {
    openDialog: openUpdateDialog,
    handleToggleDialog: toggleUpdateDialog,
  } = useHandleDialog(false);
  const {
    openDialog: openDeletePackageDialog,
    handleToggleDialog: toggleDeletePackageDialog,
  } = useHandleDialog(false);
  const {
    openDialog: openStatusChangeDialog,
    handleToggleDialog: toggleStatusChangeDialog,
  } = useHandleDialog(false);

  const {
    openDialog: openEditPackageDialog,
    handleToggleDialog: toggleEditPackageDialog,
  } = useHandleDialog(false);

  const [updatePackage, setUpdatePackage] = useState<Packages | undefined>();
  const [isActivateOrDeactivate, setIsActivateOrDeactivate] = useState(true);
  const [deletePackageId, setDeletePackageId] = useState<string>("");
  const [EditPackageObject, setEditPackageObject] = useState<Packages>();

  const [filterAttribute, setFilterAttribute] =
    useState<keyof Packages>("name");

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof Packages);
    goToFirstPage();
  };

  const {
    mutateAsync: updatePackageStatusAsync,
    isPending: isPendingUpdatePackage,
  } = useMutation({
    mutationKey: ["/update-status-package"],
    mutationFn: updatePackageAPI,
  });

  const handleClickActiveOrDeactivate = (pack: Packages) => {
    setUpdatePackage(pack);
    toggleStatusChangeDialog();
  };

  const handleDeletePackage = (id: string) => {
    setDeletePackageId(id);
    toggleDeletePackageDialog();
  };

  const handleUpdatePackageStatus = async (data: Packages) => {
    try {
      const updateData: UpdatePackageSchemaType = {
        isActive: data.packageStatus !== "ACTIVE",
        name: data.name,
        packageId: data.id,
      };
      await updatePackageStatusAsync(updateData, {
        onSuccess: () => {
          toast.success("Change Package Status successfully");
          refetch();
        },
      });
    } catch (error) {}
  };

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "/packages",
      pagination.pageSize,
      pagination.pageIndex,
      debounceSearchText,
      filterAttribute,
    ],
    queryFn: () =>
      getListPackage(
        pagination.pageSize,
        pagination.pageIndex + 1,
        filterAttribute,
        debounceSearchText
      ),
    retry: 1,
  });

  const handleCloseDialog = () => {
    toggleUpdateDialog();
    setUpdatePackage(undefined);
  };

  const handleUpdateDialogOpen = (value: Packages) => {
    setUpdatePackage(value);
    toggleUpdateDialog();
  };

  const handleEditPackage = (value: Packages) => {
    setEditPackageObject(value);
    toggleEditPackageDialog();
  };

  const handleCloseStatusChangeDialog = () => {
    setUpdatePackage(undefined);
    toggleStatusChangeDialog();
  };

  const tableRows = useMemo(() => {
    const packages = data?.data.data;
    if (!packages || packages.length === 0) {
      return [];
    }

    return packages.map((packs: Packages, index) => (
      <TableRow key={packs.id} hover={true} className="cursor-pointer">
        <TableCell>{packs.name}</TableCell>
        <TableCell>{formatPrice(parseInt(packs.coinAmount))}</TableCell>
        <TableCell>{formatPrice(parseInt(packs.extraCoin))}</TableCell>
        <TableCell>
          {parseInt(packs.expPackage) > 1
            ? `${packs.expPackage} days`
            : `${packs.expPackage} day`}
        </TableCell>
        <TableCell>{formatPrice(parseInt(packs.price))}</TableCell>
        <TableCell>
          <Chip
            variant={packs.packageStatus === "ACTIVE" ? "success" : "error"}
          >
            {packs.packageStatus}
          </Chip>
        </TableCell>
        <TableCell>{packs.createDate}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            {packs.packageStatus === "ACTIVE" ? (
              <ActionButton
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickActiveOrDeactivate(packs);
                }}
                color="error"
              >
                Deactivate
              </ActionButton>
            ) : (
              <ActionButton
                variant="outlined"
                color="primary"
                onClick={async (e) => {
                  e.stopPropagation();
                  handleClickActiveOrDeactivate(packs);
                }}
              >
                Activate
              </ActionButton>
            )}
            <ActionButton
              variant="outlined"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePackage(packs.id);
              }}
            >
              Delete
            </ActionButton>
            <ActionButton
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                handleEditPackage(packs);
              }}
              color="primary"
            >
              Edit
            </ActionButton>
          </div>
        </TableCell>
      </TableRow>
    ));
  }, [data?.data.data]);

  return (
    <>
      {openEditPackageDialog && EditPackageObject && (
        <EditPackage
          open={openEditPackageDialog}
          packageObject={EditPackageObject}
          onClose={toggleEditPackageDialog}
          onOpenChange={toggleEditPackageDialog}
          refetch={refetch}
        />
      )}
      {openDeletePackageDialog && (
        <DeletePackage
          open={openDeletePackageDialog}
          id={deletePackageId}
          onOpenChange={toggleDeletePackageDialog}
          refetch={refetch}
          onClose={toggleDeletePackageDialog}
        />
      )}
      {updatePackage && openStatusChangeDialog && (
        <AlertDialog
          open={openStatusChangeDialog}
          onCancel={handleCloseStatusChangeDialog}
          onOpenChange={handleCloseStatusChangeDialog}
          onConfirm={async () => await handleUpdatePackageStatus(updatePackage)}
          title={
            isActivateOrDeactivate
              ? "Deactivate this package ?"
              : "Activate this package ?"
          }
          onClose={handleCloseStatusChangeDialog}
        />
      )}
      {updatePackage && (
        <UpdatePackageDialog
          open={openUpdateDialog}
          onClose={handleCloseDialog}
          onOpenChange={toggleUpdateDialog}
          successCallback={() => {
            refetch();
          }}
          value={updatePackage}
        />
      )}
      <AddPackageDialog
        open={openAddDialog}
        onClose={toggleAddDialog}
        onOpenChange={toggleAddDialog}
        successCallback={() => {
          refetch();
        }}
      />
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
      <ActionArea>
        <div className="flex gap-2 items-center justify-end w-full py-2">
          <Button variant="outlined" onClick={() => toggleAddDialog()}>
            New Package
          </Button>
          <Button variant="outlined" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
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
            tableHeads={PackageTableHeaders}
            tableRows={tableRows}
            isLoading={isLoading}
            totalRecord={data.data.totalRecord}
          />
        ))}
    </>
  );
}
