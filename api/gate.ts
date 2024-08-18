import http from "@/utils/http";
import {
  ADD_GATE_API_URL,
  DELETE_GATE_API_URL,
  GET_ALL_GATE_TYPES,
  GET_LIST_GATE_API_URL,
  UPDATE_GATE_API_URL,
  UPDATE_GATE_STATUS_API_URL,
} from "./url/gate.url";
import { GateType, ListGate } from "@/types/gate.type";
import { GateSchemaType } from "@/utils/schemas/gateSchema";
import { ErrorResponse } from "@/types";

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

export const updateGateAPI = (body: { data: GateSchemaType; gateId: string }) =>
  http.put(UPDATE_GATE_API_URL(body.gateId), body.data);

export const getAllGateAPI = () =>
  http.get<ErrorResponse<GateType[]>>(GET_ALL_GATE_TYPES);

export const gateStatusChangeAPI = (data: {
  gateId: string;
  isActive: boolean;
}) => http.put(UPDATE_GATE_STATUS_API_URL, data);

export const deleteGateAPI = (gateId: string) =>
  http.delete(DELETE_GATE_API_URL(gateId));
