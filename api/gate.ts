import http from "@/utils/http";
import {
  GET_LIST_GATE_API_URL,
} from "./url/gate.url";
import { ListGate } from "@/types/gate.type";

export const getGate = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string
) =>
  http.get<ListGate>(
    GET_LIST_GATE_API_URL(
      pageSize,
      pageIndex,
      SearchInput,
      Attribute
    )
  );