import baseURL from ".";

export const GET_LIST_PACKAGE_API_URL = (
    pageSize: number,
    pageIndex: number,
    SearchInput: string,
    Attribute: string
    ) =>
    `${baseURL}/packages?PageSize=${pageSize}&PageIndex=${pageIndex}${
    SearchInput ? `&SearchInput=${SearchInput}` : ""
  }&Attribute=${Attribute}`;
