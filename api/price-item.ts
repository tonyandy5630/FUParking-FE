import { PriceItem } from "./../types/price-item.type";
import { ErrorResponse } from "@/types";
import { GET_ALL_PRICE_ITEM_BY_TABLE_API_URL } from "./url/price-item.url";
import http from "@/utils/http";
export const getPriceItemByTableAPI = (id: string) =>
  http.get<ErrorResponse<PriceItem[]>>(
    GET_ALL_PRICE_ITEM_BY_TABLE_API_URL + id
  );
