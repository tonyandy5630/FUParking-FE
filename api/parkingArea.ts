import http from "@/utils/http";
import {
  ADD_PARKING_AREA_API_URL,
  GET_PARKING_AREA_OPTIONS_API_URL,
  GET_LIST_PARKINGAREA_API_URL,
  UPDATE_PARKING_AREA_API_URL,
  UPDATE_PARKING_AREA_STATUS_API_URL,
  DELETE_PARKING_AREA_API_URL,
  GET_PARKING_AREA_REVENUE,
} from "./url/parking-area.url";
import {
  ListParkingArea,
  ListParkingAreaOption,
  ParkingAreaRevenueDetailType,
} from "@/types/parking-area.type";
import { ParkingAreaSchemaType } from "@/utils/schemas/parkingAreaSchema";
import { AddParkingAreaSchemaType } from "@/utils/schemas/parkingArea/addParkingAreaSchema";
import { ErrorResponse } from "@/types";

export const getParkingAreaRevenueAPI = (
  parkingAreaId: string,
  startDate: string,
  endDate: string
) =>
  http.get<ErrorResponse<ParkingAreaRevenueDetailType[]>>(
    GET_PARKING_AREA_REVENUE(parkingAreaId, startDate, endDate)
  );

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
  http.get<ListParkingAreaOption>(GET_PARKING_AREA_OPTIONS_API_URL);

export const addParkingAreaAPI = (data: AddParkingAreaSchemaType) =>
  http.post(ADD_PARKING_AREA_API_URL, data);

export const updateParkingAreaAPI = (data: ParkingAreaSchemaType) =>
  http.put(UPDATE_PARKING_AREA_API_URL, data);

export const updateParkingAreaStatusAPI = (data: {
  parkingId: string;
  isActive: boolean;
}) => http.put(UPDATE_PARKING_AREA_STATUS_API_URL, data);

export const deleteParkingAreaAPI = (id: string) =>
  http.delete(DELETE_PARKING_AREA_API_URL(id));
