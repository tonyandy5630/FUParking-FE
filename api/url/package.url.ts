import baseURL from ".";

export const GET_LIST_PACKAGE_API_URL = (
  pageSize: number,
  pageIndex: number,
  Attribute: string,
  SearchInput: string
) =>
  `${baseURL}/packages?PageSize=${pageSize}&PageIndex=${pageIndex}${
    SearchInput !== "" ? `&SearchInput=${SearchInput}` : ""
  }&Attribute=${Attribute}`;

export const ADD_PACKAGE_API_URL = `${baseURL}/packages`;

export const UPDATE_PACKAGE_API_URL = (packageId: string) =>
  `${baseURL}/packages/${packageId}`;
