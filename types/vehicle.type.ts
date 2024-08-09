import { ResponseAPI } from "@/types";

export type ListVehicleReponse = ResponseAPI<VehicleProps[]>;

export interface VehicleProps {
    id : string;
    plateNumber : string;
    email : string;
    vehicleType : string;
    statusVehicle : string;
    staffApproval : string;
    lastModifyBy : string;
    lastModifyDate : string;
    createdDate : string;
}

export type VehicleKey = keyof VehicleProps;