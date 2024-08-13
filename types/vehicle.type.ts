import { ResponseAPI } from "@/types";

export type ListVehicleResponse = ResponseAPI<VehicleProps[]>;

export type SearchAttribute = "PLATENUMBER" | "EMAIL" | "VEHICLETYPE";

export type VehicleStatus =
  | "PENDING"
  | "REJECTED"
  | "ACTIVE"
  | "INACTIVE"
  | "BANNED";

export interface VehicleProps {
  id: string;
  plateNumber: string;
  plateImage: string;
  email: string;
  vehicleType: string;
  statusVehicle: VehicleStatus;
  staffApproval: string;
  lastModifyBy: string;
  lastModifyDate: string;
  createdDate: string;
}

export type VehicleKey = keyof VehicleProps;
