import { useAuth } from "@/context/auth";
import { useNextToast } from "@/context/toast";
import { Profile } from "@/context/types/profile.type";

import axiosInstance from "@/lib/axiosInstance";

interface SignInProps {
  username: string,
  password: string
}

interface SignUpProps extends SignInProps {
  fullname: string,
  email: string
}

type AuthResult = {
  data: Profile | null,
  error: string | null
}

export const useUserAuth = () => {
  const { errorToast } = useNextToast();
  const { setIsEmptyProfile } = useAuth();

  async function signInWithUsernamePassword({ username, password }: SignInProps): Promise<AuthResult> {
    try {
      const res = await axiosInstance.post("/api/login", { username, password });
      if (res.status === 200 && res.data) {
        return { data: res.data, error: null };
      }
      return { data: null, error: "Incorrect email address or password." };
    } catch (error) {
      return { data: null, error: "Incorrect email address or password." };
    }
  }

  async function signUpWithEmailPassword({ fullname, username, email, password }: SignUpProps) {
    /* Not supported by DummyJSON */
  }

  async function signOut() {
    try {
      const res = await axiosInstance.post("/api/logout");
      if (res.status === 200) {
        setIsEmptyProfile(true);
      }
    } catch (error) {
      errorToast({ id: "sign-out", message: "Something went wrong" });
    }
  }

  return {
    signInWithUsernamePassword,
    signUpWithEmailPassword,
    signOut
  };
};