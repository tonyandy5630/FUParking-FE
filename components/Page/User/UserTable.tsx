"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import SelectFilter from "@/components/Common/selectFilter";
import SearchField from "@/components/Common/searchField";
import Loading from "../LoadingPage/Loading";
import { User } from "@/types/user.type";
import { getListUser } from "@/api/user";
import toLocaleDate from "@/utils/date";
import Table from "@/components/Table";
import usePagination from "@/hook/usePagination";
import SearchContainer from "@/components/Common/SearchContainer";
import { UserTableHeaders } from "./table-headers";
import Chip from "@/components/Chip";
import { useDebounce } from "use-debounce";
import useSearchDebounce from "@/hook/useSearchDebouce";
import { FormOptions } from "@/components/Form/Select";
import ActionArea from "@/components/ActionArea";
import { Button } from "@mui/material";
import useHandleDialog from "@/hook/useHandleDialog";
import AddUserDialog from "./AddUser";
import Delete from "./Delete";
import DeactivateAndActiveUser from "./Action/DeactivateAndActiveUser";
import EditUser from "./Action/EditUser";

type FilterOption = {
  display: string;
  value: string;
};

export const RoleOptions: FormOptions[] = [
  {
    name: "Staff",
    value: "staff",
  },
  {
    name: "Manager",
    value: "manager",
  },
  {
    name: "Supervisor",
    value: "supervisor",
  },
];

const filterOptions: FilterOption[] = [
  { display: "Name", value: "name" },
  { display: "Role", value: "role" },
  { display: "Status", value: "packageStatus" },
];

export default function UserTable() {
  const {
    pagination,
    handleChangeRowsPerPage,
    handlePageChange,
    goToFirstPage,
  } = usePagination();
  const { debounceSearchText, handleSearchTextChange, searchText } =
    useSearchDebounce(goToFirstPage);
  const { openDialog: openAddDialog, handleToggleDialog: toggleAddDialog } =
    useHandleDialog(false);

  const {
    openDialog: openChangeStatusUserDialog,
    handleToggleDialog: toggleChangeStatusUserDialog,
  } = useHandleDialog(false);

  const {
    openDialog: openEditUserDialog,
    handleToggleDialog: toggleEditUserDialog,
  } = useHandleDialog(false);

  const [filterAttribute, setFilterAttribute] = useState("");

  const handleFilterAttributeChange = (value: string) => {
    setFilterAttribute(value as keyof User);
    goToFirstPage();
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [changeStatusUserId, setChangeStatusUserId] = useState<User>();
  const [editUser, setEditUser] = useState<User>();

  const handleChangeStatusUser = (user: User) => {
    setChangeStatusUserId(user);
    toggleChangeStatusUserDialog();
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    toggleEditUserDialog();
  };

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "/user",
      pagination.pageSize,
      pagination.pageIndex,
      debounceSearchText,
      filterAttribute,
    ],
    queryFn: () =>
      getListUser(
        pagination.pageSize,
        pagination.pageIndex,
        debounceSearchText,
        filterAttribute
      ),
    retry: 1,
  });

  const tableRows = useMemo(() => {
    if (!isSuccess || !data.data.data) {
      return [];
    }

    return data.data.data.map((packs: User, index) => (
      <TableRow key={packs.id}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{packs.fullName}</TableCell>
        <TableCell>{packs.email}</TableCell>
        <TableCell>{packs.role}</TableCell>
        <TableCell>
          <Chip variant={packs.status === "ACTIVE" ? "success" : "warning"}>
            {packs.status}
          </Chip>
        </TableCell>
        <TableCell>{toLocaleDate(packs.createdDate)}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setSelectedUserId(packs.id);
                setOpenDeleteDialog(true);
              }}
              size="small"
            >
              DELETE
            </Button>
            {packs.status === "ACTIVE" ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleChangeStatusUser(packs)}
                size="small"
              >
                DEACTIVATE
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleChangeStatusUser(packs)}
                size="small"
              >
                ACTIVATE
              </Button>
            )}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleEditUser(packs)}
              size="small"
            >
              EDIT
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  }, [data]);
  return (
    <>
      {openEditUserDialog && (
        <EditUser
          user={editUser}
          open={openEditUserDialog}
          onOpenChange={toggleEditUserDialog}
          refetch={refetch}
          onClose={toggleEditUserDialog}
        />
      )}
      {openChangeStatusUserDialog && (
        <DeactivateAndActiveUser
          User={changeStatusUserId}
          open={openChangeStatusUserDialog}
          onOpenChange={toggleChangeStatusUserDialog}
          refetch={refetch}
          onClose={toggleChangeStatusUserDialog}
        />
      )}
      {openAddDialog && (
        <AddUserDialog
          open={openAddDialog}
          onOpenChange={toggleAddDialog}
          successCallback={() => {
            refetch();
          }}
          onClose={toggleAddDialog}
        />
      )}
      {selectedUserId && (
        <Delete
          userId={selectedUserId}
          isOpen={openDeleteDialog}
          setIsOpen={setOpenDeleteDialog}
          refetch={refetch}
        />
      )}
      <SearchContainer>
        <SearchField
          inputValue={searchText}
          setInputValue={handleSearchTextChange}
        />
        <SelectFilter
          filterAttribute={filterAttribute}
          setFilterAttribute={handleFilterAttributeChange}
          listFilter={filterOptions}
        />
      </SearchContainer>
      <ActionArea>
        <div className="w-full flex flex-row items-center justify-end gap-2">
          <Button variant="outlined" onClick={toggleAddDialog}>
            New User
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => refetch()}
            disabled={false}
          >
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
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handleChangeRowsPerPage}
            tableHeads={UserTableHeaders}
            totalRecord={data.data.totalRecord}
            tableRows={tableRows}
          />
        ))}
    </>
  );
}
