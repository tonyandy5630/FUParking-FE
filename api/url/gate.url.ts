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
