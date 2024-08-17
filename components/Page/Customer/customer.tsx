"use client";
import { useMemo, useState } from "react";
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
import AddCustomer from "./addCustomer";
import dynamic from "next/dynamic";
import SearchContainer from "@/components/Common/SearchContainer";
import PageTitle from "@/components/PageTitle";
import AlertDialog from "@/components/Dialog/ConfirmDialog";
import ActionButton from "@/components/ActionButton";
import { useDebounce } from "use-debounce";
import { DEBOUNCE_DELAY } from "@/constant/debounce";
import usePagination from "@/hook/usePagination";
import Table from "@/components/Table";
import { CustomerTableHeaders } from "./table-headers";

const filterOptions = [
  { display: "Name", value: "fullName" },
  { display: "Email", value: "email" },
  { display: "Type Customer", value: "customerType" },
  { display: "Status", value: "statusCustomer" },
];

export default function Customer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchText] = useDebounce(searchTerm, DEBOUNCE_DELAY);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isActiveOrDeActive, setIsActiveOrDeActive] = useState(false); //* true = Active , false = Deactive
  const {
    pagination,
    handleChangeRowsPerPage,
    handlePageChange,
    setPagination,
  } = usePagination();
  const [rowId, setRowId] = useState("");

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

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleSearchTextChange = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const changeStatusCustomerMutation = useMutation({
    mutationKey: ["/customer/status"],
    mutationFn: changeStatusCustomerAPI,
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

  const tableRows = useMemo(() => {
    const customers = data?.data.data;
    if (!customers || customers.length === 0) {
      return [];
    }

    return customers.map((row) => (
      <TableRow key={row.customerId}>
        <TableCell>{row.fullName}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>
          {row.customerType === "PAID" ? (
            <span className='inline-block bg-green-200 text-green-800 px-2 py-1 rounded w-16 text-center'>
              Paid
            </span>
          ) : row.customerType === "FREE" ? (
            <span className='inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded w-16 text-center'>
              Free
            </span>
          ) : (
            <span>{row.customerType}</span>
          )}
        </TableCell>
        <TableCell>
          {row.statusCustomer === "ACTIVE" ? (
            <span
              className='p-1 pl-2 pr-2 rounded-xl inline-block w-16 text-center'
              style={{
                color: "#62a34f",
                backgroundColor: "#dcfce7",
              }}
            >
              Active
            </span>
          ) : row.statusCustomer === "INACTIVE" ? (
            <span
              className='p-1 pl-2 pr-2 rounded-xl inline-block w-16 text-center'
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
          <div className='flex flex-row gap-3'>
            {(() => {
              if (row.statusCustomer === "INACTIVE") {
                return (
                  <>
                    <ActionButton
                      variant='primary'
                      onClick={() => handleOpenDialog(row.customerId, true)}
                      disabled={changeStatusCustomerMutation.isPending}
                    >
                      Activate
                    </ActionButton>
                  </>
                );
              } else if (row.statusCustomer === "ACTIVE") {
                return (
                  <ActionButton
                    variant='danger'
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
    ));
  }, [data?.data.data]);

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof CustomerWithFillerProps);
  };

  return (
    <>
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
          inputValue={searchTerm}
          setInputValue={handleSearchTextChange}
        />
      </SearchContainer>
      <div className='flex flex-row gap-3 items-center justify-start w-full py-2'>
        <AddCustomer
          disabled={changeStatusCustomerMutation.isPending}
          refetch={refetch}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={() => refetch()}
          disabled={changeStatusCustomerMutation.isPending}
        >
          Refresh
        </Button>
      </div>
      {isLoading && <Loading />}
      {isError && <p>Something wrong, please trying again later...</p>}
      {isSuccess &&
        (data.data.totalRecord === 0 ? (
          <p>There is no data to show.</p>
        ) : (
          <>
            <Table
              onPageChange={handlePageChange}
              onPageSizeChange={handleChangeRowsPerPage}
              pagination={pagination}
              tableHeads={CustomerTableHeaders}
              tableRows={tableRows}
              isLoading={isLoading}
              totalRecord={data.data.totalRecord}
            />
          </>
        ))}
    </>
  );
}
