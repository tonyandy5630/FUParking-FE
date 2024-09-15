import { ResponseAPI } from ".";

export type ListParkingArea = ResponseAPI<ParkingAreas[]>;

export interface ParkingAreas {
  id: string;
  name: string;
  description: string;
  maxCapacity: string;
  mode: number;
  block: string;
  statusParkingArea: string;
  createDate: string;
  createBy: string;
  lastModifyBy: string;
  lastModifyDate: string;
}

export type ParkingAreaWithFillerKey = keyof ParkingAreas;

//

export type ListParkingAreaOption = ResponseAPI<ParkingAreaOption[]>;

export interface ParkingAreaOption {
  id: string;
  name: string;
  description: string;
}

export type ParkingAreaOptionWithFillerKey = keyof ParkingAreaOption;
