import baseURL from ".";

export const GET_LIST_VEHICLE_TYPE_API_URL = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string
) =>
  `${baseURL}/vehicles/types?PageSize=${pageSize}&PageIndex=${pageIndex}${
    SearchInput ? `&SearchInput=${SearchInput}` : ""
  }&Attribute=${Attribute}`;

export const CREATE_VEHICLE_TYPE_API_URL = `${baseURL}/vehicles/types`;

export const UPDATE_VEHICLE_TYPE_API_URL = (id: string) =>
  `${baseURL}/vehicles/types/${id}`;

export const DELETE_VEHICLE_TYPE_API_URL = (id: string) =>
  `${baseURL}/vehicles/types/${id}`;
