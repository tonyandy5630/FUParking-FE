"use client";
import { useEffect, useState } from "react";
import SelectFilter from "../../Common/selectFilter";
import SearchField from "../../Common/searchField";
import { CustomerWithFillerProps } from "@/types/customer.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  changeStatusCustomerAPI,
  getListCustomerWithFillerAPI,
} from "@/api/customer";
const TableContainer = dynamic(() => import("@mui/material/TableContainer"));
const Table = dynamic(() => import("@mui/material/Table"));
const TableHead = dynamic(() => import("@mui/material/TableHead"));
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
const TableBody = dynamic(() => import("@mui/material/TableBody"));
const TablePagination = dynamic(() => import("@mui/material/TablePagination"));
import Button from "@mui/material/Button";
import Loading from "../LoadingPage/Loading";
import { toast } from "react-toastify";
import AddCustomer from "./addCustomer";
import dynamic from "next/dynamic";
import SearchContainer from "@/components/Common/SearchContainer";
import PageTitle from "@/components/PageTitle";

export default function Customer() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAttribute, setFilterAttribute] =
    useState<keyof CustomerWithFillerProps>("fullName");
  const { data, isLoading, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ["/customer", rowsPerPage, page, searchTerm, filterAttribute],
    queryFn: () =>
      getListCustomerWithFillerAPI(
        rowsPerPage,
        page,
        searchTerm,
        filterAttribute.toString()
      ),
    retry: 1,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
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

  const filterOptions = [
    { display: "Name", value: "fullName" },
    { display: "Email", value: "email" },
    { display: "Type Customer", value: "customerType" },
    { display: "Status", value: "statusCustomer" },
  ];

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof CustomerWithFillerProps);
  };

  return (
    <>
      <PageTitle>Customer List</PageTitle>
      <SearchContainer>
        <SelectFilter
          filterAttribute={filterAttribute}
          setFilterAttribute={handleFilterAttributeChange}
          listFilter={filterOptions}
        />
        <SearchField inputValue={inputValue} setInputValue={setInputValue} />
      </SearchContainer>
      <div className='flex flex-row gap-3 items-center justify-start w-full'>
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.data?.map((row) => (
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
                        {row.statusCustomer === "INACTIVE" && (
                          <Button
                            sx={{
                              backgroundColor: "#3b82f6",
                              color: "white",
                              width: "80px",
                              "&:disabled": {
                                backgroundColor: "grey",
                                color: "white",
                              },
                              "&:hover": {
                                backgroundColor: "#2563eb",
                              },
                            }}
                            onClick={() => onStatusChange(true, row.customerId)}
                            disabled={changeStatusCustomerMutation.isPending}
                          >
                            Active
                          </Button>
                        )}
                        {row.statusCustomer === "ACTIVE" && (
                          <Button
                            sx={{
                              backgroundColor: "#ef4444",
                              color: "white",
                              width: "80px",
                              "&:disabled": {
                                backgroundColor: "grey",
                                color: "white",
                              },
                              "&:hover": {
                                backgroundColor: "#dc2626",
                              },
                            }}
                            onClick={() =>
                              onStatusChange(false, row.customerId)
                            }
                            disabled={changeStatusCustomerMutation.isPending}
                          >
                            Deactive
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              count={data.data.totalRecord || -1}
              page={page - 1}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        ))}
    </>
  );
}
