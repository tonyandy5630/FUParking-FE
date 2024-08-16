import { PaginationType } from "@/types/pagination.type";
import baseURL from ".";

export const GET_ALL_PRICE_ITEM_BY_TABLE_API_URL = (
  id: string,
  pagination: PaginationType
) =>
  `${baseURL}/price/${id}/items?PageSize=${pagination.pageSize}&PageIndex=${
    pagination.pageIndex + 1
  }`;

export const CREATE_PRICE_ITEMS_API_URL = `${baseURL}/price/vehicle/item`;

export const UPDATE_PRICE_ITEMS_API_URL = `${baseURL}/price/vehicle/item`;
