"use client";
import SearchContainer from "@/components/Common/SearchContainer";
import SearchField from "@/components/Common/searchField";
import PageTitle from "@/components/PageTitle";
import { useDebounce } from "use-debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { changeVehicleStatusAPI, getListVehicleAPI } from "@/api/vehicle";
import DataTable from "@/components/Table";
import VehicleTableHeaders from "./table-headers";
const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
import { PaginationType } from "@/types/pagination.type";
import dynamic from "next/dynamic";
import { SearchAttribute, VehicleProps } from "@/types/vehicle.type";
import SelectFilter, { listFilter } from "@/components/Common/selectFilter";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import Chip from "@/components/Chip";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const FILTER: listFilter[] = [
  { display: "Plate Number", value: "PLATENUMBER" },
  { display: "Email", value: "EMAIL" },
];

export default function VehiclePage() {
  const pathname = usePathname();
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationType>({
    pageSize: 5,
    pageIndex: 0,
  });
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("keyword") ?? ""
  );
  const [filter, setFilter] = useState<SearchAttribute>(
    (searchParams.get("filter") as SearchAttribute) ?? "PLATENUMBER"
  );
  const [vehicleList, setVehicleList] = useState<Array<VehicleProps>>([]);

  const [debouncePlateText] = useDebounce(searchText, 750);
  const vehicleStatusChangeMutation = useMutation({
    mutationKey: ["/status-vehicle-change"],
    mutationFn: changeVehicleStatusAPI,
  });

  const {
    data: vehicleData,
    isSuccess,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "/search-vehicle-plate-number",
      pagination.pageSize,
      pagination.pageIndex,
      debouncePlateText,
      filter,
    ],
    queryFn: () =>
      getListVehicleAPI({
        pageSize: pagination.pageSize,
        pageIndex: pagination.pageIndex,
        SearchInput: debouncePlateText,
        Attribute: filter,
      }),
    placeholderData: keepPreviousData,
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleSearchTextChange = (value: string) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSearchText(value);
    router.push(pathname + "?" + createQueryString("keyword", value));
  };

  const handleFilterChange = (value: string) => {
    setFilter(value as SearchAttribute);
    router.push(pathname + "?" + createQueryString("filter", value));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPage }));
  };

  const handleChangeRowsPerPage = (size: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: size,
      pageIndex: 0,
    }));
  };

  const handleVehicleStatusChange = async (vehicleData: {
    vehicleId: string;
    isActive: boolean;
  }) => {
    try {
      await vehicleStatusChangeMutation.mutateAsync(vehicleData, {
        onSuccess: (res) => {
          toast.success("Update successfully");
          refetch();
        },
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (isSuccess && vehicleData.data.data) {
      setVehicleList(vehicleData.data.data || []);
    }
  }, [isSuccess, vehicleData]);

  const vehicleTableRows = useMemo(() => {
    return vehicleList.map((item: VehicleProps) => (
      <TableRow key={item.id}>
        <TableCell>{item.email}</TableCell>
        <TableCell>{item.plateNumber}</TableCell>
        <TableCell>{item.vehicleType}</TableCell>
        <TableCell>
          <img width={100} height={65} src={item.plateImage} />
        </TableCell>
        <TableCell>
          <Chip
            variant={item.statusVehicle === "ACTIVE" ? "success" : "warning"}
          >
            {item.statusVehicle}
          </Chip>
        </TableCell>
        <TableCell>
          <div className='flex justify-evenly items-center gap-1 min-w-full'>
            {(() => {
              switch (item.statusVehicle) {
                case "ACTIVE":
                  return (
                    <Button
                      variant='contained'
                      color='error'
                      onClick={() =>
                        handleVehicleStatusChange({
                          vehicleId: item.id,
                          isActive: false,
                        })
                      }
                    >
                      DEACTIVE
                    </Button>
                  );
                case "INACTIVE":
                  return (
                    <Button
                      variant='contained'
                      onClick={() =>
                        handleVehicleStatusChange({
                          vehicleId: item.id,
                          isActive: true,
                        })
                      }
                    >
                      Unban
                    </Button>
                  );
              }
            })()}
          </div>
        </TableCell>
      </TableRow>
    ));
  }, [vehicleList]);

  return (
    <>
      <PageTitle>Vehicle List</PageTitle>
      <SearchContainer>
        <SelectFilter
          filterAttribute={filter}
          setFilterAttribute={handleFilterChange}
          listFilter={FILTER}
        />
        <SearchField
          inputValue={searchText}
          setInputValue={handleSearchTextChange}
        />
      </SearchContainer>
      <DataTable
        tableHeads={VehicleTableHeaders}
        tableRows={vehicleTableRows}
        pagination={pagination}
        totalRecord={vehicleData?.data.totalRecord ?? 999}
        onPageChange={handlePageChange}
        onPageSizeChange={handleChangeRowsPerPage}
      />
    </>
  );
}
