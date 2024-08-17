import { PaginationType } from "@/types/pagination.type";
import { Dispatch, SetStateAction, useState } from "react";

const defaultPagination: PaginationType = {
  pageSize: 5,
  pageIndex: 0,
};

export default function usePagination({
  pageSize = defaultPagination.pageSize,
  pageIndex = defaultPagination.pageIndex,
}: Partial<PaginationType> = {}): {
  pagination: PaginationType;
  setPagination: Dispatch<SetStateAction<PaginationType>>;
  handlePageChange: (newPage: number) => void;
  handleChangeRowsPerPage: (size: number) => void;
  goToFirstPage: () => void;
} {
  const [pagination, setPagination] = useState<PaginationType>({
    pageSize,
    pageIndex,
  });

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

  const goToFirstPage = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return {
    pagination,
    setPagination,
    handlePageChange,
    handleChangeRowsPerPage,
    goToFirstPage,
  };
}
