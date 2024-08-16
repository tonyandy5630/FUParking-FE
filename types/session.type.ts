import { ResponseAPI } from ".";

export type ListSessionResponse = ResponseAPI<SessionProps[]>;
export type SessionResponse = ResponseAPI<SessionProps>;
export type CheckOutResponse = ResponseAPI<CheckOutProps>;

export interface SessionProps {
  id: string;
  cardNumber: string;
  gateInName: string;
  gateOutName: string;
  plateNumber: string;
  imageInUrl: string;
  imageOutUrl: string;
  timeIn: string;
  timeOut: string;
  mode: string;
  block: string;
  vehicleTypeName: string;
  paymentMethodName: string;
  customerEmail: string;
  status: string;
  checkInStaff: string;
  checkOutStaff: string;
  parkingArea: string;
}

export interface CheckOutProps {
  message: string;
  amount: number;
  imageIn: string;
  plateNumber: string;
  timeIn: string;
  typeOfCustomer: string;
}
