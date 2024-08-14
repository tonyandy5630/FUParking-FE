import http from "@/utils/http";
import {
  CREATE_TABLE_API_URL,
  GET_TABLE_PRICE_API_URL,
  UPDATE_TABLE_STATUS_API_URL,
} from "./url/price.url";
import { ErrorResponse } from "@/types";
import { PriceTable } from "@/types/price.type";
import { PriceTableTableSchemaType } from "@/utils/schemas/priceTableSchema";

export const getPriceTableAPI = () =>
  http.get<ErrorResponse<PriceTable[]>>(GET_TABLE_PRICE_API_URL);

export const updatePriceTableStatusAPI = (data: {
  priceTableId: string;
  isActive: boolean;
}) => http.put(UPDATE_TABLE_STATUS_API_URL, data);

export const createTableAPI = (data: PriceTableTableSchemaType) =>
  http.post(CREATE_TABLE_API_URL, data);
