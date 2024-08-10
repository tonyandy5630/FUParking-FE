import { ResponseAPI } from ".";

export type ListParkingArea = ResponseAPI<
  ParkingAreas[]
>;

export interface ParkingAreas {
  id: string;
  name: string;
  description: string;
  maxCapacity: string;
  mode: string;
  block: string;
  statusParkingArea: string;
  createdDate: string;
}

export type ParkingAreaWithFillerKey = keyof ParkingAreas;
