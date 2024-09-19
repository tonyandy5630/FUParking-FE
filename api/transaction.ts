import {
  GET_LIST_TRANSACTION_API_URL,
  TOP_UP_CUSTOMER_API_URL,
} from "./url/transaction.url";

import http from "@/utils/http";
import { ListTransactionWithFillerReponse } from "@/types/transaction.type";
import { DynamicResponse } from "@/types";
import { TopUpSchemaType } from "@/utils/schemas/transaction/topupSchema";

export const listTransactionAPI = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  StartDate: string,
  EndDate: string,
  Attribute: string
) =>
  http.get<ListTransactionWithFillerReponse>(
    GET_LIST_TRANSACTION_API_URL(
      pageSize,
      pageIndex,
      SearchInput,
      Attribute,
      StartDate,
      EndDate
    )
  );

export const topupAPI = (body: TopUpSchemaType) =>
  http.post<DynamicResponse>(TOP_UP_CUSTOMER_API_URL, body);
