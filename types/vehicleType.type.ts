import { ResponseAPI } from ".";

export type ListVehicleTypeResponse = ResponseAPI<VehicleTypeProps[]>;

export type VehicleTypeProps = {
  id: string;
  name: string;
  description: string;
  createDatetime: string;
};

export type VehicleTypeKey = keyof VehicleTypeProps;
