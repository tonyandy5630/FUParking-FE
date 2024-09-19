import baseURL from ".";

export const GET_LIST_PARKINGAREA_API_URL = (
  pageSize?: number,
  pageIndex?: number,
  SearchInput?: string,
  Attribute?: string
) =>
  `${baseURL}/areas?PageSize=${pageSize}&PageIndex=${pageIndex}${
    SearchInput ? `&SearchInput=${SearchInput}` : ""
  }&Attribute=${Attribute}`;

export const GET_PARKING_AREA_OPTIONS_API_URL = `${baseURL}/areas/option`;

export const UPDATE_PARKING_AREA_API_URL = `${baseURL}/areas`;

export const DEACTIVATE_PARKING_AREA_API_URL = (areaId: string) =>
  `${baseURL}/area/${areaId}`;

export const ADD_PARKING_AREA_API_URL = `${baseURL}/areas`;

export const UPDATE_PARKING_AREA_STATUS_API_URL = `${baseURL}/areas/status`;

export const DELETE_PARKING_AREA_API_URL = (areaId: string) =>
  `${baseURL}/areas/${areaId}`;

export const GET_PARKING_AREA_REVENUE = (
  parkingArea: string,
  startDate: string,
  endDate: string
) =>
  `${baseURL}/statistic/parkings/${parkingArea}/revenue?startDate=${startDate}&endDate=${endDate}`;
