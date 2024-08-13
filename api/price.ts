import http from "@/utils/http";
import {
  GET_TABLE_PRICE_API_URL,
  UPDATE_TABLE_STATUS_API_URL,
} from "./url/price.url";
import { ErrorResponse } from "@/types";
import { PriceTable } from "@/types/price.type";

export const getPriceTableAPI = () =>
  http.get<ErrorResponse<PriceTable[]>>(GET_TABLE_PRICE_API_URL);

export const updatePriceTableStatusAPI = (data: {
  priceTableId: string;
  isActive: boolean;
}) => http.put(UPDATE_TABLE_STATUS_API_URL, data);
