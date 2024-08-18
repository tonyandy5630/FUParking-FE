import http from "@/utils/http";
import { ADD_USER_API_URL, GET_LIST_USER_API_URL } from "./url/user.url";
import { ListUser } from "@/types/user.type";
import { UserSchemaType } from "@/utils/schemas/loginSchema";
import { Role } from "@/constant/enum";

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
