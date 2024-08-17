import http from "@/utils/http";
import {
  ADD_PACKAGE_API_URL,
  GET_LIST_PACKAGE_API_URL,
  UPDATE_PACKAGE_API_URL,
} from "./url/package.url";
import { ListPackage } from "@/types/package.type";
import {
  PackageSchemaType,
  UpdatePackageSchemaType,
} from "@/utils/schemas/PackageSchema";

export const getListPackage = (
  pageSize: number,
  pageIndex: number,
  Attribute: string,
  SearchInput: string
) =>
  http.get<ListPackage>(
    GET_LIST_PACKAGE_API_URL(pageSize, pageIndex, Attribute, SearchInput)
  );

export const addPackageAPI = (data: PackageSchemaType) =>
  http.post(ADD_PACKAGE_API_URL, data);

export const updatePackageAPI = (data: UpdatePackageSchemaType) =>
  http.put(UPDATE_PACKAGE_API_URL(data.packageId), data);
