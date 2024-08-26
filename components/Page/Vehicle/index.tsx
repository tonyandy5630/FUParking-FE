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
import { toast } from "react-toastify";
import Chip from "@/components/Chip";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getAllVehicleTypeAPI } from "@/api/vehicleType";
import { VehicleTypeProps } from "@/types/vehicleType.type";
import ExportToCSVButton from "@/components/ExportCSVButton";
import ActionButton from "@/components/ActionButton";
import Loading from "../LoadingPage/Loading";
import { Button } from "@mui/material";
import Image from "next/image";
const AlertDialog = dynamic(() => import("@/components/Dialog/ConfirmDialog"), {
  loading: () => <Loading />,
});
const EditVehicleDialog = dynamic(() => import("./EditVehicleDialog"));

const FILTER: listFilter[] = [
  { display: "Plate Number", value: "PLATENUMBER" },
  { display: "Email", value: "EMAIL" },
  { display: "Vehicle Type", value: "VEHICLETYPE" },
];

const ALL_VEHICLE_TYPE_VALUE = "ALL";

export default function VehiclePage() {
  const pathname = usePathname();
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationType>({
    pageSize: 5,
    pageIndex: 0,
  });
  //* open alert dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isActiveOrDeActive, setIsActiveOrDeActive] = useState(false);
  const [rowId, setRowId] = useState("");

  //* open update dialog
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateVehicle, setUpdateVehicle] = useState<VehicleProps>();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("keyword")?.toString() ?? ""
  );
  const [filter, setFilter] = useState<SearchAttribute>(
    (searchParams.get("filter") as SearchAttribute) ?? "PLATENUMBER"
  );
  const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeProps[]>([]);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState(
    searchParams.get("vehicleType")?.toString() ?? ""
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

  const {
    data: vehicleTypesData,
    isSuccess: isTypesSuccess,
    isLoading: isTypesLoading,
  } = useQuery({
    queryKey: ["/vehicles/get-all-vehicle-types"],
    queryFn: getAllVehicleTypeAPI,
  });

  useEffect(() => {
    if (searchParams.get("filter") !== "") {
      setFilter(
        (searchParams.get("filter") as SearchAttribute) ?? "PLATENUMBER"
      );
    }

    if (searchParams.get("vehicleType") !== "") {
      setSelectedVehicleTypes(
        (searchParams.get("vehicleType") as string) ?? ""
      );
    }

    if (searchParams.get("keyword") !== "") {
      setSearchText((searchParams.get("keyword") as string) ?? "");
    }
    refetch();
  }, [pathname, searchParams]);

  useEffect(() => {
    if (isSuccess && vehicleData.data.data) {
      setVehicleList(vehicleData.data.data || []);
    }
  }, [isSuccess, vehicleData]);

  const handleToggleConfirmBox = () => {
    setOpenConfirmDialog((prev) => !prev);
  };

  const handleOpenConfirmBox = (id: string, isActive: boolean) => {
    setIsActiveOrDeActive(isActive);
    setRowId(id);
    handleToggleConfirmBox();
  };

  const createQueryString = useCallback(
    (newParam: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      newParam.map(({ name, value }) => {
        params.set(name, value);
      });

      return params.toString();
    },
    [searchParams]
  );

  const formatVehicleTypesFilter = useMemo(() => {
    if (isTypesSuccess) {
      const types = vehicleTypesData.data.data;
      if (types) {
        const list: listFilter[] = [
          {
            display: "All",
            value: ALL_VEHICLE_TYPE_VALUE,
          },
        ];
        const newList = list.concat(
          types.map((item) => {
            const filter: listFilter = {
              display: item.description,
              value: item.id,
            };
            return filter;
          })
        );
        setVehicleTypes(types);

        return newList;
      }
    }
  }, [isTypesSuccess, vehicleTypesData]);

  const handleSearchTextChange = (value: string) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSearchText(value);
    router.push(
      pathname + "?" + createQueryString([{ name: "keyword", value }])
    );
  };

  const handleVehicleTypeChange = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));

    let currentFilter: SearchAttribute = "VEHICLETYPE";
    let keyword = vehicleTypes.find((item) => item.id === value)?.name ?? "";
    let vehicleTypeValue = value;
    if (value === ALL_VEHICLE_TYPE_VALUE) {
      keyword = "";
      currentFilter = "PLATENUMBER";
      vehicleTypeValue = "";
    }
    setSelectedVehicleTypes(vehicleTypeValue);

    setSearchText(keyword);
    setFilter(currentFilter);
    router.push(
      pathname +
        "?" +
        createQueryString([
          { name: "vehicleType", value: vehicleTypeValue },
          { name: "filter", value: currentFilter },
          {
            name: "keyword",
            value: keyword,
          },
        ])
    );
  };
  const handleFilterChange = (value: string) => {
    setFilter(value as SearchAttribute);
    if (value === "All") {
      window.history.replaceState(null, "", pathname);
    }

    router.push(
      pathname + "?" + createQueryString([{ name: "filter", value }])
    );
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

  const handleUpdateVehicle = (vehicle: VehicleProps) => {
    if (!vehicle) {
      return;
    }
    setUpdateVehicle(vehicle);
    setOpenUpdateDialog(true);
  };

  const handleOpenChangeUpdateDialog = () => {
    setOpenUpdateDialog((prev) => !prev);
    refetch();
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

  const vehicleTableRows = useMemo(() => {
    return vehicleList.map((item: VehicleProps) => (
      <TableRow key={item.id}>
        <TableCell>{item.email}</TableCell>
        <TableCell>{item.plateNumber}</TableCell>
        <TableCell>{item.vehicleType}</TableCell>
        <TableCell>
          <Image
            width={100}
            height={65}
            src={item.plateImage}
            alt="vehicle"
            loader={() => item.plateImage as string}
          />
        </TableCell>
        <TableCell>
          <Chip
            variant={
              item.statusVehicle === "ACTIVE"
                ? "success"
                : item.statusVehicle === "PENDING"
                ? "warning"
                : "error"
            }
          >
            {item.statusVehicle}
          </Chip>
        </TableCell>
        <TableCell>
          <div className="flex justify-start items-center gap-1 min-w-full">
            {(() => {
              switch (item.statusVehicle) {
                case "ACTIVE":
                  return (
                    <ActionButton
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenConfirmBox(item.id, false);
                      }}
                    >
                      DEACTIVATE
                    </ActionButton>
                  );
                case "INACTIVE":
                  return (
                    <ActionButton
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenConfirmBox(item.id, true);
                      }}
                    >
                      ACTIVATE
                    </ActionButton>
                  );
                case "PENDING":
                  return (
                    <div className="flex justify-between items-center gap-2">
                      <ActionButton
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateVehicle(item);
                        }}
                      >
                        Edit
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenConfirmBox(item.id, false);
                        }}
                      >
                        DEACTIVATE
                      </ActionButton>
                    </div>
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
      {openConfirmDialog && (
        <AlertDialog
          open={openConfirmDialog}
          onOpenChange={handleToggleConfirmBox}
          title={
            isActiveOrDeActive
              ? "Re-Activate this vehicle ?"
              : "Deactivate this vehicle ?"
          }
          onCancel={handleToggleConfirmBox}
          onConfirm={() => {
            handleVehicleStatusChange({
              vehicleId: rowId,
              isActive: isActiveOrDeActive,
            });
          }}
        />
      )}
      {updateVehicle && (
        <EditVehicleDialog
          open={openUpdateDialog}
          onOpenChange={handleOpenChangeUpdateDialog}
          vehicle={updateVehicle}
          onClose={handleOpenChangeUpdateDialog}
          successCallback={() => {
            refetch();
          }}
        />
      )}

      <PageTitle>Vehicle List</PageTitle>
      <SearchContainer>
        <SelectFilter
          label="Vehicle Type"
          filterAttribute={selectedVehicleTypes}
          listFilter={formatVehicleTypesFilter ?? []}
          setFilterAttribute={handleVehicleTypeChange}
        />
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
      <div className="min-w-full flex justify-end items-center py-2 gap-5">
        <ExportToCSVButton data={vehicleList} />
        <Button variant="outlined" color="primary" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
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
