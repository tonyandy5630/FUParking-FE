import http from "@/utils/http";
import { GET_LIST_PACKAGE_API_URL } from "./url/package.url";
import { ListPackage } from "@/types/package.type";

export const getListPackage = (
  pageSize: number,
  pageIndex: number,
  Attribute: string,
  SearchInput: string
) =>
  http.get<ListPackage>(
    GET_LIST_PACKAGE_API_URL(pageSize, pageIndex, Attribute, SearchInput)
  );
