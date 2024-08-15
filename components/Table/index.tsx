import { memo, useMemo } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "./Pagination";
import { PaginationType } from "@/types/pagination.type";
import dynamic from "next/dynamic";
const Loading = dynamic(() => import("../Page/LoadingPage/Loading"));

type Props = {
  tableHeads: Array<string>;
  tableRows: any;
  pagination: PaginationType;
  totalRecord?: number;
  onPageChange: any;
  onPageSizeChange: any;
  isLoading?: boolean;
};

export default memo(function DataTable({
  tableRows,
  tableHeads,
  pagination,
  totalRecord,
  onPageChange,
  onPageSizeChange,
  isLoading,
}: Props) {
  const renderTableHeads = useMemo(() => {
    return tableHeads.map((item) => (
      <TableCell key={item}>
        <p className='text-base font-bold'>{item}</p>
      </TableCell>
    ));
  }, [tableHeads.length]);

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onPageChange(newPage);
  };
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onPageSizeChange(event.target.value, 10);
  };
  return (
    <TableContainer component={Paper}>
      {isLoading ? (
        <Loading />
      ) : (
        <Table className='w-full' aria-label='simple table'>
          <TableHead>
            <TableRow>{renderTableHeads}</TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={totalRecord ?? 999}
                rowsPerPage={pagination.pageSize}
                page={pagination.pageIndex}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  },
                }}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </TableContainer>
  );
});
