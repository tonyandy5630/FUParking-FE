import { ResponseAPI } from ".";

export type ListGate = ResponseAPI<Gates[]>;

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

export interface GateProps {
  id: string;
  name: string;
  description: string;
  status: string;
  parkingAreaId: string;
}

export type AddGateProps = {
  name: string;
  description?: string;
};

export type ListGateByParking = ResponseAPI<GateProps[]>;
