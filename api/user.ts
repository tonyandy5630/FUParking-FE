import http from "@/utils/http";
import {
  ADD_USER_API_URL,
  CHANGE_STATUS_USER_API_URL,
  DELETE_USER_API_URL,
  EDIT_USER_API_URL,
  GET_LIST_USER_API_URL,
  GET_ROLE_LIST_API_URL,
} from "./url/user.url";
import { ListRole, ListUser } from "@/types/user.type";
import { UserSchemaType } from "@/utils/schemas/loginSchema";
import { Role } from "@/constant/enum";
import { DynamicResponse } from "@/types";
import { EditCustomerSchemaType } from "@/utils/schemas/customer/editCustomerSchema";
import { EditUserSchemaType } from "@/utils/schemas/user/editUserSchema";

export const getListUser = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string
) =>
  http.get<ListUser>(
    GET_LIST_USER_API_URL(pageSize, pageIndex, SearchInput, Attribute)
  );

export const addUserAPI = (body: { data: UserSchemaType; role: Role }) =>
  http.post(ADD_USER_API_URL(body.role), body.data);

export const deleteUserAPI = (userId: string) =>
  http.delete(DELETE_USER_API_URL(userId));

export const updateStatusUserAPI = (body: { id: string; isActive: boolean }) =>
  http.put<DynamicResponse>(CHANGE_STATUS_USER_API_URL, body);

export const editUserAPI = (body: EditUserSchemaType) =>
  http.put<DynamicResponse>(EDIT_USER_API_URL, body);

export const listRoleAPI = () => http.get<ListRole>(GET_ROLE_LIST_API_URL);
