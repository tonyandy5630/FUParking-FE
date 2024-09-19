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

export const DELETE_USER_API_URL = (userId: string) =>
  `${baseURL}/user/${userId}`;

export const CHANGE_STATUS_USER_API_URL = `${baseURL}/user/status`;

export const EDIT_USER_API_URL = `${baseURL}/user`;

export const GET_ROLE_LIST_API_URL = `${baseURL}/user/role`;
