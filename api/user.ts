import http from "@/utils/http";
import {
    GET_LIST_USER_API_URL,
} from "./url/user.url";
import {ListUser} from "@/types/user.type";

export const getListUser = (
    pageSize: number,
    pageIndex: number,
    SearchInput: string,
    Attribute: string
) =>
    http.get<ListUser>(
        GET_LIST_USER_API_URL(
            pageSize,
            pageIndex,
            SearchInput,
            Attribute
        )
    );