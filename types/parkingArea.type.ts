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
  createDate: string;
  createBy: string;
  lastModifyBy: string;
  lastModifyDate: string;
}

export type ParkingAreaWithFillerKey = keyof ParkingAreas;
