import { ListVehicleTypeResponse } from "@/types/vehicleType.type";
import http from "@/utils/http";
import {
  CREATE_VEHICLE_TYPE_API_URL,
  DELETE_VEHICLE_TYPE_API_URL,
  GET_LIST_VEHICLE_TYPE_API_URL,
  UPDATE_VEHICLE_TYPE_API_URL,
} from "./url/vehicleType.url";

export const getListVehicleTypeAPI = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string
) =>
  http.get<ListVehicleTypeResponse>(
    GET_LIST_VEHICLE_TYPE_API_URL(pageSize, pageIndex, SearchInput, Attribute)
  );

export const createVehicleTypeAPI = (body: {
  name: string;
  description?: string | undefined;
}) => http.post(CREATE_VEHICLE_TYPE_API_URL, body);

export const updateVehicleTypeAPI = (
  id: string,
  body: {
    name?: string | undefined;
    description?: string | undefined;
  }
) => http.put(UPDATE_VEHICLE_TYPE_API_URL(id), body);

export const deleteVehicleTypeAPI = (id: string) =>
  http.delete(DELETE_VEHICLE_TYPE_API_URL(id));
