import http from "@/utils/http";
import {
  GET_ALL_PARKING_AREA_API_URL,
  GET_LIST_PARKINGAREA_API_URL,
} from "./url/parkingArea.url";
import { ListParkingArea } from "@/types/parkingArea.type";

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
