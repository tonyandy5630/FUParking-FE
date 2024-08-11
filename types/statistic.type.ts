import { ResponseAPI } from ".";

export type Statistics1 = ResponseAPI<
  LineChart[]
>;

export interface LineChart {
  date: string;
  totalSession: number;
}

export type TransactionWithFillerKey = keyof LineChart;

export type Statistics2 = ResponseAPI<
  PieChart1[]
>;

export interface PieChart1{
    paymentMethod: string;
    totalPayment: number;
}
