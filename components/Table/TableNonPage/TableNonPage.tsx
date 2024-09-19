import { memo, useMemo } from "react";
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Loading from "@/components/Page/LoadingPage/Loading";
import Table from "@mui/material/Table";

type Props = {
  tableHeads: Array<string>;
  tableRows: React.JSX.Element[];
  isLoading?: boolean;
};

export default memo(function DataTable({
  tableRows,
  tableHeads,
  isLoading,
}: Props) {
  const renderTableHeads = useMemo(() => {
    return tableHeads.map((item) => (
      <TableCell key={item}>
        <p className="text-base font-bold">{item}</p>
      </TableCell>
    ));
  }, [tableHeads.length]);

  return (
    <TableContainer component={Paper}>
      {isLoading ? (
        <Loading />
      ) : (
        <Table className="w-full" aria-label="simple table">
          <TableHead>
            <TableRow>{renderTableHeads}</TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
      )}
    </TableContainer>
  );
});
