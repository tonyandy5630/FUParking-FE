import Button from "@mui/material/Button";
import React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import csvConfig from "./config";
import { download, generateCsv } from "export-to-csv";

type Props = {
  children?: any;
  data: Array<any>;
};

export default function ExportToCSVButton({ children, data }: Props) {
  const handleExport = () => {
    const file = generateCsv(csvConfig)(data);
    download(csvConfig)(file);
  };

  return (
    <Button variant='outlined' onClick={handleExport}>
      <FileDownloadIcon />
      <span> Export to CSV</span>
    </Button>
  );
}
