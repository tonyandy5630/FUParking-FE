import { ResponseAPI } from ".";

export type ListTransactionWithFillerReponse = ResponseAPI<
  TransactionWithFillerProps[]
>;

export interface TransactionWithFillerProps {
  id : string;
  email : string;
  walletType : string;
  paymentMethod : string; 
  packageName : string;
  amount : string;
  transactionDescription : string;
  transactionStatus : string;
  createdDate : string;
}

export type TransactionWithFillerKey = keyof TransactionWithFillerProps;