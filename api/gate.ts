import http from "@/utils/http";
import {
  ADD_GATE_API_URL,
  ADD_GATE_FOR_PARKING_API_URL,
  DELETE_GATE_API_URL,
  GET_ALL_GATE_BY_PARKING_API_URL,
  GET_LIST_GATE_API_URL,
  UPDATE_GATE_API_URL,
  UPDATE_GATE_STATUS_API_URL,
} from "./url/gate.url";
import { AddGateProps, ListGate, ListGateByParking } from "@/types/gate.type";
import { GateSchemaType } from "@/utils/schemas/gateSchema";
import { ErrorResponse } from "@/types";
import { EditGateSchemaType } from "@/utils/schemas/gate/editGateSchema";
import { AddGateSchemaType } from "@/utils/schemas/gate/addGateSchema";

export const getGate = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string
) =>
  http.get<ListGate>(
    GET_LIST_GATE_API_URL(pageSize, pageIndex, SearchInput, Attribute)
  );

export const addGateAPI = (body: {
  parkingAreaId: string;
  gates: AddGateProps[];
}) => http.post(ADD_GATE_FOR_PARKING_API_URL, body);

export const updateGateAPI = (body: {
  data: EditGateSchemaType;
  gateId: string;
}) => http.put(UPDATE_GATE_API_URL(body.gateId), body.data);

export const gateStatusChangeAPI = (data: {
  gateId: string;
  isActive: boolean;
}) => http.put(UPDATE_GATE_STATUS_API_URL, data);

export const deleteGateAPI = (gateId: string) =>
  http.delete(DELETE_GATE_API_URL(gateId));

export const getGateByParking = (parkingId: string) =>
  http.get<ListGateByParking>(GET_ALL_GATE_BY_PARKING_API_URL(parkingId));
