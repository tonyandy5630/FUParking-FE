import { Role } from "./../../constant/enum";
import baseURL from ".";

export const GET_LIST_USER_API_URL = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string
) =>
  `${baseURL}/user?PageSize=${pageSize}&PageIndex=${
    pageIndex + 1
  }&SearchInput=${SearchInput}&Attribute=${Attribute}`;

export const ADD_USER_API_URL = (role: Role) => `${baseURL}/user/${role}`;
