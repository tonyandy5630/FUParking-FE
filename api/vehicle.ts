import {
  CHANGE_VEHICLE_STATUS_API_URL,
  GET_LIST_VEHICLE_API_URL,
} from "./url/vehicle.url";

import http from "@/utils/http";
import {
  ListVehicleResponse,
  SearchAttribute,
  VehicleStatus,
} from "@/types/vehicle.type";

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
