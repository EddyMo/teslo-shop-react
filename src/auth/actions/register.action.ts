import { tesloApi } from "@/api/tesloApi"
import type { AuthResponse } from "../interfaces/auth.response";

export const registerAction = async (
  fullName: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { data } = await tesloApi.post<AuthResponse>('/auth/register', {
      email,
      password,
      fullName,
    });
    console.log(data)

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}