import { PaginationType } from "@/types/pagination.type";
import baseURL from ".";

export const GET_ALL_FEEDBACKS_API_URL = (pagination: PaginationType) =>
  `${baseURL}/feedbacks?pageIndex=${pagination.pageIndex + 1}&pageSize=${
    pagination.pageSize
  }`;
