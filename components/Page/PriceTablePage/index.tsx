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
import { Button } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import PriceTableHeaders from "./table-headers";

export default function PriceTablePage() {
  const [searchText, setSearchText] = useState("");
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
          toast.success(UPDATE_SUCCEED_MESSAGE);
          refetch();
        },
      });
    } catch (error) {
      //   toast.error("Something went wrong");
    }
  };

  const tableRows = useMemo(() => {
    return tableList.map((item) => {
      return (
        <TableRow key={item.priceTableId}>
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
