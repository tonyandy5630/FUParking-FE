import { PriceItem } from "./../types/price-item.type";
import { ErrorResponse } from "@/types";
import {
  CREATE_PRICE_ITEMS_API_URL,
  GET_ALL_PRICE_ITEM_BY_TABLE_API_URL,
  UPDATE_PRICE_ITEMS_API_URL,
} from "./url/price-item.url";
import http from "@/utils/http";
import { PriceItemRequestSchemaType } from "@/utils/schemas/priceItemSchema";

export const getPriceItemByTableAPI = (id: string) =>
  http.get<ErrorResponse<PriceItem[]>>(GET_ALL_PRICE_ITEM_BY_TABLE_API_URL(id));

export const createPriceItemsAPI = (data: PriceItemRequestSchemaType) =>
  http.post(CREATE_PRICE_ITEMS_API_URL, data);

export const updatePriceItemsAPI = (data: PriceItemRequestSchemaType) =>
  http.post(UPDATE_PRICE_ITEMS_API_URL, data);
