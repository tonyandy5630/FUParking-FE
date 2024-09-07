import {
  CHANGE_VEHICLE_STATUS_API_URL,
  CREATE_VEHICLE_FOR_CUSTOMER_BY_USER_API_URL,
  DELETE_VEHICLE_API_URL,
  GET_LIST_VEHICLE_API_URL,
  GET_LIST_VEHICLE_BY_CUSTOMER_API_URL,
  UPDATE_VEHICLE_API_URL,
} from "./url/vehicle.url";

import http from "@/utils/http";
import {
  ListVehicleResponse,
  SearchAttribute,
  VehicleProps,
  VehicleStatus,
} from "@/types/vehicle.type";
import { UpdateVehicleSchemaType } from "@/utils/schemas/vehicle/updateVehicleSchema";

export const getListVehicleAPI = ({
  pageSize,
  pageIndex,
  SearchInput,
  Attribute,
  StartDate,
  EndDate,
}: {
  pageSize: number;
  pageIndex: number;
  SearchInput: string;
  Attribute: SearchAttribute;
  StartDate?: string;
  EndDate?: string;
}) =>
  http.get<ListVehicleResponse>(
    GET_LIST_VEHICLE_API_URL({
      pageSize,
      pageIndex,
      SearchInput,
      Attribute,
      StartDate,
      EndDate,
    })
  );

export const changeVehicleStatusAPI = (data: {
  vehicleId: string;
  isActive: boolean;
}) => http.put(CHANGE_VEHICLE_STATUS_API_URL, data);

export const updateVehicleAPI = (body: UpdateVehicleSchemaType) =>
  http.post(UPDATE_VEHICLE_API_URL, body);

export const getListVehicleByCustomerAPI = (customerId: string) =>
  http.get<ListVehicleResponse>(
    GET_LIST_VEHICLE_BY_CUSTOMER_API_URL({ customerId })
  );

export const createVehicleForCustomerByUserAPI = (body: {
  customerId: string;
  vehicles: VehicleProps[];
}) => http.post(CREATE_VEHICLE_FOR_CUSTOMER_BY_USER_API_URL, body);

export const deleteVehicleAPI = (vehicleId: string) =>
  http.delete(DELETE_VEHICLE_API_URL({ vehicleId }));
