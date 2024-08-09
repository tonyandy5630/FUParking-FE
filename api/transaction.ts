import {
    GET_LIST_TRANSACTION_API_URL,
} from "./url/transaction.url";

import http from "@/utils/http";
import { ListTransactionWithFillerReponse } from "@/types/transaction.type";

export const listTransactionAPI = (
    pageSize: number,
    pageIndex: number,
    SearchInput: string,
    Attribute: string
) =>
    http.get<ListTransactionWithFillerReponse>(
        GET_LIST_TRANSACTION_API_URL(pageSize, pageIndex, SearchInput, Attribute)
    );