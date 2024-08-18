import { ResponseAPI } from ".";

export type ListGate = ResponseAPI<Gates[]>;

export type GateType = {
  id: string;
  name: string;
  description?: string;
};

export interface Gates {
  id: string;
  name: string;
  parkingArea: {
    id: string;
    name: string;
    description: string;
  };
  description: string;
  gateType: {
    id: string;
    name: string;
    description: string;
  };
  statusGate: string;
  createdBy: string;
  lastModifyBy: string;
}
