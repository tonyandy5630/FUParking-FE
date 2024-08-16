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

export const GET_ALL_PARKING_AREA_API_URL = `${baseURL}/areas`;
