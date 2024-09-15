import baseURL from ".";

export const GET_LIST_GATE_API_URL = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string
) =>
  `${baseURL}/gates?PageSize=${pageSize}&PageIndex=${pageIndex}${
    SearchInput ? `&SearchInput=${SearchInput}` : ""
  }&Attribute=${Attribute}`;

export const ADD_GATE_API_URL = `${baseURL}/gates`;
export const UPDATE_GATE_API_URL = (gateId: string) =>
  `${baseURL}/gates/${gateId}`;

export const ADD_GATE_FOR_PARKING_API_URL = `${baseURL}/gates/area`;

export const GET_ALL_GATE_TYPES = `${baseURL}/gates/types`;

export const UPDATE_GATE_STATUS_API_URL = `${baseURL}/gates/status`;

export const DELETE_GATE_API_URL = (id: string) => `${baseURL}/gates/${id}`;

export const GET_ALL_GATE_BY_PARKING_API_URL = (parkingId: string) =>
  `${baseURL}/gates/area/all/${parkingId}`;
