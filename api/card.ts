import {
  ADD_CUSTOMER_API_URL,
  EDIT_CARD_API_URL,
  GET_LIST_CARD_API_URL,
} from "./url/card.url";
import http from "@/utils/http";
import { ListCardResponse } from "@/types/card.type";

export const listCardAPI = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string
) =>
  http.get<ListCardResponse>(
    GET_LIST_CARD_API_URL(pageSize, pageIndex, SearchInput, Attribute)
  );

export const editCardAPI = (
  id: string,
  body: {
    plateNumber: string;
  }
) => http.put(EDIT_CARD_API_URL(id), body);

export const deleteCardAPI = (id: string) => http.delete(EDIT_CARD_API_URL(id));

export const addCardAPI = (body: {
  cardNumber: string;
  plateNumber?: string | undefined;
}) => http.post(ADD_CUSTOMER_API_URL, body);
