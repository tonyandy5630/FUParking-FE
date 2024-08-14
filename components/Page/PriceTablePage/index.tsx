"use client";
import { getPriceTableAPI, updatePriceTableStatusAPI } from "@/api/price";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
const AddPriceTableDialog = dynamic(() => import("./AddPriceTable"));

export default function PriceTablePage() {
  const [searchText, setSearchText] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const router = useRouter();
  const { pagination, handleChangeRowsPerPage, handlePageChange } =
    usePagination();
  const [tableList, setTableList] = useState<PriceTable[]>([]);
  const {
    data: priceTableData,
    isSuccess,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/get-price-table"],
    queryFn: getPriceTableAPI,
  });

  const handleOpenCreatePriceTable = () => {
    setOpenCreate((prev) => !prev);
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
          component={Link}
          key={item.priceTableId}
          href={"price/" + item.priceTableId + "/price-item"}
          className='hover:bg-slate-300 transition  ease-in-out cursor-pointer'
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
                      <Button
                        variant='contained'
                        color='error'
                        onClick={() =>
                          handleTableStatusChange({
                            priceTableId: item.priceTableId,
                            isActive: false,
                          })
                        }
                      >
                        DEACTIVATE
                      </Button>
                    );
                  case "INACTIVE":
                    return (
                      <Button
                        variant='contained'
                        onClick={() =>
                          handleTableStatusChange({
                            priceTableId: item.priceTableId,
                            isActive: true,
                          })
                        }
                      >
                        RE-ACTIVE
                      </Button>
                    );
                }
              })()}
            </div>
          </TableCell>
        </TableRow>
      );
    });
  }, [tableList]);

  return (
    <>
      <PageTitle>Price Page</PageTitle>
      <SearchContainer>
        <SearchField
          inputValue={searchText}
          setInputValue={setSearchText}
          placeholder={"Enter price table name"}
        />
      </SearchContainer>
      <div className='min-w-full flex justify-start items-center py-2'>
        <Button variant='outlined' onClick={handleOpenCreatePriceTable}>
          <AddIcon /> <span>New Table</span>
        </Button>
      </div>
      <AddPriceTableDialog
        open={openCreate}
        onOpenChange={handleOpenCreatePriceTable}
      />
      <Table
        onPageChange={handlePageChange}
        onPageSizeChange={handleChangeRowsPerPage}
        pagination={pagination}
        tableHeads={PriceTableHeaders}
        tableRows={tableRows}
        totalRecord={priceTableData?.data.totalRecord}
      />
    </>
  );
}
