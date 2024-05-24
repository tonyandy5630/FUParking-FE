import { LoginResponse } from ".";

export type AuthResponse = LoginResponse<User | null>;

type User = {
  bearerToken: string;
  name: string;
  email: string;
};
