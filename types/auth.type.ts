import { LoginResponse } from ".";

export type AuthResponse = LoginResponse<User>;

type User = {
  bearerToken: string;
  name: string;
  email: string;
  role: string;
};
