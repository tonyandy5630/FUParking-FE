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
