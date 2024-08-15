import { ResponseAPI } from ".";

export type ListUser = ResponseAPI<User[]>;

export type StatusUser = "ACTIVE" | "INACTIVE";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdDate: string;
}
