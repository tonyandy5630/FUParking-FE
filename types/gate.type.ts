import { ResponseAPI } from ".";

export type ListGate = ResponseAPI<
  Gates[]
>;

export interface Gates {
  id: string;
  name: string;
  parkingAreaName: string;
  description: string;
  gateTypeName: string;
  statusGate: string;
  createdBy: string;
  lastModifyBy: string;
}
