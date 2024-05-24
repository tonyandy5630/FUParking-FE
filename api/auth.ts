import axios from "axios";
import { AuthResponse } from "@/types/auth.type";
import { RequestLogin } from "@/types/requestType";
import { URL } from "./url";

export default async function LoginApi(
  requestLogin: RequestLogin
): Promise<AuthResponse> {
  try {
    const response = await axios.post(
      `https://${URL}/api/auth`,
      {
        email: requestLogin.email,
        password: requestLogin.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else {
      return {
        isSuccess: false,
        message: error.message,
        data: null,
      };
    }
  }
}
