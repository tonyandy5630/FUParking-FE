import http from "@/utils/http";
import {
  ADD_PARKING_AREA_API_URL,
  GET_ALL_PARKING_AREA_API_URL,
  GET_LIST_PARKINGAREA_API_URL,
  UPDATE_PARKING_AREA_API_URL,
  UPDATE_PARKING_AREA_STATUS_API_URL,
} from "./url/parkingArea.url";
import { ListParkingArea } from "@/types/parkingArea.type";
import { UpdatePackageSchemaType } from "@/utils/schemas/PackageSchema";
import { ParkingAreaSchemaType } from "@/utils/schemas/parkingAreaSchema";

export const getListParkingArea = (
  pageSize?: number,
  pageIndex?: number,
  SearchInput?: string,
  Attribute?: string
) =>
  http.get<ListParkingArea>(
    GET_LIST_PARKINGAREA_API_URL(pageSize, pageIndex, SearchInput, Attribute)
  );

export const getAllParkingAreaAPI = () =>
  http.get<ListParkingArea>(GET_ALL_PARKING_AREA_API_URL);

export const addParkingAreaAPI = (data: ParkingAreaSchemaType) =>
  http.post(ADD_PARKING_AREA_API_URL, data);

export const updateParkingAreaAPI = ({
  data,
  id,
}: {
  data: ParkingAreaSchemaType;
  id: string;
}) => http.put(UPDATE_PARKING_AREA_API_URL(id), data);

export const updateParkingAreaStatusAPI = (data: {
  parkingId: string;
  isActive: boolean;
}) => http.put(UPDATE_PARKING_AREA_STATUS_API_URL, data);
