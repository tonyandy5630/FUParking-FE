import {
    GET_LIST_VEHICLE_API_URL,
} from "./url/vehicle.url";

import http from "@/utils/http";
import { ListVehicleReponse } from "@/types/vehicle.type";

export const listVehicleAPI = (
    pageSize: number,
    pageIndex: number,
    SearchInput: string,
    Attribute: string,
    StartDate: string,
    EndDate: string
) => 
    http.get<ListVehicleReponse>(
        GET_LIST_VEHICLE_API_URL(pageSize, pageIndex, SearchInput, Attribute, StartDate, EndDate)
    );

