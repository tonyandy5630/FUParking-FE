import http from "@/utils/http";
import {
  ADD_GATE_API_URL,
  GET_LIST_GATE_API_URL,
  UPDATE_GATE_API_URL,
} from "./url/gate.url";
import { ListGate } from "@/types/gate.type";
import { GateSchemaType } from "@/utils/schemas/gateSchema";

export const getGate = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string
) =>
  http.get<ListGate>(
    GET_LIST_GATE_API_URL(pageSize, pageIndex, SearchInput, Attribute)
  );

export const addGateAPI = (data: GateSchemaType) =>
  http.post(ADD_GATE_API_URL, data);

export const updateGateAPI = (data: GateSchemaType, gateId: string) =>
  http.put(UPDATE_GATE_API_URL(gateId), data);
