import http from "@/utils/http";
import {
  CREATE_TABLE_API_URL,
  DELETE_TABLE_PRICE_API_URL,
  GET_TABLE_PRICE_API_URL,
  UPDATE_TABLE_STATUS_API_URL,
} from "./url/price.url";
import { ErrorResponse } from "@/types";
import { PriceTable } from "@/types/price.type";
import { PriceTableTableSchemaType } from "@/utils/schemas/priceTableSchema";
import { PaginationType } from "@/types/pagination.type";

export const getPriceTableAPI = ({
  page,
  searchInput,
  attribute,
}: {
  page: PaginationType;
  searchInput: string;
  attribute: string;
}) =>
  http.get<ErrorResponse<PriceTable[]>>(
    `${GET_TABLE_PRICE_API_URL}?PageSize=${page.pageSize}&PageIndex=${
      page.pageIndex + 1
    }&SearchInput=${searchInput}&Attribute=${attribute}`
  );

export const updatePriceTableStatusAPI = (data: {
  priceTableId: string;
  isActive: boolean;
}) => http.put(UPDATE_TABLE_STATUS_API_URL, data);

export const createTableAPI = (data: PriceTableTableSchemaType) =>
  http.post(CREATE_TABLE_API_URL, data);

export const deletePriceTableAPI = (tableId: string) =>
  http.delete(DELETE_TABLE_PRICE_API_URL(tableId));
