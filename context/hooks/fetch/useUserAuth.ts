import { Profile } from "@/context/types/profile.type";

import axiosInstance from "@/lib/axiosInstance";

type SignInProps = {
  email: string,
  password: string
}

type SignUpProps = SignInProps & {
  fullname: string
}

type AuthResult = {
  data: Profile | null,
  error: string | null
}

export const useUserAuth = () => {

  async function signInWithEmailPassword({ email, password }: SignInProps): Promise<AuthResult> {
    try {
      const res = await axiosInstance.post("/api/login", { email, password });
      if (res.status === 200 && res.data) {
        return { data: res.data, error: null };
      }
      return { data: null, error: "Incorrect email address or password." };
    } catch (error) {
      return { data: null, error: "Authentication failed" };
    }
  }

  async function signUpWithEmailPassword({ email, password, fullname }: SignUpProps) {


  }

  return {
    signInWithEmailPassword,
    signUpWithEmailPassword,
  };
};